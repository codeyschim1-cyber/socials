'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { ContentPillar } from '@/types/ideas';

function mapRow(r: Record<string, unknown>): ContentPillar {
  return {
    id: r.id as string,
    name: r.name as string,
    description: (r.description as string) || '',
    color: (r.color as string) || '#8b5cf6',
    createdAt: r.created_at as string,
  };
}

export function useContentPillars() {
  const { user } = useAuthContext();
  const [pillars, setPillars] = useState<ContentPillar[]>([]);

  const fetchPillars = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('content_pillars')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setPillars(data.map(mapRow));
  }, [user]);

  useEffect(() => { fetchPillars(); }, [fetchPillars]);

  const addPillar = useCallback(async (pillar: Omit<ContentPillar, 'id' | 'createdAt'>) => {
    if (!user) return;
    const { data } = await supabase
      .from('content_pillars')
      .insert({
        user_id: user.id,
        name: pillar.name,
        description: pillar.description,
        color: pillar.color,
      })
      .select()
      .single();
    if (data) setPillars(prev => [mapRow(data), ...prev]);
  }, [user]);

  const updatePillar = useCallback(async (id: string, updates: Partial<ContentPillar>) => {
    if (!user) return;
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.color !== undefined) dbUpdates.color = updates.color;

    const { data } = await supabase
      .from('content_pillars')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    if (data) setPillars(prev => prev.map(p => p.id === id ? mapRow(data) : p));
  }, [user]);

  const deletePillar = useCallback(async (id: string) => {
    if (!user) return;
    await supabase.from('content_pillars').delete().eq('id', id).eq('user_id', user.id);
    setPillars(prev => prev.filter(p => p.id !== id));
  }, [user]);

  return { pillars, addPillar, updatePillar, deletePillar };
}
