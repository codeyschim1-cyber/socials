'use client';

import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { MediaKit } from '@/types/media-kit';

const DEFAULT_MEDIA_KIT: MediaKit = {
  displayName: 'Codey James',
  bio: 'NYC-based vintage & thrift content creator. I find the best vintage menswear, thrift store guides, hauls, and hidden gems across New York City and beyond. Americana, workwear, Y2K, 90s fashion, and Ralph Lauren enthusiast.',
  niche: ['Vintage Fashion', 'Thrifting', 'Menswear', 'NYC Thrift Stores', 'Y2K/90s Fashion'],
  instagramHandle: '@codey___',
  tiktokHandle: '@codey_james',
  youtubeHandle: '@codey_james',
  facebookHandle: 'Codey James',
  instagramFollowers: 0,
  tiktokFollowers: 0,
  youtubeSubscribers: 0,
  facebookFollowers: 0,
  instagramEngagementRate: 0,
  tiktokEngagementRate: 0,
  youtubeEngagementRate: 0,
  facebookEngagementRate: 0,
  email: '',
  website: '',
  location: 'New York City',
  rates: { instagramPost: 0, instagramStory: 0, instagramReel: 0, tiktokVideo: 0, youtubeVideo: 0, youtubeShort: 0, facebookPost: 0, facebookReel: 0 },
  demographics: '',
  pastBrands: [],
  inspirationCreators: [
    { handle: '@nolondanielwhite', platform: 'Instagram', note: 'Vintage brands, Americana, Ivy League, workwear' },
    { handle: '@cristian4flores', platform: 'TikTok', note: 'Streetwear meets vintage thrifting' },
    { handle: '@thrift.mitch', platform: 'Instagram', note: 'Underrated menswear thrift creator' },
    { handle: '@crap_shootin_sinner', platform: 'Instagram', note: '30K followers, menswear vintage with editorial/fashion director vibes' },
    { handle: '@mrpaulcantu', platform: 'Instagram', note: '92K followers, menswear thrift content out of Texas' },
    { handle: '@simply.siena', platform: 'Instagram', note: '139K, NYC-based thrifted fits and sustainable styling' },
    { handle: '@thethriftguru', platform: 'Instagram', note: '110K followers, Atlanta-based' },
    { handle: '@shelbizleee', platform: 'Instagram/YouTube', note: '128K IG, 385K YT, Austin-based' },
    { handle: '@paigesechrist', platform: 'Instagram', note: '107K, sewing/upcycling/thrifting' },
    { handle: '@readwritethrift', platform: 'Instagram', note: '109K, historian angle on vintage fashion' },
    { handle: '@internetgirl', platform: 'Instagram/Depop', note: 'Pioneered Y2K thrift bundles, 660K+ Depop followers' },
    { handle: '@myvintageloveblog', platform: 'Instagram', note: 'NYC vintage style and beauty creator' },
  ],
  updatedAt: new Date().toISOString(),
};

export function useMediaKit() {
  const [mediaKit, setMediaKit] = useLocalStorage<MediaKit>(STORAGE_KEYS.MEDIA_KIT, DEFAULT_MEDIA_KIT);

  const updateMediaKit = (updates: Partial<MediaKit>) => {
    setMediaKit(prev => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
  };

  return { mediaKit, updateMediaKit };
}
