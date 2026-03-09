'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { HashtagSet } from '@/types/ideas';

function mapRow(r: Record<string, unknown>): HashtagSet {
  return {
    id: r.id as string,
    name: r.name as string,
    hashtags: (r.hashtags as string[]) || [],
    platform: r.platform as HashtagSet['platform'],
    createdAt: r.created_at as string,
  };
}

export function useHashtags() {
  const { user } = useAuthContext();
  const [sets, setSets] = useState<HashtagSet[]>([]);

  const fetchSets = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('hashtag_sets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setSets(data.map(mapRow));
  }, [user]);

  useEffect(() => { fetchSets(); }, [fetchSets]);

  const addSet = useCallback(async (set: Omit<HashtagSet, 'id' | 'createdAt'>) => {
    if (!user) return;
    const { data } = await supabase
      .from('hashtag_sets')
      .insert({
        user_id: user.id,
        name: set.name,
        hashtags: set.hashtags,
        platform: set.platform,
      })
      .select()
      .single();
    if (data) setSets(prev => [mapRow(data), ...prev]);
  }, [user]);

  const updateSet = useCallback(async (id: string, updates: Partial<HashtagSet>) => {
    if (!user) return;
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.hashtags !== undefined) dbUpdates.hashtags = updates.hashtags;
    if (updates.platform !== undefined) dbUpdates.platform = updates.platform;

    const { data } = await supabase
      .from('hashtag_sets')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    if (data) setSets(prev => prev.map(s => s.id === id ? mapRow(data) : s));
  }, [user]);

  const deleteSet = useCallback(async (id: string) => {
    if (!user) return;
    await supabase.from('hashtag_sets').delete().eq('id', id).eq('user_id', user.id);
    setSets(prev => prev.filter(s => s.id !== id));
  }, [user]);

  return { sets, addSet, updateSet, deleteSet };
}
