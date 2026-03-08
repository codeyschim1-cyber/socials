import { Platform } from './common';

export interface ContentEntry {
  id: string;
  title: string;
  url?: string;
  platform: Exclude<Platform, 'all'>;
  type: 'post' | 'reel' | 'video' | 'story' | 'short' | 'other';
  notes: string;
  performance?: string;
  createdAt: string;
}
