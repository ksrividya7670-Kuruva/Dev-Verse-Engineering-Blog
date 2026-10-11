import React from 'react';
import { PenTool, Heart, Sparkles, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                <PenTool className="w-4 h-4" />
              </div>
              <span className="font-black text-lg text-white">DevVerse</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              A full-stack engineering and technology blogging platform with interactive commenting, author publishing tools, and relational database persistence.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Popular Categories</h5>
            <ul className="text-xs space-y-2 text-slate-600">
              <li>Web Development</li>
              <li>AI & Machine Learning</li>
              <li>Cloud & DevOps</li>
              <li>System Architecture</li>
              <li>UI/UX Design</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Author Tools</h5>
            <ul className="text-xs space-y-2 text-slate-600">
              <li>Markdown Post Editor</li>
              <li>Interactive Comments & Reactions</li>
              <li>Reading Time Estimation</li>
              <li>Author Story Management</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Tech Specifications</h5>
            <div className="text-xs space-y-1.5 text-slate-600">
              <p>⚡ React 18 + Vite</p>
              <p>🚀 Node.js + Express REST APIs</p>
              <p>🗄️ Prisma ORM with SQLite</p>
              <p>🔐 JWT Authentication & Authorization</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          © 2026 DevVerse Blog Platform. Full-Stack Web Application.
        </div>
      </div>
    </footer>
  );
}
