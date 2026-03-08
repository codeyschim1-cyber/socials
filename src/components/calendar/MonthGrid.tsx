'use client';

import { getCalendarDays, formatDateKey } from '@/lib/calendar-utils';
import { CalendarDay } from './CalendarDay';
import { CalendarPost, ThriftEventInstance } from '@/types/calendar';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface MonthGridProps {
  currentDate: Date;
  posts: CalendarPost[];
  events?: ThriftEventInstance[];
  onPostClick: (post: CalendarPost) => void;
  onDayClick: (date: Date) => void;
  onEventClick?: (instance: ThriftEventInstance) => void;
}

export function MonthGrid({ currentDate, posts, events = [], onPostClick, onDayClick, onEventClick }: MonthGridProps) {
  const days = getCalendarDays(currentDate);

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
    <div>
      <div className="calendar-grid mb-px">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center text-xs font-medium text-zinc-400 py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-grid bg-zinc-100/30 rounded-lg overflow-hidden">
        {days.map(day => {
          const key = formatDateKey(day);
          return (
            <CalendarDay
              key={key}
              date={day}
              currentMonth={currentDate}
              posts={postsByDate[key] || []}
              events={eventsByDate[key] || []}
              onPostClick={onPostClick}
              onDayClick={onDayClick}
              onEventClick={onEventClick}
            />
          );
        })}
      </div>
    </div>
  );
}
