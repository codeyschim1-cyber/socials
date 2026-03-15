'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { StoreEntry } from '@/types/stores';

export function useStoreLog() {
  const { user } = useAuthContext();
  const [stores, setStores] = useState<StoreEntry[]>([]);

  const fetchStores = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('store_log')
      .select('*')
      .eq('user_id', user.id)
      .order('date_visited', { ascending: false });
    if (data) {
      setStores(data.map(r => ({
        id: r.id,
        name: r.name,
        type: r.type,
        location: r.location ?? '',
        state: r.state ?? '',
        dateVisited: r.date_visited,
        rating: r.rating ?? 3,
        knownFor: r.known_for ?? '',
        bestSections: r.best_sections ?? '',
        priceRange: r.price_range ?? 'moderate',
        worthReturning: r.worth_returning ?? true,
        contentMade: r.content_made ?? '',
        notes: r.notes ?? '',
        createdAt: r.created_at,
      })));
    }
  }, [user]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const addStore = useCallback(async (store: Omit<StoreEntry, 'id' | 'createdAt'>) => {
    if (!user) return;
    const { data } = await supabase
      .from('store_log')
      .insert({
        user_id: user.id,
        name: store.name,
        type: store.type,
        location: store.location,
        state: store.state,
        date_visited: store.dateVisited,
        rating: store.rating,
        known_for: store.knownFor,
        best_sections: store.bestSections,
        price_range: store.priceRange,
        worth_returning: store.worthReturning,
        content_made: store.contentMade,
        notes: store.notes,
      })
      .select()
      .single();
    if (data) {
      setStores(prev => [{
        id: data.id,
        name: data.name,
        type: data.type,
        location: data.location ?? '',
        state: data.state ?? '',
        dateVisited: data.date_visited,
        rating: data.rating ?? 3,
        knownFor: data.known_for ?? '',
        bestSections: data.best_sections ?? '',
        priceRange: data.price_range ?? 'moderate',
        worthReturning: data.worth_returning ?? true,
        contentMade: data.content_made ?? '',
        notes: data.notes ?? '',
        createdAt: data.created_at,
      }, ...prev]);
    }
  }, [user]);

  const updateStore = useCallback(async (id: string, updates: Partial<Omit<StoreEntry, 'id' | 'createdAt'>>) => {
    if (!user) return;
    const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.type !== undefined) dbUpdates.type = updates.type;
    if (updates.location !== undefined) dbUpdates.location = updates.location;
    if (updates.state !== undefined) dbUpdates.state = updates.state;
    if (updates.dateVisited !== undefined) dbUpdates.date_visited = updates.dateVisited;
    if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
    if (updates.knownFor !== undefined) dbUpdates.known_for = updates.knownFor;
    if (updates.bestSections !== undefined) dbUpdates.best_sections = updates.bestSections;
    if (updates.priceRange !== undefined) dbUpdates.price_range = updates.priceRange;
    if (updates.worthReturning !== undefined) dbUpdates.worth_returning = updates.worthReturning;
    if (updates.contentMade !== undefined) dbUpdates.content_made = updates.contentMade;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

    await supabase.from('store_log').update(dbUpdates).eq('id', id).eq('user_id', user.id);
    setStores(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, [user]);

  const deleteStore = useCallback(async (id: string) => {
    if (!user) return;
    await supabase.from('store_log').delete().eq('id', id).eq('user_id', user.id);
    setStores(prev => prev.filter(s => s.id !== id));
  }, [user]);

  return { stores, addStore, updateStore, deleteStore };
}
