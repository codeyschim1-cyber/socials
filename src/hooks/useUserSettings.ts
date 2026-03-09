'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/components/auth/AuthProvider';

export function useUserSettings() {
  const { user } = useAuthContext();
  const [lastAutoSearch, setLastAutoSearchState] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_settings')
      .select('last_auto_search')
      .eq('user_id', user.id)
      .single();
    if (data) setLastAutoSearchState(data.last_auto_search);
  }, [user]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const setLastAutoSearch = useCallback(async (value: string) => {
    if (!user) return;
    setLastAutoSearchState(value);

    const { data: existing } = await supabase
      .from('user_settings')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existing) {
      await supabase
        .from('user_settings')
        .update({ last_auto_search: value, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('user_settings')
        .insert({ user_id: user.id, last_auto_search: value });
    }
  }, [user]);

  return { lastAutoSearch, setLastAutoSearch };
}
