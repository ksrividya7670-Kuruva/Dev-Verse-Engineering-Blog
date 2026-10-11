import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Edit2,
  Trash2,
  ArrowLeft,
  Check,
  Bookmark,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CommentSection from '../components/CommentSection';
import { handleImageError } from '../utils/constants';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    fetch(`/api/posts/${id}`, { headers })
      .then((res) => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setIsLiked(data.isLikedByMe || false);
        setLikesCount(data.likesCount || 0);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    try {
      const res = await fetch(`/api/posts/${id}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setIsLiked(data.isLiked);
      setLikesCount(data.totalLikes);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast({
      title: 'Link Copied! 📋',
      message: 'Article URL copied to your clipboard.',
      type: 'info'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        showToast({
          title: 'Article Deleted',
          message: 'Your story has been permanently removed.',
          type: 'info'
        });
        navigate('/');
      } else {
        const data = await res.json();
        alert(data.message || 'Delete failed');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 animate-pulse space-y-6">
        <div className="h-6 bg-slate-200 rounded w-1/4" />
        <div className="h-10 bg-slate-200 rounded w-3/4" />
        <div className="h-64 bg-slate-200 rounded-3xl" />
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Article Not Found</h2>
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold">
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </Link>
      </div>
    );
  }

  const isOwner = user && (user.id === post.authorId || user.role === 'ADMIN');
  const postDate = new Date(post.createdAt).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Back Link */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700">
        <ArrowLeft className="w-4 h-4" /> Back to Articles
      </Link>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-extrabold uppercase tracking-wider">
            {post.category}
          </span>
          <span className="text-xs text-slate-600">•</span>
          <span className="text-xs text-slate-600 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {post.readTime} min read
          </span>
          <span className="text-xs text-slate-600">•</span>
          <span className="text-xs text-slate-600 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> {post.views} views
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
          {post.title}
        </h1>

        <p className="text-base text-slate-600 leading-relaxed font-serif italic border-l-4 border-purple-500 pl-4 py-1">
          {post.excerpt}
        </p>

        {/* Author bar */}
        <div className="flex items-center justify-between py-4 border-y border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={post.author?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Author'}
              alt={post.author?.name}
              className="w-10 h-10 rounded-full object-cover bg-purple-100 border border-slate-100"
            />
            <div>
              <h4 className="font-bold text-slate-900 text-xs">{post.author?.name}</h4>
              <p className="text-[11px] text-slate-600">Published on {postDate}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {isOwner && (
              <>
                <Link
                  to={`/edit-post/${post.id}`}
                  className="p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                  title="Edit Story"
                >
                  <Edit2 className="w-4 h-4" />
                </Link>
                <button
                  onClick={handleDeletePost}
                  className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Delete Story"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={handleCopyLink}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Share Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="rounded-3xl overflow-hidden aspect-video bg-slate-100 border border-slate-100 shadow-sm">
        <img
          src={post.coverImage}
          alt={post.title}
          onError={handleImageError}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Article Body */}
      <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm sm:text-base space-y-5 font-sans">
        {post.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-xl sm:text-2xl font-black text-slate-900 pt-4 pb-1">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
            return (
              <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 my-2 text-xs sm:text-sm">
                <p className="whitespace-pre-line leading-relaxed">{paragraph}</p>
              </div>
            );
          }
          return (
            <p key={idx} className="leading-relaxed whitespace-pre-line text-slate-700">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Floating Reaction Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isLiked
                ? 'bg-red-50 text-red-600 border border-red-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-600' : ''}`} />
            <span>{likesCount} Likes</span>
          </button>

          <a
            href="#comments"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.comments?.length || 0} Comments</span>
          </a>
        </div>

        <button
          onClick={handleCopyLink}
          className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1.5 pr-2"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Story</span>
        </button>
      </div>

      {/* Author Spotlight Card */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-3xl p-6 sm:p-8 flex items-center gap-5">
        <img
          src={post.author?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Author'}
          alt={post.author?.name}
          className="w-16 h-16 rounded-full object-cover bg-purple-200 border-2 border-white shadow-sm flex-shrink-0"
        />
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-purple-700">About the Author</span>
          <h4 className="font-extrabold text-slate-900 text-base">{post.author?.name}</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {post.author?.bio || 'Author, contributor, and developer at DevVerse.'}
          </p>
        </div>
      </div>

      {/* Comments Section */}
      <div id="comments">
        <CommentSection
          postId={post.id}
          postAuthorId={post.authorId}
          comments={post.comments}
          onCommentAdded={(newComment) => {
            setPost({ ...post, comments: [newComment, ...(post.comments || [])] });
          }}
          onCommentDeleted={(commentId) => {
            setPost({ ...post, comments: post.comments.filter((c) => c.id !== commentId) });
          }}
        />
      </div>
    </article>
  );
}
