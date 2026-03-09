'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { IncomeEntry, IncomeGoal } from '@/types/brands';

function mapEntry(r: Record<string, unknown>): IncomeEntry {
  return {
    id: r.id as string,
    source: r.source as string,
    amount: Number(r.amount) || 0,
    currency: (r.currency as string) || 'USD',
    date: r.date as string,
    category: r.category as IncomeEntry['category'],
    dealId: (r.deal_id as string) || undefined,
    notes: (r.notes as string) || '',
    createdAt: r.created_at as string,
  };
}

function mapGoal(r: Record<string, unknown>): IncomeGoal {
  return {
    id: r.id as string,
    period: r.period as IncomeGoal['period'],
    targetAmount: Number(r.target_amount) || 0,
    currency: (r.currency as string) || 'USD',
    year: r.year as number,
    month: r.month != null ? (r.month as number) : undefined,
    createdAt: r.created_at as string,
  };
}

export function useIncome() {
  const { user } = useAuthContext();
  const [entries, setEntries] = useState<IncomeEntry[]>([]);
  const [goals, setGoals] = useState<IncomeGoal[]>([]);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    const [entriesRes, goalsRes] = await Promise.all([
      supabase.from('income_entries').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('income_goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ]);
    if (entriesRes.data) setEntries(entriesRes.data.map(mapEntry));
    if (goalsRes.data) setGoals(goalsRes.data.map(mapGoal));
  }, [user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const addEntry = useCallback(async (entry: Omit<IncomeEntry, 'id' | 'createdAt'>) => {
    if (!user) return;
    const { data } = await supabase
      .from('income_entries')
      .insert({
        user_id: user.id,
        source: entry.source,
        amount: entry.amount,
        currency: entry.currency,
        date: entry.date,
        category: entry.category,
        deal_id: entry.dealId,
        notes: entry.notes,
      })
      .select()
      .single();
    if (data) setEntries(prev => [mapEntry(data), ...prev]);
  }, [user]);

  const deleteEntry = useCallback(async (id: string) => {
    if (!user) return;
    await supabase.from('income_entries').delete().eq('id', id).eq('user_id', user.id);
    setEntries(prev => prev.filter(e => e.id !== id));
  }, [user]);

  const addGoal = useCallback(async (goal: Omit<IncomeGoal, 'id' | 'createdAt'>) => {
    if (!user) return;
    const { data } = await supabase
      .from('income_goals')
      .insert({
        user_id: user.id,
        period: goal.period,
        target_amount: goal.targetAmount,
        currency: goal.currency,
        year: goal.year,
        month: goal.month,
      })
      .select()
      .single();
    if (data) setGoals(prev => [mapGoal(data), ...prev]);
  }, [user]);

  const updateGoal = useCallback(async (id: string, updates: Partial<IncomeGoal>) => {
    if (!user) return;
    const dbUpdates: Record<string, unknown> = {};
    if (updates.period !== undefined) dbUpdates.period = updates.period;
    if (updates.targetAmount !== undefined) dbUpdates.target_amount = updates.targetAmount;
    if (updates.currency !== undefined) dbUpdates.currency = updates.currency;
    if (updates.year !== undefined) dbUpdates.year = updates.year;
    if (updates.month !== undefined) dbUpdates.month = updates.month;

    const { data } = await supabase
      .from('income_goals')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    if (data) setGoals(prev => prev.map(g => g.id === id ? mapGoal(data) : g));
  }, [user]);

  const deleteGoal = useCallback(async (id: string) => {
    if (!user) return;
    await supabase.from('income_goals').delete().eq('id', id).eq('user_id', user.id);
    setGoals(prev => prev.filter(g => g.id !== id));
  }, [user]);

  return { entries, goals, addEntry, deleteEntry, addGoal, updateGoal, deleteGoal };
}
