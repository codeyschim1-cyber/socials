import { Platform } from './common';

export interface MetricEntry {
  id: string;
  platform: Exclude<Platform, 'all'>;
  date: string;
  followers: number;
  following: number;
  postsCount: number;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  engagementRate?: number;
  reach?: number;
  impressions?: number;
  createdAt: string;
}
