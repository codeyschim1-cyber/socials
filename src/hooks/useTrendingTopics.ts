'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { TrendingTopic } from '@/types/ideas';

function mapRow(r: Record<string, unknown>): TrendingTopic {
  return {
    id: r.id as string,
    topic: r.topic as string,
    platform: r.platform as TrendingTopic['platform'],
    notes: (r.notes as string) || '',
    dateSpotted: r.date_spotted as string,
    isActive: (r.is_active as boolean) ?? true,
    createdAt: r.created_at as string,
  };
}

export function useTrendingTopics() {
  const { user } = useAuthContext();
  const [topics, setTopics] = useState<TrendingTopic[]>([]);

  const fetchTopics = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('trending_topics')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setTopics(data.map(mapRow));
  }, [user]);

  useEffect(() => { fetchTopics(); }, [fetchTopics]);

  const addTopic = useCallback(async (topic: Omit<TrendingTopic, 'id' | 'createdAt'>) => {
    if (!user) return;
    const { data } = await supabase
      .from('trending_topics')
      .insert({
        user_id: user.id,
        topic: topic.topic,
        platform: topic.platform,
        notes: topic.notes,
        date_spotted: topic.dateSpotted,
        is_active: topic.isActive,
      })
      .select()
      .single();
    if (data) setTopics(prev => [mapRow(data), ...prev]);
  }, [user]);

  const updateTopic = useCallback(async (id: string, updates: Partial<TrendingTopic>) => {
    if (!user) return;
    const dbUpdates: Record<string, unknown> = {};
    if (updates.topic !== undefined) dbUpdates.topic = updates.topic;
    if (updates.platform !== undefined) dbUpdates.platform = updates.platform;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.dateSpotted !== undefined) dbUpdates.date_spotted = updates.dateSpotted;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;

    const { data } = await supabase
      .from('trending_topics')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    if (data) setTopics(prev => prev.map(t => t.id === id ? mapRow(data) : t));
  }, [user]);

  const deleteTopic = useCallback(async (id: string) => {
    if (!user) return;
    await supabase.from('trending_topics').delete().eq('id', id).eq('user_id', user.id);
    setTopics(prev => prev.filter(t => t.id !== id));
  }, [user]);

  return { topics, addTopic, updateTopic, deleteTopic };
}
