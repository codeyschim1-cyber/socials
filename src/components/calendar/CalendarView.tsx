'use client';

import { useState, useMemo, useCallback } from 'react';
import { useCalendarPosts } from '@/hooks/useCalendarPosts';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { MonthGrid } from './MonthGrid';
import { WeekView } from './WeekView';
import { EventsThisMonth } from './EventsThisMonth';
import { PostFormModal } from './PostFormModal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { CalendarPost } from '@/types/calendar';
import { PLATFORM_OPTIONS } from '@/lib/constants';
import { getEventsForMonth } from '@/lib/event-utils';
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
  const [view, setView] = useState<'month' | 'week'>('month');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editPost, setEditPost] = useState<CalendarPost | null>(null);
  const [defaultDate, setDefaultDate] = useState<string>('');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      if (filterPlatform !== 'all' && p.platform !== filterPlatform) return false;
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;
      return true;
    });
  }, [posts, filterPlatform, filterStatus]);

  const monthEvents = useMemo(() => getEventsForMonth(currentDate), [currentDate]);

  const navigateBack = () => {
    setCurrentDate(prev => view === 'month' ? subMonths(prev, 1) : subWeeks(prev, 1));
  };

  const navigateForward = () => {
    setCurrentDate(prev => view === 'month' ? addMonths(prev, 1) : addWeeks(prev, 1));
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
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                view === 'month' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-zinc-800'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                view === 'week' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-zinc-800'
              }`}
            >
              Week
            </button>
          </div>
          <Button size="sm" onClick={handleNewPost}>
            <Plus className="w-4 h-4" /> New Post
          </Button>
        </div>
      </div>

      {/* Calendar view */}
      {view === 'month' ? (
        <MonthGrid
          currentDate={currentDate}
          posts={filteredPosts}
          events={monthEvents}
          onPostClick={handlePostClick}
          onDayClick={handleDayClick}
        />
      ) : (
        <WeekView
          currentDate={currentDate}
          posts={filteredPosts}
          events={monthEvents}
          onPostClick={handlePostClick}
          onDayClick={handleDayClick}
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
    </div>
  );
}
