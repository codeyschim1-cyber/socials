'use client';

import { formatDateKey, format, isToday } from '@/lib/calendar-utils';
import { addDays } from 'date-fns';
import { PostCard } from './PostCard';
import { EventCard } from './EventCard';
import { CalendarPost, ThriftEventInstance } from '@/types/calendar';

interface ThreeDayViewProps {
  currentDate: Date;
  posts: CalendarPost[];
  events?: ThriftEventInstance[];
  onPostClick: (post: CalendarPost) => void;
  onDayClick: (date: Date) => void;
  onEventClick?: (instance: ThriftEventInstance) => void;
}

export function ThreeDayView({ currentDate, posts, events = [], onPostClick, onDayClick, onEventClick }: ThreeDayViewProps) {
  const days = [currentDate, addDays(currentDate, 1), addDays(currentDate, 2)];

  const postsByDate = posts.reduce<Record<string, CalendarPost[]>>((acc, post) => {
    if (!acc[post.scheduledDate]) acc[post.scheduledDate] = [];
    acc[post.scheduledDate].push(post);
    return acc;
  }, {});

  const eventsByDate = events.reduce<Record<string, ThriftEventInstance[]>>((acc, inst) => {
    if (!acc[inst.date]) acc[inst.date] = [];
    acc[inst.date].push(inst);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-3 gap-3">
      {days.map(day => {
        const key = formatDateKey(day);
        const dayPosts = postsByDate[key] || [];
        const dayEvents = eventsByDate[key] || [];
        const today = isToday(day);

        return (
          <div
            key={key}
            onClick={() => onDayClick(day)}
            className={`bg-surface-card border rounded-lg p-4 min-h-[300px] cursor-pointer hover:border-zinc-300 transition-colors ${
              today ? 'border-violet-300 bg-violet-50/30' : 'border-zinc-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100">
              <span className="text-xs text-zinc-400 font-medium">{format(day, 'EEEE')}</span>
              <span className={`text-lg font-bold w-9 h-9 flex items-center justify-center rounded-full ${
                today ? 'bg-violet-600 text-white' : 'text-zinc-700'
              }`}>
                {format(day, 'd')}
              </span>
              <span className="text-xs text-zinc-400">{format(day, 'MMM')}</span>
            </div>
            <div className="space-y-2">
              {dayPosts.map(post => (
                <PostCard key={post.id} post={post} onClick={() => onPostClick(post)} />
              ))}
              {dayEvents.map(inst => (
                <EventCard key={inst.event.id} instance={inst} onClick={() => onEventClick?.(inst)} />
              ))}
              {dayPosts.length === 0 && dayEvents.length === 0 && (
                <p className="text-xs text-zinc-300 text-center py-8">No posts or events</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
