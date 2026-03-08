'use client';

import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { ContentPillar } from '@/types/ideas';
import { v4 as uuid } from 'uuid';

export function useContentPillars() {
  const [pillars, setPillars] = useLocalStorage<ContentPillar[]>(STORAGE_KEYS.CONTENT_PILLARS, []);

  const addPillar = (pillar: Omit<ContentPillar, 'id' | 'createdAt'>) => {
    setPillars(prev => [...prev, { ...pillar, id: uuid(), createdAt: new Date().toISOString() }]);
  };

  const updatePillar = (id: string, updates: Partial<ContentPillar>) => {
    setPillars(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePillar = (id: string) => {
    setPillars(prev => prev.filter(p => p.id !== id));
  };

  return { pillars, addPillar, updatePillar, deletePillar };
}
