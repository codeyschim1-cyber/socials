'use client';

import { ThriftEventInstance, CalendarPost } from '@/types/calendar';
import { MapPin, ExternalLink, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/Button';

interface EventsThisMonthProps {
  events: ThriftEventInstance[];
  posts: CalendarPost[];
  attendedEvents: string[];
  onAttend: (eventId: string, eventName: string, eventDate: string) => void;
  onUnattend: (eventId: string) => void;
}

export function EventsThisMonth({ events, posts, attendedEvents, onAttend, onUnattend }: EventsThisMonthProps) {
  if (events.length === 0) return null;

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
      <h3 className="text-sm font-semibold text-zinc-800 mb-4 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-amber-600" />
        Events this month
        <span className="text-xs font-normal text-zinc-400">({grouped.size} events)</span>
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from(grouped.values()).map(({ event, dates }) => {
          const isAttending = attendedEvents.includes(event.id);
          const eventPosts = posts.filter(p => p.tags.includes(`event:${event.id}`));

          return (
            <div
              key={event.id}
              className={`bg-surface-card border rounded-lg p-4 transition-colors ${isAttending ? 'border-emerald-300 bg-emerald-50/50' : 'border-amber-200 hover:border-amber-300'}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-sm font-semibold text-amber-600 leading-tight">{event.name}</h4>
                <span className="shrink-0 text-[10px] font-bold tracking-wider text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                  {event.state}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{event.description}</p>
              <div className="space-y-1.5 text-xs text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-amber-500" />
                  <span>
                    {dates.length <= 3
                      ? dates.map(d => format(parseISO(d), 'MMM d')).join(', ')
                      : `${format(parseISO(dates[0]), 'MMM d')} – ${format(parseISO(dates[dates.length - 1]), 'MMM d')} (${dates.length} days)`
                    }
                  </span>
                </div>
                {event.time && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span>{event.time}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-amber-500" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                {event.url && (
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-500 transition-colors"
                  >
                    Website <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <div className="ml-auto">
                  {isAttending ? (
                    <Button variant="danger" size="sm" onClick={() => onUnattend(event.id)}>
                      <XCircle className="w-3.5 h-3.5" /> Unattend
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={() => onAttend(event.id, event.name, dates[0])}>
                      <CheckCircle className="w-3.5 h-3.5" /> Attending
                    </Button>
                  )}
                </div>
              </div>

              {isAttending && eventPosts.length > 0 && (
                <div className="mt-3 pt-3 border-t border-emerald-200">
                  <p className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider mb-1.5">Auto-created drafts</p>
                  {eventPosts.map(p => (
                    <div key={p.id} className="flex items-center gap-2 text-xs text-zinc-600 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="truncate">{p.title}</span>
                      <span className="text-zinc-400 shrink-0">{format(parseISO(p.scheduledDate), 'MMM d')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
