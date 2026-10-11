export const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80';

export const handleImageError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = FALLBACK_COVER;
};

export const CATEGORIES = [
  'All',
  'Web Development',
  'AI & Machine Learning',
  'UI/UX Design',
  'Cloud Architecture',
  'Software Engineering'
];

export const PRESET_COVERS = [
  {
    name: 'Modern Web Workspace',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Artificial Intelligence',
    url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Design & Interfaces',
    url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Coding & Algorithms',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80'
  }
];
