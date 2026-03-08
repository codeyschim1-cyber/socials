'use client';

import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { HashtagSet } from '@/types/ideas';
import { v4 as uuid } from 'uuid';

export function useHashtags() {
  const [sets, setSets] = useLocalStorage<HashtagSet[]>(STORAGE_KEYS.HASHTAG_SETS, []);

  const addSet = (set: Omit<HashtagSet, 'id' | 'createdAt'>) => {
    setSets(prev => [...prev, { ...set, id: uuid(), createdAt: new Date().toISOString() }]);
  };

  const updateSet = (id: string, updates: Partial<HashtagSet>) => {
    setSets(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSet = (id: string) => {
    setSets(prev => prev.filter(s => s.id !== id));
  };

  return { sets, addSet, updateSet, deleteSet };
}
