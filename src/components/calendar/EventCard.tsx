import { ThriftEventInstance } from '@/types/calendar';
import { MapPin } from 'lucide-react';

interface EventCardProps {
  instance: ThriftEventInstance;
  compact?: boolean;
}

export function EventCard({ instance, compact = false }: EventCardProps) {
  const { event } = instance;

  if (compact) {
    return (
      <div className="w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate border-l-2 border-amber-500 bg-amber-50">
        <span className="text-amber-600 flex items-center gap-0.5">
          <MapPin className="w-2.5 h-2.5 shrink-0" />
          <span className="truncate">{event.name}</span>
        </span>
      </div>
    );
  }

  return (
    <div className="w-full text-left p-2 rounded-lg border-l-2 border-amber-500 bg-amber-50">
      <p className="text-xs font-medium text-amber-600 truncate flex items-center gap-1">
        <MapPin className="w-3 h-3 shrink-0" />
        {event.name}
      </p>
      {event.time && <p className="text-[10px] text-amber-600/60 mt-0.5">{event.time}</p>}
    </div>
  );
}
