'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { ContentIdea } from '@/types/ideas';

function mapRow(r: Record<string, unknown>): ContentIdea {
  return {
    id: r.id as string,
    title: r.title as string,
    description: (r.description as string) || '',
    category: r.category as ContentIdea['category'],
    platform: r.platform as ContentIdea['platform'],
    pillarId: (r.pillar_id as string) || undefined,
    tags: (r.tags as string[]) || [],
    isFavorite: (r.is_favorite as boolean) || false,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export function useIdeas() {
  const { user } = useAuthContext();
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);

  const fetchIdeas = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('content_ideas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setIdeas(data.map(mapRow));
  }, [user]);

  useEffect(() => { fetchIdeas(); }, [fetchIdeas]);

  const addIdea = useCallback(async (idea: Omit<ContentIdea, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite'>) => {
    if (!user) return;
    const { data } = await supabase
      .from('content_ideas')
      .insert({
        user_id: user.id,
        title: idea.title,
        description: idea.description,
        category: idea.category,
        platform: idea.platform,
        pillar_id: idea.pillarId,
        tags: idea.tags,
        is_favorite: false,
      })
      .select()
      .single();
    if (data) setIdeas(prev => [mapRow(data), ...prev]);
  }, [user]);

  const updateIdea = useCallback(async (id: string, updates: Partial<ContentIdea>) => {
    if (!user) return;
    const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.platform !== undefined) dbUpdates.platform = updates.platform;
    if (updates.pillarId !== undefined) dbUpdates.pillar_id = updates.pillarId;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.isFavorite !== undefined) dbUpdates.is_favorite = updates.isFavorite;

    const { data } = await supabase
      .from('content_ideas')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    if (data) setIdeas(prev => prev.map(i => i.id === id ? mapRow(data) : i));
  }, [user]);

  const deleteIdea = useCallback(async (id: string) => {
    if (!user) return;
    await supabase.from('content_ideas').delete().eq('id', id).eq('user_id', user.id);
    setIdeas(prev => prev.filter(i => i.id !== id));
  }, [user]);

  const toggleFavorite = useCallback(async (id: string) => {
    const idea = ideas.find(i => i.id === id);
    if (!idea) return;
    await updateIdea(id, { isFavorite: !idea.isFavorite });
  }, [ideas, updateIdea]);

  return { ideas, addIdea, updateIdea, deleteIdea, toggleFavorite };
}
