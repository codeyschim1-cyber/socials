import { Platform } from './common';

export type PostStatus = 'idea' | 'draft' | 'scheduled' | 'published';

export interface CalendarPost {
  id: string;
  title: string;
  description: string;
  platform: Platform;
  status: PostStatus;
  scheduledDate: string;
  scheduledTime?: string;
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ThriftEvent {
  id: string;
  name: string;
  description: string;
  location: string;
  state: string;
  url?: string;
  time?: string;
  recurrence:
    | { type: 'weekly'; dayOfWeek: number }
    | { type: 'monthly'; weekOfMonth: number; dayOfWeek: number }
    | { type: 'dates'; dates: string[] };
  seasonStart?: number;
  seasonEnd?: number;
}

export interface ThriftEventInstance {
  event: ThriftEvent;
  date: string;
}
