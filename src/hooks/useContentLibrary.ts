'use client';

import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { ContentEntry } from '@/types/content-library';
import { v4 as uuid } from 'uuid';

export function useContentLibrary() {
  const [entries, setEntries] = useLocalStorage<ContentEntry[]>(STORAGE_KEYS.CONTENT_LIBRARY, []);

  const addEntry = (entry: Omit<ContentEntry, 'id' | 'createdAt'>) => {
    setEntries(prev => [...prev, { ...entry, id: uuid(), createdAt: new Date().toISOString() }]);
  };

  const updateEntry = (id: string, updates: Partial<ContentEntry>) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  return { entries, addEntry, updateEntry, deleteEntry };
}
