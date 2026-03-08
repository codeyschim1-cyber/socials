'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useCalendarPosts } from '@/hooks/useCalendarPosts';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { MonthGrid } from './MonthGrid';
import { WeekView } from './WeekView';
import { ThreeDayView } from './ThreeDayView';
import { EventsThisMonth } from './EventsThisMonth';
import { EventDetailModal } from './EventDetailModal';
import { EventSearch } from './EventSearch';
import { PostFormModal } from './PostFormModal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { CalendarPost, ThriftEvent, ThriftEventInstance } from '@/types/calendar';
import { PLATFORM_OPTIONS } from '@/lib/constants';
import { getEventsForMonth } from '@/lib/event-utils';
import { useApiKey } from '@/hooks/useApiKey';
import { useMediaKit } from '@/hooks/useMediaKit';
import {
  addMonths, subMonths, addWeeks, subWeeks,
  formatDisplayDate, formatWeekRange, formatDateKey
} from '@/lib/calendar-utils';
import { format, addDays, subDays, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export function CalendarView() {
  const { posts, addPost, updatePost, deletePost } = useCalendarPosts();
  const [attendedEvents, setAttendedEvents] = useLocalStorage<string[]>(STORAGE_KEYS.ATTENDED_EVENTS, []);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | '3day'>('month');
  const [selectedEvent, setSelectedEvent] = useState<ThriftEventInstance | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editPost, setEditPost] = useState<CalendarPost | null>(null);
  const [defaultDate, setDefaultDate] = useState<string>('');
  const { apiKey } = useApiKey();
  const { mediaKit } = useMediaKit();
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [eventVersion, setEventVersion] = useState(0);
  const [autoSearchToast, setAutoSearchToast] = useState('');

  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      if (filterPlatform !== 'all' && p.platform !== filterPlatform) return false;
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;
      return true;
    });
  }, [posts, filterPlatform, filterStatus]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const monthEvents = useMemo(() => getEventsForMonth(currentDate), [currentDate, eventVersion]);

  // Auto-refresh on Sundays
  useEffect(() => {
    const today = new Date();
    if (today.getDay() !== 0 || !apiKey) return; // 0 = Sunday
    const todayKey = format(today, 'yyyy-MM-dd');
    const lastRun = localStorage.getItem(STORAGE_KEYS.LAST_AUTO_SEARCH);
    if (lastRun === todayKey) return;

    const location = mediaKit.location || 'NYC';
    localStorage.setItem(STORAGE_KEYS.LAST_AUTO_SEARCH, todayKey);

    (async () => {
      try {
        const res = await fetch('/api/search-events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey, query: `upcoming vintage thrift flea market events next 2 weeks`, location }),
        });
        const data = await res.json();
        if (data.events && data.events.length > 0) {
          const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_EVENTS);
          const existing: ThriftEvent[] = stored ? JSON.parse(stored) : [];
          const existingDates = new Set(existing.flatMap(e => e.recurrence.type === 'dates' ? e.recurrence.dates : []));
          let added = 0;
          for (const evt of data.events) {
            if (!existingDates.has(evt.date)) {
              existing.push({
                id: `auto-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                name: evt.name,
                description: evt.description || '',
                location: evt.location || '',
                state: evt.state || '',
                time: evt.time,
                recurrence: { type: 'dates', dates: [evt.date] },
              });
              added++;
            }
          }
          if (added > 0) {
            localStorage.setItem(STORAGE_KEYS.CUSTOM_EVENTS, JSON.stringify(existing));
            setEventVersion(v => v + 1);
            setAutoSearchToast(`Found ${added} new event${added > 1 ? 's' : ''} near ${location}`);
            setTimeout(() => setAutoSearchToast(''), 5000);
          }
        }
      } catch { /* silently fail */ }
    })();
  }, [apiKey, mediaKit.location]);

  const handleAddSearchEvent = useCallback((event: { name: string; date: string; location: string; state: string; description: string; time?: string }) => {
    const customEvent: ThriftEvent = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: event.name,
      description: event.description,
      location: event.location,
      state: event.state,
      time: event.time,
      recurrence: { type: 'dates', dates: [event.date] },
    };
    // Add to localStorage custom events
    const stored = localStorage.getItem('creatorhub_custom_events');
    const existing: ThriftEvent[] = stored ? JSON.parse(stored) : [];
    existing.push(customEvent);
    localStorage.setItem('creatorhub_custom_events', JSON.stringify(existing));
    setEventVersion(v => v + 1);
  }, []);

  const handleEventClick = (instance: ThriftEventInstance) => {
    setSelectedEvent(instance);
  };

  const navigateBack = () => {
    if (view === 'month') setCurrentDate(prev => subMonths(prev, 1));
    else if (view === 'week') setCurrentDate(prev => subWeeks(prev, 1));
    else setCurrentDate(prev => subDays(prev, 3));
  };

  const navigateForward = () => {
    if (view === 'month') setCurrentDate(prev => addMonths(prev, 1));
    else if (view === 'week') setCurrentDate(prev => addWeeks(prev, 1));
    else setCurrentDate(prev => addDays(prev, 3));
  };

  const goToToday = () => setCurrentDate(new Date());

  const handleDayClick = (date: Date) => {
    setEditPost(null);
    setDefaultDate(formatDateKey(date));
    setIsFormOpen(true);
  };

  const handlePostClick = (post: CalendarPost) => {
    setEditPost(post);
    setIsFormOpen(true);
  };

  const handleNewPost = () => {
    setEditPost(null);
    setDefaultDate(formatDateKey(new Date()));
    setIsFormOpen(true);
  };

  const handleAttend = useCallback((eventId: string, eventName: string, eventDate: string) => {
    setAttendedEvents(prev => [...prev, eventId]);
    const eventDay = parseISO(eventDate);
    const drafts: Omit<CalendarPost, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        title: `Teaser: Going to ${eventName}!`,
        description: `Pre-event hype post for ${eventName}. Share what you're looking for, set expectations, build anticipation.`,
        platform: 'all',
        status: 'draft',
        scheduledDate: format(subDays(eventDay, 2), 'yyyy-MM-dd'),
        tags: [`event:${eventId}`, 'event-series'],
        notes: `Auto-created: Pre-event teaser for ${eventName}`,
      },
      {
        title: `Live at ${eventName}: Hauls & Finds`,
        description: `Day-of content from ${eventName}. Film walkthrough, haul discoveries, vendor highlights, try-on clips.`,
        platform: 'all',
        status: 'draft',
        scheduledDate: eventDate,
        tags: [`event:${eventId}`, 'event-series'],
        notes: `Auto-created: Day-of content for ${eventName}`,
      },
      {
        title: `${eventName} Recap & Best Finds`,
        description: `Post-event recap for ${eventName}. Show full haul, rate the event, share tips for next time.`,
        platform: 'all',
        status: 'draft',
        scheduledDate: format(addDays(eventDay, 2), 'yyyy-MM-dd'),
        tags: [`event:${eventId}`, 'event-series'],
        notes: `Auto-created: Post-event recap for ${eventName}`,
      },
    ];
    drafts.forEach(draft => addPost(draft));
  }, [setAttendedEvents, addPost]);

  const handleUnattend = useCallback((eventId: string) => {
    setAttendedEvents(prev => prev.filter(id => id !== eventId));
    // Remove all auto-created posts for this event
    posts.filter(p => p.tags.includes(`event:${eventId}`)).forEach(p => deletePost(p.id));
  }, [setAttendedEvents, posts, deletePost]);

  return (
    <div>
      {/* Event search */}
      <EventSearch onAddEvent={handleAddSearchEvent} />

      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button onClick={navigateBack} className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400 hover:text-zinc-800">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={navigateForward} className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400 hover:text-zinc-800">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-lg font-semibold text-zinc-900">
            {view === 'month' ? formatDisplayDate(currentDate) : formatWeekRange(currentDate)}
          </h2>
          <Button variant="ghost" size="sm" onClick={goToToday}>Today</Button>
        </div>

        <div className="flex items-center gap-2">
          <Select
            options={[{ value: 'all', label: 'All Platforms' }, ...PLATFORM_OPTIONS.filter(o => o.value !== 'all')]}
            value={filterPlatform}
            onChange={e => setFilterPlatform(e.target.value)}
            className="!w-auto"
          />
          <Select
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'idea', label: 'Ideas' },
              { value: 'draft', label: 'Drafts' },
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'published', label: 'Published' },
            ]}
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="!w-auto"
          />
          <div className="flex bg-surface-elevated rounded-lg p-0.5">
            {(['month', 'week', '3day'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  view === v ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-zinc-800'
                }`}
              >
                {v === '3day' ? '3 Day' : v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <Button size="sm" onClick={handleNewPost}>
            <Plus className="w-4 h-4" /> New Post
          </Button>
        </div>
      </div>

      {/* Calendar view */}
      {view === 'month' && (
        <MonthGrid
          currentDate={currentDate}
          posts={filteredPosts}
          events={monthEvents}
          onPostClick={handlePostClick}
          onDayClick={handleDayClick}
          onEventClick={handleEventClick}
        />
      )}
      {view === 'week' && (
        <WeekView
          currentDate={currentDate}
          posts={filteredPosts}
          events={monthEvents}
          onPostClick={handlePostClick}
          onDayClick={handleDayClick}
          onEventClick={handleEventClick}
        />
      )}
      {view === '3day' && (
        <ThreeDayView
          currentDate={currentDate}
          posts={filteredPosts}
          events={monthEvents}
          onPostClick={handlePostClick}
          onDayClick={handleDayClick}
          onEventClick={handleEventClick}
        />
      )}

      {/* Events this month */}
      <EventsThisMonth
        events={monthEvents}
        posts={posts}
        attendedEvents={attendedEvents}
        onAttend={handleAttend}
        onUnattend={handleUnattend}
      />

      {/* Post form modal */}
      <PostFormModal
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditPost(null); }}
        onSave={addPost}
        onUpdate={updatePost}
        onDelete={deletePost}
        editPost={editPost}
        defaultDate={defaultDate}
      />

      {/* Event detail modal */}
      <EventDetailModal
        instance={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      {/* Auto-search toast */}
      {autoSearchToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-in fade-in slide-in-from-bottom-2 z-50">
          {autoSearchToast}
        </div>
      )}
    </div>
  );
}
