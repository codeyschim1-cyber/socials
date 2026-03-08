'use client';

import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { CalendarPost, PostStatus } from '@/types/calendar';
import { Platform } from '@/types/common';
import { v4 as uuid } from 'uuid';

export function useCalendarPosts() {
  const [posts, setPosts] = useLocalStorage<CalendarPost[]>(STORAGE_KEYS.CALENDAR_POSTS, []);

  const addPost = (post: Omit<CalendarPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    setPosts(prev => [...prev, { ...post, id: uuid(), createdAt: now, updatedAt: now }]);
  };

  const updatePost = (id: string, updates: Partial<CalendarPost>) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const getPostsByDate = (date: string) => posts.filter(p => p.scheduledDate === date);
  const getPostsByStatus = (status: PostStatus) => posts.filter(p => p.status === status);
  const getPostsByPlatform = (platform: Platform) => posts.filter(p => p.platform === platform || p.platform === 'all');

  return { posts, addPost, updatePost, deletePost, getPostsByDate, getPostsByStatus, getPostsByPlatform };
}
