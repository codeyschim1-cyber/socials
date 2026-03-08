import { ThriftEventInstance } from '@/types/calendar';
import { MapPin, ExternalLink, Calendar, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface EventsThisMonthProps {
  events: ThriftEventInstance[];
}

export function EventsThisMonth({ events }: EventsThisMonthProps) {
  if (events.length === 0) return null;

  // Group events by event id to consolidate multi-date events
  const grouped = new Map<string, { event: ThriftEventInstance['event']; dates: string[] }>();
  for (const inst of events) {
    const existing = grouped.get(inst.event.id);
    if (existing) {
      existing.dates.push(inst.date);
    } else {
      grouped.set(inst.event.id, { event: inst.event, dates: [inst.date] });
    }
  }

  return (
    <div className="mt-8">
      <h3 className="text-sm font-semibold text-zinc-200 mb-4 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-amber-400" />
        Events this month
        <span className="text-xs font-normal text-zinc-500">({grouped.size} events)</span>
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from(grouped.values()).map(({ event, dates }) => (
          <div
            key={event.id}
            className="bg-surface-card border border-amber-500/20 rounded-lg p-4 hover:border-amber-500/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="text-sm font-semibold text-amber-400 leading-tight">{event.name}</h4>
              <span className="shrink-0 text-[10px] font-bold tracking-wider text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                {event.state}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-3 line-clamp-2">{event.description}</p>
            <div className="space-y-1.5 text-xs text-zinc-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-amber-500/60" />
                <span>
                  {dates.length <= 3
                    ? dates.map(d => format(parseISO(d), 'MMM d')).join(', ')
                    : `${format(parseISO(dates[0]), 'MMM d')} – ${format(parseISO(dates[dates.length - 1]), 'MMM d')} (${dates.length} days)`
                  }
                </span>
              </div>
              {event.time && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-amber-500/60" />
                  <span>{event.time}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-amber-500/60" />
                <span>{event.location}</span>
              </div>
            </div>
            {event.url && (
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-xs text-amber-400 hover:text-amber-300 transition-colors"
              >
                Visit website <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
