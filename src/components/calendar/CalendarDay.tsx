import { CalendarPost, ThriftEventInstance } from '@/types/calendar';
import { PostCard } from './PostCard';
import { EventCard } from './EventCard';
import { isToday, isSameMonth } from '@/lib/calendar-utils';

interface CalendarDayProps {
  date: Date;
  currentMonth: Date;
  posts: CalendarPost[];
  events?: ThriftEventInstance[];
  onPostClick: (post: CalendarPost) => void;
  onDayClick: (date: Date) => void;
}

export function CalendarDay({ date, currentMonth, posts, events = [], onPostClick, onDayClick }: CalendarDayProps) {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const today = isToday(date);
  const dayNum = date.getDate();
  const totalItems = posts.length + events.length;
  const maxVisible = 2;

  return (
    <div
      onClick={() => onDayClick(date)}
      className={`min-h-[100px] p-1.5 border border-zinc-200/50 cursor-pointer hover:bg-zinc-100/30 transition-colors ${
        !isCurrentMonth ? 'opacity-30' : ''
      }`}
    >
      <div className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
        today ? 'bg-violet-600 text-white' : 'text-zinc-400'
      }`}>
        {dayNum}
      </div>
      <div className="space-y-0.5">
        {posts.slice(0, maxVisible).map(post => (
          <PostCard key={post.id} post={post} onClick={() => onPostClick(post)} compact />
        ))}
        {posts.length < maxVisible && events.slice(0, maxVisible - posts.length).map(inst => (
          <EventCard key={inst.event.id} instance={inst} compact />
        ))}
        {totalItems > maxVisible && (
          <p className="text-[10px] text-zinc-400 px-1">+{totalItems - maxVisible} more</p>
        )}
      </div>
    </div>
  );
}
