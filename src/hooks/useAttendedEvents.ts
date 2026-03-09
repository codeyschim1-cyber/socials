'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/components/auth/AuthProvider';

export function useAttendedEvents() {
  const { user } = useAuthContext();
  const [attendedEvents, setAttendedEvents] = useState<string[]>([]);

  const fetchAttended = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('attended_events')
      .select('event_id')
      .eq('user_id', user.id);
    if (data) setAttendedEvents(data.map(r => r.event_id));
  }, [user]);

  useEffect(() => { fetchAttended(); }, [fetchAttended]);

  const markAttended = useCallback(async (eventId: string) => {
    if (!user) return;
    await supabase.from('attended_events').insert({ user_id: user.id, event_id: eventId });
    setAttendedEvents(prev => [...prev, eventId]);
  }, [user]);

  const unmarkAttended = useCallback(async (eventId: string) => {
    if (!user) return;
    await supabase.from('attended_events').delete().eq('user_id', user.id).eq('event_id', eventId);
    setAttendedEvents(prev => prev.filter(id => id !== eventId));
  }, [user]);

  return { attendedEvents, markAttended, unmarkAttended };
}
