import React, { useState } from 'react';
import { MessageSquare, Send, Trash2, Heart, AlertCircle, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function CommentSection({ postId, postAuthorId, comments = [], onCommentAdded, onCommentDeleted }) {
  const { user, token, isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ postId, content: content.trim() })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to post comment');

      setContent('');
      if (onCommentAdded) onCommentAdded(data.comment);

      showToast({
        title: 'Comment Posted! 💬',
        message: 'Your comment is now live on this article.',
        type: 'success'
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete');
      }

      if (onCommentDeleted) onCommentDeleted(commentId);

      showToast({
        title: 'Comment Deleted',
        message: 'The comment has been removed.',
        type: 'info'
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="space-y-6 pt-8 border-t border-slate-200">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          <span>Discussion & Comments ({comments.length})</span>
        </h3>
      </div>

      {/* Add Comment Box */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="bg-slate-50 rounded-3xl p-5 border border-slate-200/80 space-y-3">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-start gap-3">
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover bg-purple-100 flex-shrink-0 mt-1"
            />
            <div className="flex-1">
              <textarea
                required
                rows={3}
                placeholder="Share your perspectives, questions, or feedback on this article..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3.5 text-xs bg-white border border-slate-200 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none leading-relaxed transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-600/20 transition-all flex items-center gap-2 disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-purple-50/60 border border-purple-100 rounded-3xl p-6 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">Join the Conversation</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Sign in or create a quick account to leave a comment and interact with the author.
            </p>
          </div>
          <button
            onClick={() => openAuthModal('login')}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 transition-all"
          >
            Sign In to Comment
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4 pt-2">
        {comments.length === 0 ? (
          <div className="text-center py-10 px-4 bg-white rounded-3xl border border-slate-200/80 text-slate-600 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-bold text-xs">No comments yet</p>
            <p className="text-[11px]">Be the first to share your thoughts on this story!</p>
          </div>
        ) : (
          comments.map((comment) => {
            const isCommentAuthor = user && comment.authorId === user.id;
            const isPostAuthor = user && postAuthorId === user.id;
            const canDelete = isCommentAuthor || isPostAuthor || user?.role === 'ADMIN';

            const commentDate = new Date(comment.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={comment.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 space-y-3 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={comment.author?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Avatar'}
                      alt={comment.author?.name}
                      className="w-8 h-8 rounded-full object-cover bg-purple-100 border border-slate-100"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {comment.author?.name}
                        {comment.authorId === postAuthorId && (
                          <span className="ml-2 text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                            Author
                          </span>
                        )}
                      </h4>
                      <span className="text-[10px] text-slate-600">{commentDate}</span>
                    </div>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed pl-10 whitespace-pre-line">
                  {comment.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
