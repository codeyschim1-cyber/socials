'use client';

import { getWeekDays, formatDateKey, format, isToday } from '@/lib/calendar-utils';
import { PostCard } from './PostCard';
import { EventCard } from './EventCard';
import { CalendarPost, ThriftEventInstance } from '@/types/calendar';

interface WeekViewProps {
  currentDate: Date;
  posts: CalendarPost[];
  events?: ThriftEventInstance[];
  onPostClick: (post: CalendarPost) => void;
  onDayClick: (date: Date) => void;
}

export function WeekView({ currentDate, posts, events = [], onPostClick, onDayClick }: WeekViewProps) {
  const days = getWeekDays(currentDate);

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
    <div className="grid grid-cols-7 gap-2">
      {days.map(day => {
        const key = formatDateKey(day);
        const dayPosts = postsByDate[key] || [];
        const dayEvents = eventsByDate[key] || [];
        const today = isToday(day);

        return (
          <div
            key={key}
            onClick={() => onDayClick(day)}
            className="bg-surface-card border border-zinc-200 rounded-lg p-3 min-h-[200px] cursor-pointer hover:border-zinc-300 transition-colors"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-zinc-400 font-medium">{format(day, 'EEE')}</span>
              <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${
                today ? 'bg-violet-600 text-white' : 'text-zinc-700'
              }`}>
                {format(day, 'd')}
              </span>
            </div>
            <div className="space-y-1.5">
              {dayPosts.map(post => (
                <PostCard key={post.id} post={post} onClick={() => onPostClick(post)} />
              ))}
              {dayEvents.map(inst => (
                <EventCard key={inst.event.id} instance={inst} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
