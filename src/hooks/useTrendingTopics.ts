'use client';

import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { TrendingTopic } from '@/types/ideas';
import { v4 as uuid } from 'uuid';

export function useTrendingTopics() {
  const [topics, setTopics] = useLocalStorage<TrendingTopic[]>(STORAGE_KEYS.TRENDING_TOPICS, []);

  const addTopic = (topic: Omit<TrendingTopic, 'id' | 'createdAt'>) => {
    setTopics(prev => [...prev, { ...topic, id: uuid(), createdAt: new Date().toISOString() }]);
  };

  const updateTopic = (id: string, updates: Partial<TrendingTopic>) => {
    setTopics(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTopic = (id: string) => {
    setTopics(prev => prev.filter(t => t.id !== id));
  };

  return { topics, addTopic, updateTopic, deleteTopic };
}
