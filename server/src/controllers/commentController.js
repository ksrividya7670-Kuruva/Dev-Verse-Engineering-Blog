import prisma from '../prisma.js';

export const createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;

    if (!postId || !content || !content.trim()) {
      return res.status(400).json({ message: 'Post ID and comment content are required.' });
    }

    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) }
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const comment = await prisma.comment.create({
      data: {
        postId: parseInt(postId),
        content: content.trim(),
        authorId: req.user.id
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true }
        }
      }
    });

    res.status(201).json({
      message: 'Comment posted successfully',
      comment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
      include: { post: true }
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    // Authorization: comment author, post author, or admin
    const isCommentAuthor = comment.authorId === req.user.id;
    const isPostAuthor = comment.post.authorId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
      return res.status(403).json({ message: 'You are not authorized to delete this comment.' });
    }

    await prisma.comment.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { likesCount: { increment: 1 } }
    });

    res.json({ likesCount: comment.likesCount });
  } catch (error) {
    res.status(500).json({ message: 'Error liking comment', error: error.message });
  }
};
