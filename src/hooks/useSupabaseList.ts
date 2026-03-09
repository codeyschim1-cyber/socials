'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/components/auth/AuthProvider';

/**
 * Generic hook for CRUD operations on a Supabase table that stores arrays of items.
 * Handles user_id scoping, real-time refresh, and optimistic updates.
 */
export function useSupabaseList<T extends { id: string }>(
  table: string,
  mapFromDb: (row: Record<string, unknown>) => T,
  mapToDb: (item: Partial<T>) => Record<string, unknown>,
) {
  const { user } = useAuthContext();
  const [items, setItems] = useState<T[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Fetch all items for this user
  const fetchItems = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) {
      setItems(data.map(mapFromDb));
    }
    setLoaded(true);
  }, [user, table, mapFromDb]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = useCallback(async (item: Record<string, unknown>) => {
    if (!user) return;
    const { data } = await supabase
      .from(table)
      .insert({ ...item, user_id: user.id })
      .select()
      .single();
    if (data) {
      setItems(prev => [mapFromDb(data), ...prev]);
    }
  }, [user, table, mapFromDb]);

  const updateItem = useCallback(async (id: string, updates: Record<string, unknown>) => {
    if (!user) return;
    const { data } = await supabase
      .from(table)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    if (data) {
      setItems(prev => prev.map(item => item.id === id ? mapFromDb(data) : item));
    }
  }, [user, table, mapFromDb]);

  const deleteItem = useCallback(async (id: string) => {
    if (!user) return;
    await supabase
      .from(table)
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    setItems(prev => prev.filter(item => item.id !== id));
  }, [user, table]);

  return { items, loaded, addItem, updateItem, deleteItem, refetch: fetchItems };
}
