import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, AlertCircle, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    login,
    register,
    loginDemoAuthor1,
    loginDemoAuthor2,
    loginDemoReader
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authModalTab === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, bio);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (fn) => {
    setError('');
    setLoading(true);
    try {
      await fn();
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-slate-600 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-0">
          <div className="text-center mb-5">
            <h3 className="text-xl font-black text-slate-900">
              {authModalTab === 'login' ? 'Sign In to DevVerse' : 'Create an Author Account'}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Join the community to publish engineering stories and join the conversation.
            </p>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-3 mb-4">
            <div className="flex items-center gap-1.5 text-purple-900 font-bold text-xs mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Instant Evaluator Demo Logins</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleDemo(loginDemoAuthor1)}
                disabled={loading}
                className="py-1.5 px-2 bg-white hover:bg-purple-600 hover:text-white text-purple-900 text-[11px] font-bold rounded-lg border border-purple-200 shadow-xs transition-all"
              >
                ✍️ Author 1
              </button>
              <button
                type="button"
                onClick={() => handleDemo(loginDemoAuthor2)}
                disabled={loading}
                className="py-1.5 px-2 bg-white hover:bg-purple-600 hover:text-white text-purple-900 text-[11px] font-bold rounded-lg border border-purple-200 shadow-xs transition-all"
              >
                ✍️ Author 2
              </button>
              <button
                type="button"
                onClick={() => handleDemo(loginDemoReader)}
                disabled={loading}
                className="py-1.5 px-2 bg-white hover:bg-purple-600 hover:text-white text-purple-900 text-[11px] font-bold rounded-lg border border-purple-200 shadow-xs transition-all"
              >
                👤 Reader
              </button>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => {
                setAuthModalTab('login');
                setError('');
              }}
              className={`flex-1 pb-3 text-xs font-bold border-b-2 transition-colors ${
                authModalTab === 'login'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => {
                setAuthModalTab('register');
                setError('');
              }}
              className={`flex-1 pb-3 text-xs font-bold border-b-2 transition-colors ${
                authModalTab === 'register'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {authModalTab === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-none"
                />
                <User className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="author@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-none"
              />
              <Mail className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-none"
              />
              <Lock className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
            </div>
          </div>

          {authModalTab === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Short Bio</label>
              <input
                type="text"
                placeholder="Software engineer, writer, etc."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md shadow-purple-600/20 text-xs transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Please wait...' : authModalTab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
