import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PenTool,
  Search,
  BookOpen,
  LogOut,
  User,
  Menu,
  X,
  FileText,
  Sparkles,
  Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onSearch }) {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/25 group-hover:scale-105 transition-all">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
                DevVerse
              </span>
              <span className="text-[10px] block font-bold text-slate-600 uppercase tracking-widest -mt-1">
                Engineering Blog
              </span>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search articles, topics, authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-100 border border-slate-200 rounded-full focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all"
              />
              <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-2.5 group-focus-within:text-purple-600 transition-colors" />
            </div>
          </form>

          {/* Right Navigation */}
          <div className="flex items-center gap-3">
            {/* Write a Story button */}
            <Link
              to="/new-post"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all shadow-xs"
            >
              <Edit3 className="w-4 h-4 text-purple-600" />
              <span>Write Story</span>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs font-bold text-slate-700"
                >
                  <img
                    src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'}
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover bg-purple-100"
                  />
                  <span className="hidden sm:inline max-w-[110px] truncate">{user?.name}</span>
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-600">Signed in as</p>
                      <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{user?.name}</p>
                      <p className="text-[11px] text-slate-600 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/my-posts"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <FileText className="w-4 h-4 text-slate-600" />
                      My Published Stories
                    </Link>

                    <Link
                      to="/new-post"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50"
                    >
                      <Edit3 className="w-4 h-4 text-purple-600" />
                      Create New Article
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 text-left border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-purple-600 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm transition-all"
                >
                  Join
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-slate-600"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-3">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 rounded-xl outline-none"
                />
                <Search className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
              </div>
            </form>
            <div className="flex flex-col gap-1.5 pt-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                All Articles
              </Link>
              {isAuthenticated && (
                <Link
                  to="/my-posts"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  My Stories
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
