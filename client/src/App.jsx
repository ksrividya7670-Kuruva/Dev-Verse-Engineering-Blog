import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import CreateEditPostPage from './pages/CreateEditPostPage';
import MyPostsPage from './pages/MyPostsPage';

export default function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-purple-600 selection:text-white">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/post/:id" element={<PostDetailPage />} />
                <Route path="/new-post" element={<CreateEditPostPage />} />
                <Route path="/edit-post/:id" element={<CreateEditPostPage />} />
                <Route path="/my-posts" element={<MyPostsPage />} />
              </Routes>
            </main>
            <Footer />
            <AuthModal />
          </div>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}
