'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { ThriftEvent } from '@/types/calendar';

function mapRow(r: Record<string, unknown>): ThriftEvent {
  return {
    id: r.id as string,
    name: r.name as string,
    description: (r.description as string) || '',
    location: (r.location as string) || '',
    state: (r.state as string) || '',
    url: (r.url as string) || undefined,
    time: (r.time as string) || undefined,
    recurrence: { type: 'dates', dates: (r.dates as string[]) || [] },
  };
}

export function useCustomEvents() {
  const { user } = useAuthContext();
  const [customEvents, setCustomEvents] = useState<ThriftEvent[]>([]);

  const fetchEvents = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('custom_events')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setCustomEvents(data.map(mapRow));
  }, [user]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const addCustomEvent = useCallback(async (event: { name: string; description: string; location: string; state: string; time?: string; url?: string; dates: string[] }) => {
    if (!user) return;
    const { data } = await supabase
      .from('custom_events')
      .insert({
        user_id: user.id,
        name: event.name,
        description: event.description,
        location: event.location,
        state: event.state,
        time: event.time,
        url: event.url,
        dates: event.dates,
      })
      .select()
      .single();
    if (data) setCustomEvents(prev => [mapRow(data), ...prev]);
  }, [user]);

  const addBulkEvents = useCallback(async (events: { name: string; description: string; location: string; state: string; time?: string; date: string }[]) => {
    if (!user) return;
    const existingDates = new Set(customEvents.flatMap(e => e.recurrence.type === 'dates' ? e.recurrence.dates : []));
    const newEvents = events.filter(e => !existingDates.has(e.date));
    if (newEvents.length === 0) return 0;

    const rows = newEvents.map(evt => ({
      user_id: user.id,
      name: evt.name,
      description: evt.description || '',
      location: evt.location || '',
      state: evt.state || '',
      time: evt.time,
      dates: [evt.date],
    }));

    const { data } = await supabase.from('custom_events').insert(rows).select();
    if (data) {
      setCustomEvents(prev => [...data.map(mapRow), ...prev]);
    }
    return newEvents.length;
  }, [user, customEvents]);

  return { customEvents, addCustomEvent, addBulkEvents, refetch: fetchEvents };
}
