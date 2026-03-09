'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { CalendarPost, PostStatus } from '@/types/calendar';
import { Platform } from '@/types/common';

function mapRow(r: Record<string, unknown>): CalendarPost {
  return {
    id: r.id as string,
    title: r.title as string,
    description: (r.description as string) || '',
    platform: r.platform as Platform,
    status: r.status as PostStatus,
    scheduledDate: r.scheduled_date as string,
    scheduledTime: (r.scheduled_time as string) || undefined,
    tags: (r.tags as string[]) || [],
    notes: (r.notes as string) || '',
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export function useCalendarPosts() {
  const { user } = useAuthContext();
  const [posts, setPosts] = useState<CalendarPost[]>([]);

  const fetchPosts = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('calendar_posts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setPosts(data.map(mapRow));
  }, [user]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const addPost = useCallback(async (post: Omit<CalendarPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    const { data } = await supabase
      .from('calendar_posts')
      .insert({
        user_id: user.id,
        title: post.title,
        description: post.description,
        platform: post.platform,
        status: post.status,
        scheduled_date: post.scheduledDate,
        scheduled_time: post.scheduledTime,
        tags: post.tags,
        notes: post.notes,
      })
      .select()
      .single();
    if (data) setPosts(prev => [mapRow(data), ...prev]);
  }, [user]);

  const updatePost = useCallback(async (id: string, updates: Partial<CalendarPost>) => {
    if (!user) return;
    const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.platform !== undefined) dbUpdates.platform = updates.platform;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.scheduledDate !== undefined) dbUpdates.scheduled_date = updates.scheduledDate;
    if (updates.scheduledTime !== undefined) dbUpdates.scheduled_time = updates.scheduledTime;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

    const { data } = await supabase
      .from('calendar_posts')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    if (data) setPosts(prev => prev.map(p => p.id === id ? mapRow(data) : p));
  }, [user]);

  const deletePost = useCallback(async (id: string) => {
    if (!user) return;
    await supabase.from('calendar_posts').delete().eq('id', id).eq('user_id', user.id);
    setPosts(prev => prev.filter(p => p.id !== id));
  }, [user]);

  const getPostsByDate = useMemo(() => (date: string) => posts.filter(p => p.scheduledDate === date), [posts]);
  const getPostsByStatus = useMemo(() => (status: PostStatus) => posts.filter(p => p.status === status), [posts]);
  const getPostsByPlatform = useMemo(() => (platform: Platform) => posts.filter(p => p.platform === platform || p.platform === 'all'), [posts]);

  return { posts, addPost, updatePost, deletePost, getPostsByDate, getPostsByStatus, getPostsByPlatform };
}
