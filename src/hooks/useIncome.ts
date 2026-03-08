'use client';

import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { IncomeEntry, IncomeGoal } from '@/types/brands';
import { v4 as uuid } from 'uuid';

export function useIncome() {
  const [entries, setEntries] = useLocalStorage<IncomeEntry[]>(STORAGE_KEYS.INCOME_ENTRIES, []);
  const [goals, setGoals] = useLocalStorage<IncomeGoal[]>(STORAGE_KEYS.INCOME_GOALS, []);

  const addEntry = (entry: Omit<IncomeEntry, 'id' | 'createdAt'>) => {
    setEntries(prev => [...prev, { ...entry, id: uuid(), createdAt: new Date().toISOString() }]);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const addGoal = (goal: Omit<IncomeGoal, 'id' | 'createdAt'>) => {
    setGoals(prev => [...prev, { ...goal, id: uuid(), createdAt: new Date().toISOString() }]);
  };

  const updateGoal = (id: string, updates: Partial<IncomeGoal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  return { entries, goals, addEntry, deleteEntry, addGoal, updateGoal, deleteGoal };
}
