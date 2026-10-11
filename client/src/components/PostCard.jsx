import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MessageSquare, Heart, Eye } from 'lucide-react';
import { handleImageError } from '../utils/constants';

export default function PostCard({ post }) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="group bg-white rounded-3xl border border-slate-200/80 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1.5">
      {/* Cover Image */}
      <Link to={`/post/${post.id}`} className="relative aspect-video overflow-hidden bg-slate-100 block">
        <img
          src={post.coverImage}
          alt={post.title}
          onError={handleImageError}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-slate-800 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
          {post.category}
        </span>
      </Link>

      {/* Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Author Row */}
          <div className="flex items-center gap-2.5">
            <img
              src={post.author?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'}
              alt={post.author?.name}
              className="w-7 h-7 rounded-full object-cover bg-purple-100 border border-slate-100"
            />
            <div className="text-[11px] leading-tight">
              <span className="font-bold text-slate-900 block">{post.author?.name}</span>
              <span className="text-slate-600">{formattedDate}</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/post/${post.id}`}>
            <h3 className="font-extrabold text-slate-900 text-base group-hover:text-purple-600 transition-colors line-clamp-2 leading-snug">
              {post.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Card Footer Meta */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-semibold">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            <span>{post.readTime} min read</span>
          </div>

          <div className="flex items-center gap-3.5">
            <span className="flex items-center gap-1 hover:text-purple-600 transition-colors">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{post.commentsCount || 0}</span>
            </span>

            <span className="flex items-center gap-1 hover:text-red-500 transition-colors">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
              <span>{post.likesCount || 0}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
