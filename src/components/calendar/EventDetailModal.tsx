'use client';

import { Modal } from '@/components/ui/Modal';
import { ThriftEventInstance } from '@/types/calendar';
import { MapPin, Clock, Globe, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface EventDetailModalProps {
  instance: ThriftEventInstance | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailModal({ instance, isOpen, onClose }: EventDetailModalProps) {
  if (!instance) return null;
  const { event, date } = instance;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event.name}>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-zinc-700">
          <Calendar className="w-4 h-4 text-violet-600 shrink-0" />
          <span>{format(parseISO(date), 'EEEE, MMMM d, yyyy')}</span>
        </div>

        {event.time && (
          <div className="flex items-center gap-2 text-sm text-zinc-700">
            <Clock className="w-4 h-4 text-violet-600 shrink-0" />
            <span>{event.time}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-zinc-700">
          <MapPin className="w-4 h-4 text-violet-600 shrink-0" />
          <span>{event.location}{event.state ? `, ${event.state}` : ''}</span>
        </div>

        {event.description && (
          <div className="bg-zinc-50 rounded-lg p-3">
            <p className="text-sm text-zinc-600">{event.description}</p>
          </div>
        )}

        {event.url && (
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-800 transition-colors"
          >
            <Globe className="w-4 h-4" />
            Visit Website
          </a>
        )}
      </div>
    </Modal>
  );
}
