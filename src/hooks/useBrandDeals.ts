'use client';

import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { BrandDeal } from '@/types/brands';
import { v4 as uuid } from 'uuid';

export function useBrandDeals() {
  const [deals, setDeals] = useLocalStorage<BrandDeal[]>(STORAGE_KEYS.BRAND_DEALS, []);

  const addDeal = (deal: Omit<BrandDeal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    setDeals(prev => [...prev, { ...deal, id: uuid(), createdAt: now, updatedAt: now }]);
  };

  const updateDeal = (id: string, updates: Partial<BrandDeal>) => {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d));
  };

  const deleteDeal = (id: string) => {
    setDeals(prev => prev.filter(d => d.id !== id));
  };

  return { deals, addDeal, updateDeal, deleteDeal };
}
