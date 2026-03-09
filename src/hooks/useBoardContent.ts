'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { BoardContent, BoardStatus } from '@/types/board';

function mapRow(r: Record<string, unknown>): BoardContent {
  return {
    id: r.id as string,
    title: r.title as string,
    status: r.status as BoardStatus,
    platform: r.platform as BoardContent['platform'],
    project: (r.project as string) || '',
    tags: (r.tags as string[]) || [],
    scheduledDate: (r.scheduled_date as string) || undefined,
    caption: (r.caption as string) || '',
    hashtags: (r.hashtags as string[]) || [],
    notes: (r.notes as string) || '',
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export function useBoardContent() {
  const { user } = useAuthContext();
  const [items, setItems] = useState<BoardContent[]>([]);

  const fetchItems = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('board_content')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setItems(data.map(mapRow));
  }, [user]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const addItem = useCallback(async (item: Omit<BoardContent, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    const { data } = await supabase
      .from('board_content')
      .insert({
        user_id: user.id,
        title: item.title,
        status: item.status,
        platform: item.platform,
        project: item.project,
        tags: item.tags,
        scheduled_date: item.scheduledDate,
        caption: item.caption,
        hashtags: item.hashtags,
        notes: item.notes,
      })
      .select()
      .single();
    if (data) setItems(prev => [mapRow(data), ...prev]);
  }, [user]);

  const updateItem = useCallback(async (id: string, updates: Partial<Omit<BoardContent, 'id' | 'createdAt'>>) => {
    if (!user) return;
    const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.platform !== undefined) dbUpdates.platform = updates.platform;
    if (updates.project !== undefined) dbUpdates.project = updates.project;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.scheduledDate !== undefined) dbUpdates.scheduled_date = updates.scheduledDate;
    if (updates.caption !== undefined) dbUpdates.caption = updates.caption;
    if (updates.hashtags !== undefined) dbUpdates.hashtags = updates.hashtags;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

    const { data } = await supabase
      .from('board_content')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    if (data) setItems(prev => prev.map(i => i.id === id ? mapRow(data) : i));
  }, [user]);

  const deleteItem = useCallback(async (id: string) => {
    if (!user) return;
    await supabase.from('board_content').delete().eq('id', id).eq('user_id', user.id);
    setItems(prev => prev.filter(i => i.id !== id));
  }, [user]);

  const moveItem = useCallback(async (id: string, status: BoardStatus) => {
    await updateItem(id, { status });
  }, [updateItem]);

  return { items, addItem, updateItem, deleteItem, moveItem };
}
