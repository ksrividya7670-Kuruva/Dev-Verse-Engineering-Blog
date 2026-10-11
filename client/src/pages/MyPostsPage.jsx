import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Edit2,
  Trash2,
  Eye,
  MessageSquare,
  Heart,
  Plus,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function MyPostsPage() {
  const { user, token, isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/posts/my-posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        showToast({
          title: 'Story Deleted',
          message: 'The post has been deleted.',
          type: 'info'
        });
        loadPosts();
      } else {
        const data = await res.json();
        alert(data.message || 'Delete failed');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Please Sign In to View Your Stories</h2>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 bg-purple-600 text-white font-bold rounded-xl text-xs"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-48 mb-6" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 bg-slate-200 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Published Stories</h1>
          <p className="text-xs text-slate-600 mt-1">
            Manage your articles, edit content, and track reader engagement
          </p>
        </div>

        <Link
          to="/new-post"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Story</span>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-base font-extrabold text-slate-800">You haven't published any stories yet</h3>
          <p className="text-xs text-slate-600">
            Share your technical expertise or engineering experiences with the community.
          </p>
          <Link
            to="/new-post"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white font-bold rounded-xl text-xs shadow-md"
          >
            Draft Your First Article
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={post.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-purple-300 transition-all"
              >
                <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold uppercase">
                      {post.category}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-600">{formattedDate}</span>
                  </div>

                  <Link to={`/post/${post.id}`}>
                    <h3 className="font-extrabold text-slate-900 text-base hover:text-purple-600 transition-colors truncate">
                      {post.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-4 text-xs text-slate-600 font-semibold pt-1">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> {post.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" /> {post._count?.comments || 0} comments
                    </span>
                    <span className="flex items-center gap-1 text-red-500">
                      <Heart className="w-3.5 h-3.5 fill-current" /> {post._count?.likes || 0} likes
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 flex-shrink-0">
                  <Link
                    to={`/post/${post.id}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    to={`/edit-post/${post.id}`}
                    className="p-2 rounded-xl text-slate-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
