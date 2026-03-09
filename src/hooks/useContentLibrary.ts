'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { ContentEntry } from '@/types/content-library';

function mapRow(r: Record<string, unknown>): ContentEntry {
  return {
    id: r.id as string,
    title: r.title as string,
    url: (r.url as string) || undefined,
    platform: r.platform as ContentEntry['platform'],
    type: r.type as ContentEntry['type'],
    notes: (r.notes as string) || '',
    performance: (r.performance as string) || undefined,
    createdAt: r.created_at as string,
  };
}

export function useContentLibrary() {
  const { user } = useAuthContext();
  const [entries, setEntries] = useState<ContentEntry[]>([]);

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('content_library')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setEntries(data.map(mapRow));
  }, [user]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const addEntry = useCallback(async (entry: Omit<ContentEntry, 'id' | 'createdAt'>) => {
    if (!user) return;
    const { data } = await supabase
      .from('content_library')
      .insert({
        user_id: user.id,
        title: entry.title,
        url: entry.url,
        platform: entry.platform,
        type: entry.type,
        notes: entry.notes,
        performance: entry.performance,
      })
      .select()
      .single();
    if (data) setEntries(prev => [mapRow(data), ...prev]);
  }, [user]);

  const updateEntry = useCallback(async (id: string, updates: Partial<ContentEntry>) => {
    if (!user) return;
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.url !== undefined) dbUpdates.url = updates.url;
    if (updates.platform !== undefined) dbUpdates.platform = updates.platform;
    if (updates.type !== undefined) dbUpdates.type = updates.type;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.performance !== undefined) dbUpdates.performance = updates.performance;

    const { data } = await supabase
      .from('content_library')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    if (data) setEntries(prev => prev.map(e => e.id === id ? mapRow(data) : e));
  }, [user]);

  const deleteEntry = useCallback(async (id: string) => {
    if (!user) return;
    await supabase.from('content_library').delete().eq('id', id).eq('user_id', user.id);
    setEntries(prev => prev.filter(e => e.id !== id));
  }, [user]);

  return { entries, addEntry, updateEntry, deleteEntry };
}
