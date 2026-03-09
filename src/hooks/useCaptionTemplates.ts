'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { CaptionTemplate } from '@/types/ideas';

function mapRow(r: Record<string, unknown>): CaptionTemplate {
  return {
    id: r.id as string,
    name: r.name as string,
    template: (r.template as string) || '',
    category: (r.category as string) || '',
    platform: r.platform as CaptionTemplate['platform'],
    createdAt: r.created_at as string,
  };
}

export function useCaptionTemplates() {
  const { user } = useAuthContext();
  const [templates, setTemplates] = useState<CaptionTemplate[]>([]);

  const fetchTemplates = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('caption_templates')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setTemplates(data.map(mapRow));
  }, [user]);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const addTemplate = useCallback(async (template: Omit<CaptionTemplate, 'id' | 'createdAt'>) => {
    if (!user) return;
    const { data } = await supabase
      .from('caption_templates')
      .insert({
        user_id: user.id,
        name: template.name,
        template: template.template,
        category: template.category,
        platform: template.platform,
      })
      .select()
      .single();
    if (data) setTemplates(prev => [mapRow(data), ...prev]);
  }, [user]);

  const updateTemplate = useCallback(async (id: string, updates: Partial<CaptionTemplate>) => {
    if (!user) return;
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.template !== undefined) dbUpdates.template = updates.template;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.platform !== undefined) dbUpdates.platform = updates.platform;

    const { data } = await supabase
      .from('caption_templates')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    if (data) setTemplates(prev => prev.map(t => t.id === id ? mapRow(data) : t));
  }, [user]);

  const deleteTemplate = useCallback(async (id: string) => {
    if (!user) return;
    await supabase.from('caption_templates').delete().eq('id', id).eq('user_id', user.id);
    setTemplates(prev => prev.filter(t => t.id !== id));
  }, [user]);

  return { templates, addTemplate, updateTemplate, deleteTemplate };
}
