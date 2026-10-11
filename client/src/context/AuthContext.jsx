import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('blog_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('blog_token') || null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const { showToast } = useToast();

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem('blog_user', JSON.stringify(data.user));
        } else {
          logout();
        }
      } catch (err) {
        console.error('Failed to verify session', err);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('blog_token', data.token);
    localStorage.setItem('blog_user', JSON.stringify(data.user));
    setIsAuthModalOpen(false);

    showToast({
      title: `Welcome back, ${data.user.name}! 👋`,
      message: 'You are now signed in.',
      type: 'success'
    });

    return data.user;
  };

  const register = async (name, email, password, bio) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, bio })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('blog_token', data.token);
    localStorage.setItem('blog_user', JSON.stringify(data.user));
    setIsAuthModalOpen(false);

    showToast({
      title: `Welcome to DevVerse, ${data.user.name}! 🎉`,
      message: 'Your author account is ready.',
      type: 'success'
    });

    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('blog_token');
    localStorage.removeItem('blog_user');
    showToast({
      title: 'Signed Out',
      message: 'You have been logged out.',
      type: 'info'
    });
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const loginDemoAuthor1 = () => login('alex@blog.com', 'Author@123');
  const loginDemoAuthor2 = () => login('sarah@blog.com', 'Author@123');
  const loginDemoReader = () => login('david@blog.com', 'Reader@123');

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    openAuthModal,
    closeAuthModal,
    login,
    register,
    logout,
    loginDemoAuthor1,
    loginDemoAuthor2,
    loginDemoReader
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
