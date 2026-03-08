'use client';

import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { SwipeFileEntry } from '@/types/ideas';
import { v4 as uuid } from 'uuid';

export function useSwipeFile() {
  const [entries, setEntries] = useLocalStorage<SwipeFileEntry[]>(STORAGE_KEYS.SWIPE_FILE, []);

  const addEntry = (entry: Omit<SwipeFileEntry, 'id' | 'createdAt'>) => {
    setEntries(prev => [...prev, { ...entry, id: uuid(), createdAt: new Date().toISOString() }]);
  };

  const updateEntry = (id: string, updates: Partial<SwipeFileEntry>) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  return { entries, addEntry, updateEntry, deleteEntry };
}
