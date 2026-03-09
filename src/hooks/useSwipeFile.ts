'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { SwipeFileEntry } from '@/types/ideas';

function mapRow(r: Record<string, unknown>): SwipeFileEntry {
  return {
    id: r.id as string,
    title: r.title as string,
    sourceUrl: (r.source_url as string) || undefined,
    notes: (r.notes as string) || '',
    platform: r.platform as SwipeFileEntry['platform'],
    tags: (r.tags as string[]) || [],
    createdAt: r.created_at as string,
  };
}

export function useSwipeFile() {
  const { user } = useAuthContext();
  const [entries, setEntries] = useState<SwipeFileEntry[]>([]);

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('swipe_file')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setEntries(data.map(mapRow));
  }, [user]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const addEntry = useCallback(async (entry: Omit<SwipeFileEntry, 'id' | 'createdAt'>) => {
    if (!user) return;
    const { data } = await supabase
      .from('swipe_file')
      .insert({
        user_id: user.id,
        title: entry.title,
        source_url: entry.sourceUrl,
        notes: entry.notes,
        platform: entry.platform,
        tags: entry.tags,
      })
      .select()
      .single();
    if (data) setEntries(prev => [mapRow(data), ...prev]);
  }, [user]);

  const updateEntry = useCallback(async (id: string, updates: Partial<SwipeFileEntry>) => {
    if (!user) return;
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.sourceUrl !== undefined) dbUpdates.source_url = updates.sourceUrl;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.platform !== undefined) dbUpdates.platform = updates.platform;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;

    const { data } = await supabase
      .from('swipe_file')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    if (data) setEntries(prev => prev.map(e => e.id === id ? mapRow(data) : e));
  }, [user]);

  const deleteEntry = useCallback(async (id: string) => {
    if (!user) return;
    await supabase.from('swipe_file').delete().eq('id', id).eq('user_id', user.id);
    setEntries(prev => prev.filter(e => e.id !== id));
  }, [user]);

  return { entries, addEntry, updateEntry, deleteEntry };
}
