import prisma from '../prisma.js';

const generateSlug = (title) => {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const uniqueSuffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${uniqueSuffix}`;
};

export const getPosts = async (req, res) => {
  try {
    const {
      search,
      category,
      tag,
      authorId,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const where = { published: true };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } }
      ];
    }

    if (category && category !== 'All') {
      where.category = category;
    }

    if (tag) {
      where.tags = { contains: tag };
    }

    if (authorId) {
      where.authorId = parseInt(authorId);
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    else if (sort === 'views') orderBy = { views: 'desc' };

    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          author: {
            select: { id: true, name: true, avatar: true, bio: true }
          },
          _count: {
            select: { comments: true, likes: true }
          }
        }
      }),
      prisma.post.count({ where })
    ]);

    // Format posts
    const formatted = posts.map((p) => ({
      ...p,
      commentsCount: p._count.comments,
      likesCount: p._count.likes
    }));

    res.json({
      posts: formatted,
      totalCount,
      totalPages: Math.ceil(totalCount / take),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const postId = parseInt(id);

    // Increment views
    const post = await prisma.post.update({
      where: { id: postId },
      data: { views: { increment: 1 } },
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar: true, bio: true }
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: { id: true, name: true, avatar: true }
            }
          }
        },
        _count: {
          select: { likes: true, comments: true }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    let isLikedByMe = false;
    if (req.user) {
      const userLike = await prisma.postLike.findUnique({
        where: {
          postId_userId: {
            postId: post.id,
            userId: req.user.id
          }
        }
      });
      isLikedByMe = !!userLike;
    }

    res.json({
      ...post,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      isLikedByMe
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, excerpt, content, coverImage, category, tags } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content, and category are required.' });
    }

    const calculatedExcerpt = excerpt?.trim() || content.slice(0, 160) + '...';
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const defaultImage = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80';

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        slug: generateSlug(title),
        excerpt: calculatedExcerpt,
        content: content.trim(),
        coverImage: coverImage?.trim() || defaultImage,
        category: category.trim(),
        tags: tags?.trim() || 'Tech,Coding',
        readTime,
        authorId: req.user.id
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true }
        }
      }
    });

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, coverImage, category, tags, published } = req.body;

    const existing = await prisma.post.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Authorization: author or admin
    if (existing.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You are not authorized to edit this post' });
    }

    let readTime = existing.readTime;
    if (content) {
      const wordCount = content.split(/\s+/).length;
      readTime = Math.max(1, Math.ceil(wordCount / 200));
    }

    const updated = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title: title.trim() }),
        ...(excerpt && { excerpt: excerpt.trim() }),
        ...(content && { content: content.trim(), readTime }),
        ...(coverImage && { coverImage: coverImage.trim() }),
        ...(category && { category: category.trim() }),
        ...(tags && { tags: tags.trim() }),
        ...(published !== undefined && { published: Boolean(published) })
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true }
        }
      }
    });

    res.json({ message: 'Post updated successfully', post: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.post.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (existing.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }

    await prisma.post.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;

    const existing = await prisma.postLike.findUnique({
      where: {
        postId_userId: { postId, userId }
      }
    });

    let isLiked = false;
    if (existing) {
      await prisma.postLike.delete({
        where: { id: existing.id }
      });
      isLiked = false;
    } else {
      await prisma.postLike.create({
        data: { postId, userId }
      });
      isLiked = true;
    }

    const totalLikes = await prisma.postLike.count({ where: { postId } });

    res.json({ isLiked, totalLikes });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling like', error: error.message });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { authorId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { comments: true, likes: true }
        }
      }
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your posts', error: error.message });
  }
};
