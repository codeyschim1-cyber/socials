export type FormatType = 'reel' | 'carousel' | 'static' | 'story' | 'tiktok' | 'youtube' | 'short';
export type HookType = 'question' | 'bold_statement' | 'story' | 'relatable' | 'pattern_interrupt' | 'listicle' | 'location_reveal';

export interface PerformanceEntry {
  id: string;
  title: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook';
  formatType: FormatType;
  hookType: HookType;
  keyItem: string;
  pricePoint: string;
  location: string;
  views: number;
  likes: number;
  saves: number;
  shares: number;
  comments: number;
  viral: boolean;
  notes: string;
  date: string;
  createdAt: string;
}
