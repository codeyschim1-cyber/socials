'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { PerformanceEntry } from '@/types/performance';

export function usePerformanceLog() {
  const { user } = useAuthContext();
  const [entries, setEntries] = useState<PerformanceEntry[]>([]);

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('performance_log')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    if (data) {
      setEntries(data.map(r => ({
        id: r.id,
        title: r.title,
        platform: r.platform,
        formatType: r.format_type,
        hookType: r.hook_type,
        keyItem: r.key_item ?? '',
        pricePoint: r.price_point ?? '',
        location: r.location ?? '',
        views: r.views ?? 0,
        likes: r.likes ?? 0,
        saves: r.saves ?? 0,
        shares: r.shares ?? 0,
        comments: r.comments ?? 0,
        viral: r.viral ?? false,
        notes: r.notes ?? '',
        date: r.date,
        heroItem: r.hero_item ?? '',
        closeType: r.close_type ?? 'comment_bait',
        templateUsed: r.template_used ?? 'other',
        logisticsInVoiceover: r.logistics_in_voiceover ?? false,
        payloadTiming: r.payload_timing ?? 0,
        createdAt: r.created_at,
      })));
    }
  }, [user]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const addEntry = useCallback(async (entry: Omit<PerformanceEntry, 'id' | 'createdAt'>) => {
    if (!user) return;
    const { data } = await supabase
      .from('performance_log')
      .insert({
        user_id: user.id,
        title: entry.title,
        platform: entry.platform,
        format_type: entry.formatType,
        hook_type: entry.hookType,
        key_item: entry.keyItem,
        price_point: entry.pricePoint,
        location: entry.location,
        views: entry.views,
        likes: entry.likes,
        saves: entry.saves,
        shares: entry.shares,
        comments: entry.comments,
        viral: entry.viral,
        notes: entry.notes,
        date: entry.date,
        hero_item: entry.heroItem,
        close_type: entry.closeType,
        template_used: entry.templateUsed,
        logistics_in_voiceover: entry.logisticsInVoiceover,
        payload_timing: entry.payloadTiming,
      })
      .select()
      .single();
    if (data) {
      setEntries(prev => [{
        id: data.id,
        title: data.title,
        platform: data.platform,
        formatType: data.format_type,
        hookType: data.hook_type,
        keyItem: data.key_item ?? '',
        pricePoint: data.price_point ?? '',
        location: data.location ?? '',
        views: data.views ?? 0,
        likes: data.likes ?? 0,
        saves: data.saves ?? 0,
        shares: data.shares ?? 0,
        comments: data.comments ?? 0,
        viral: data.viral ?? false,
        notes: data.notes ?? '',
        date: data.date,
        heroItem: data.hero_item ?? '',
        closeType: data.close_type ?? 'comment_bait',
        templateUsed: data.template_used ?? 'other',
        logisticsInVoiceover: data.logistics_in_voiceover ?? false,
        payloadTiming: data.payload_timing ?? 0,
        createdAt: data.created_at,
      }, ...prev]);
    }
  }, [user]);

  const deleteEntry = useCallback(async (id: string) => {
    if (!user) return;
    await supabase.from('performance_log').delete().eq('id', id).eq('user_id', user.id);
    setEntries(prev => prev.filter(e => e.id !== id));
  }, [user]);

  return { entries, addEntry, deleteEntry };
}
