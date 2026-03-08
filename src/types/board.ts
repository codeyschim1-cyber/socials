import { Platform } from './common';

export type BoardStatus = 'idea' | 'in_progress' | 'pending' | 'approved';

export interface BoardContent {
  id: string;
  title: string;
  status: BoardStatus;
  platform: Platform;
  project: string;
  tags: string[];
  scheduledDate?: string;
  caption: string;
  hashtags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}
