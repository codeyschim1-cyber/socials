import { Platform } from './common';

export type IdeaCategory = 'trending' | 'evergreen' | 'series';

export interface GeneratedIdea {
  title: string;
  description: string;
  platform: Platform;
  category: IdeaCategory;
  tags: string[];
}

export interface ShotListItem {
  shot: string;
  description: string;
  duration: string;
}

export interface IdeaDeepDive {
  shotList: ShotListItem[];
  hooks: {
    type: string;
    text: string;
  }[];
  script: string;
}

export interface ContentIdea {
  id: string;
  title: string;
  description: string;
  category: IdeaCategory;
  platform: Platform;
  pillarId?: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HashtagSet {
  id: string;
  name: string;
  hashtags: string[];
  platform: Platform;
  createdAt: string;
}

export interface CaptionTemplate {
  id: string;
  name: string;
  template: string;
  category: string;
  platform: Platform;
  createdAt: string;
}

export interface TrendingTopic {
  id: string;
  topic: string;
  platform: Platform;
  notes: string;
  dateSpotted: string;
  isActive: boolean;
  createdAt: string;
}

export interface ContentPillar {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
}

export interface SwipeFileEntry {
  id: string;
  title: string;
  sourceUrl?: string;
  notes: string;
  platform: Platform;
  tags: string[];
  createdAt: string;
}
