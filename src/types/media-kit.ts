export interface MediaKit {
  displayName: string;
  bio: string;
  niche: string[];
  instagramHandle: string;
  tiktokHandle: string;
  youtubeHandle: string;
  facebookHandle: string;
  instagramFollowers: number;
  tiktokFollowers: number;
  youtubeSubscribers: number;
  facebookFollowers: number;
  instagramEngagementRate: number;
  tiktokEngagementRate: number;
  youtubeEngagementRate: number;
  facebookEngagementRate: number;
  email: string;
  website?: string;
  location?: string;
  rates: {
    instagramPost: number;
    instagramStory: number;
    instagramReel: number;
    tiktokVideo: number;
    youtubeVideo: number;
    youtubeShort: number;
    facebookPost: number;
    facebookReel: number;
    bundleRate?: number;
  };
  demographics?: string;
  pastBrands: string[];
  inspirationCreators: {
    handle: string;
    platform: string;
    note: string;
  }[];
  updatedAt: string;
}
