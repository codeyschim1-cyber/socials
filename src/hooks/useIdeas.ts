'use client';

import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { ContentIdea } from '@/types/ideas';
import { v4 as uuid } from 'uuid';

export function useIdeas() {
  const [ideas, setIdeas] = useLocalStorage<ContentIdea[]>(STORAGE_KEYS.CONTENT_IDEAS, []);

  const addIdea = (idea: Omit<ContentIdea, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite'>) => {
    const now = new Date().toISOString();
    setIdeas(prev => [...prev, { ...idea, id: uuid(), isFavorite: false, createdAt: now, updatedAt: now }]);
  };

  const updateIdea = (id: string, updates: Partial<ContentIdea>) => {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i));
  };

  const deleteIdea = (id: string) => {
    setIdeas(prev => prev.filter(i => i.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, isFavorite: !i.isFavorite } : i));
  };

  return { ideas, addIdea, updateIdea, deleteIdea, toggleFavorite };
}
