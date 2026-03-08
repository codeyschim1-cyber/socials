'use client';

import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { MetricEntry } from '@/types/analytics';
import { calculateEngagementRate } from '@/lib/analytics-utils';
import { v4 as uuid } from 'uuid';

export function useAnalytics() {
  const [entries, setEntries] = useLocalStorage<MetricEntry[]>(STORAGE_KEYS.ANALYTICS_ENTRIES, []);

  const addEntry = (entry: Omit<MetricEntry, 'id' | 'createdAt' | 'engagementRate'>) => {
    const engagementRate = calculateEngagementRate(entry.likes, entry.comments, entry.shares, entry.followers);
    setEntries(prev => [...prev, { ...entry, id: uuid(), engagementRate, createdAt: new Date().toISOString() }]);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  return { entries, addEntry, deleteEntry };
}
