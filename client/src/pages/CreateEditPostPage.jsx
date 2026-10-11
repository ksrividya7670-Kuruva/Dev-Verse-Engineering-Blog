import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  PenTool,
  Image,
  Eye,
  Edit3,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CATEGORIES, PRESET_COVERS, handleImageError } from '../utils/constants';

export default function CreateEditPostPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user, token, isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    category: 'Web Development',
    coverImage: PRESET_COVERS[0].url,
    excerpt: '',
    tags: 'React,Architecture,Tech',
    content: ''
  });

  const [activeTab, setActiveTab] = useState('write'); // 'write' or 'preview'
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetch(`/api/posts/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Post not found');
          return res.json();
        })
        .then((data) => {
          setForm({
            title: data.title,
            category: data.category,
            coverImage: data.coverImage,
            excerpt: data.excerpt,
            tags: data.tags,
            content: data.content
          });
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Please Sign In to Write</h2>
        <p className="text-xs text-slate-600">You need an author account to publish articles on DevVerse.</p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 bg-purple-600 text-white font-bold rounded-xl text-xs shadow-md"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const url = isEditing ? `/api/posts/${id}` : '/api/posts';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Operation failed');

      showToast({
        title: isEditing ? 'Story Updated! ✍️' : 'Story Published! 🚀',
        message: 'Your article is now live on DevVerse.',
        type: 'success'
      });

      navigate(`/post/${data.post.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="h-12 bg-slate-200 rounded" />
        <div className="h-64 bg-slate-200 rounded" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 mb-1">
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {isEditing ? 'Edit Story' : 'Draft a New Story'}
          </h1>
        </div>

        {/* Write vs Preview Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'write' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'preview' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {activeTab === 'write' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-5 shadow-sm">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Story Title</label>
              <input
                type="text"
                required
                placeholder="Give your story a clear, compelling title..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 text-sm sm:text-base font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-purple-500 outline-none"
              />
            </div>

            {/* Category & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-none cursor-pointer"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="React, Architecture, FullStack"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-none"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Brief Excerpt / Hook</label>
              <input
                type="text"
                placeholder="A short one-line summary displayed on article cards..."
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-none"
              />
            </div>

            {/* Cover Image Input & Preset Picker */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Cover Image URL</label>
              <input
                type="url"
                required
                value={form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-none font-mono text-[11px]"
              />

              <div className="pt-2">
                <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                  Or pick a curated cover image:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_COVERS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setForm({ ...form, coverImage: preset.url })}
                      className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                        form.coverImage === preset.url
                          ? 'border-purple-600 ring-2 ring-purple-500/20'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute inset-0 bg-slate-900/40 flex items-center justify-center text-[10px] font-bold text-white text-center p-1">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Story Content (Markdown supported)
              </label>
              <textarea
                required
                rows={12}
                placeholder="Write your article here... You can use headings (### Heading), bullet points (- Point), or regular paragraphs."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full p-4 text-xs sm:text-sm font-sans bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-purple-500 outline-none leading-relaxed"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/20 transition-all disabled:opacity-50"
            >
              {submitting ? 'Publishing...' : isEditing ? 'Save Changes' : 'Publish Story'}
            </button>
          </div>
        </form>
      ) : (
        /* Live Preview Mode */
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 space-y-6 shadow-sm">
          <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
            <img
              src={form.coverImage}
              alt="Preview Cover"
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-3">
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold uppercase">
              {form.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {form.title || 'Untitled Article'}
            </h1>
            <p className="text-sm text-slate-600 italic border-l-4 border-purple-500 pl-3">
              {form.excerpt || 'Article summary preview...'}
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-slate-800 text-xs sm:text-sm space-y-4 pt-4 border-t border-slate-100">
            {form.content ? (
              form.content.split('\n\n').map((para, i) => (
                <p key={i} className="whitespace-pre-line leading-relaxed">
                  {para}
                </p>
              ))
            ) : (
              <p className="text-slate-600 italic">No content written yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
