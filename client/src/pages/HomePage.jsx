import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  Search,
  ArrowUpDown,
  BookOpen,
  Edit3,
  TrendingUp,
  Flame,
  CheckCircle2
} from 'lucide-react';
import PostCard from '../components/PostCard';
import { CATEGORIES } from '../utils/constants';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'All') {
          query.set('category', selectedCategory);
        }
        if (search) {
          query.set('search', search);
        }
        if (sort) {
          query.set('sort', sort);
        }

        const res = await fetch(`/api/posts?${query.toString()}`);
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error('Failed to load posts', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory, search, sort]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Showcase Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-14 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold backdrop-blur-md border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Engineering Knowledge Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ideas, insights & software stories that matter.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Discover peer-reviewed architectural patterns, autonomous AI frameworks, and developer workflows from engineers around the world.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/new-post"
              className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xl shadow-purple-600/30 transition-all hover:scale-105 flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Start Writing Your Story</span>
            </Link>
            <a
              href="#stories"
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-md transition-all"
            >
              Explore Articles
            </a>
          </div>
        </div>

        {/* Decorative blur element */}
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />
      </section>

      {/* Main Content & Filtering Section */}
      <section id="stories" className="space-y-6">
        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-600 absolute left-2.5 top-2.5" />
            </div>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-bold py-2 pl-3 pr-8 rounded-xl outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="newest">Sort: Newest</option>
                <option value="views">Most Read (Views)</option>
                <option value="oldest">Oldest</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-600 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200 p-5 animate-pulse space-y-4">
                <div className="aspect-video bg-slate-200 rounded-2xl" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-6 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-600">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">No articles found</h3>
            <p className="text-xs text-slate-600">
              Try adjusting your search keywords or choosing a different category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearch('');
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
