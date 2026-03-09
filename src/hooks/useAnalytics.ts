'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { MetricEntry } from '@/types/analytics';
import { calculateEngagementRate } from '@/lib/analytics-utils';

export function useAnalytics() {
  const { user } = useAuthContext();
  const [entries, setEntries] = useState<MetricEntry[]>([]);

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('analytics_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) {
      setEntries(data.map(r => ({
        id: r.id,
        platform: r.platform,
        date: r.date,
        followers: r.followers ?? 0,
        following: r.following ?? 0,
        postsCount: r.posts_count ?? 0,
        likes: r.likes ?? 0,
        comments: r.comments ?? 0,
        shares: r.shares ?? 0,
        views: r.views ?? 0,
        engagementRate: r.engagement_rate != null ? Number(r.engagement_rate) : undefined,
        reach: r.reach ?? undefined,
        impressions: r.impressions ?? undefined,
        createdAt: r.created_at,
      })));
    }
  }, [user]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const addEntry = useCallback(async (entry: Omit<MetricEntry, 'id' | 'createdAt' | 'engagementRate'>) => {
    if (!user) return;
    const engagementRate = calculateEngagementRate(entry.likes, entry.comments, entry.shares, entry.followers);
    const { data } = await supabase
      .from('analytics_entries')
      .insert({
        user_id: user.id,
        platform: entry.platform,
        date: entry.date,
        followers: entry.followers,
        following: entry.following,
        posts_count: entry.postsCount,
        likes: entry.likes,
        comments: entry.comments,
        shares: entry.shares,
        views: entry.views,
        engagement_rate: engagementRate,
        reach: entry.reach,
        impressions: entry.impressions,
      })
      .select()
      .single();
    if (data) {
      setEntries(prev => [{
        id: data.id,
        platform: data.platform,
        date: data.date,
        followers: data.followers ?? 0,
        following: data.following ?? 0,
        postsCount: data.posts_count ?? 0,
        likes: data.likes ?? 0,
        comments: data.comments ?? 0,
        shares: data.shares ?? 0,
        views: data.views ?? 0,
        engagementRate: data.engagement_rate != null ? Number(data.engagement_rate) : undefined,
        reach: data.reach ?? undefined,
        impressions: data.impressions ?? undefined,
        createdAt: data.created_at,
      }, ...prev]);
    }
  }, [user]);

  const deleteEntry = useCallback(async (id: string) => {
    if (!user) return;
    await supabase.from('analytics_entries').delete().eq('id', id).eq('user_id', user.id);
    setEntries(prev => prev.filter(e => e.id !== id));
  }, [user]);

  return { entries, addEntry, deleteEntry };
}
