'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { MediaKit } from '@/types/media-kit';

const DEFAULT_MEDIA_KIT: MediaKit = {
  displayName: '',
  bio: '',
  niche: [],
  instagramHandle: '',
  tiktokHandle: '',
  youtubeHandle: '',
  facebookHandle: '',
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
  location: '',
  rates: { instagramPost: 0, instagramStory: 0, instagramReel: 0, tiktokVideo: 0, youtubeVideo: 0, youtubeShort: 0, facebookPost: 0, facebookReel: 0 },
  demographics: '',
  pastBrands: [],
  inspirationCreators: [],
  updatedAt: new Date().toISOString(),
};

function mapRow(r: Record<string, unknown>): MediaKit {
  return {
    displayName: (r.display_name as string) || '',
    bio: (r.bio as string) || '',
    niche: (r.niche as string[]) || [],
    instagramHandle: (r.instagram_handle as string) || '',
    tiktokHandle: (r.tiktok_handle as string) || '',
    youtubeHandle: (r.youtube_handle as string) || '',
    facebookHandle: (r.facebook_handle as string) || '',
    instagramFollowers: Number(r.instagram_followers) || 0,
    tiktokFollowers: Number(r.tiktok_followers) || 0,
    youtubeSubscribers: Number(r.youtube_subscribers) || 0,
    facebookFollowers: Number(r.facebook_followers) || 0,
    instagramEngagementRate: Number(r.instagram_engagement_rate) || 0,
    tiktokEngagementRate: Number(r.tiktok_engagement_rate) || 0,
    youtubeEngagementRate: Number(r.youtube_engagement_rate) || 0,
    facebookEngagementRate: Number(r.facebook_engagement_rate) || 0,
    email: (r.email as string) || '',
    website: (r.website as string) || '',
    location: (r.location as string) || '',
    rates: (r.rates as MediaKit['rates']) || DEFAULT_MEDIA_KIT.rates,
    demographics: (r.demographics as string) || '',
    pastBrands: (r.past_brands as string[]) || [],
    inspirationCreators: (r.inspiration_creators as MediaKit['inspirationCreators']) || [],
    updatedAt: r.updated_at as string,
  };
}

export function useMediaKit() {
  const { user } = useAuthContext();
  const [mediaKit, setMediaKit] = useState<MediaKit>(DEFAULT_MEDIA_KIT);

  const fetchMediaKit = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('media_kit')
      .select('*')
      .eq('user_id', user.id)
      .single();
    if (data) {
      setMediaKit(mapRow(data));
    }
  }, [user]);

  useEffect(() => { fetchMediaKit(); }, [fetchMediaKit]);

  const updateMediaKit = useCallback(async (updates: Partial<MediaKit>) => {
    if (!user) return;
    const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.displayName !== undefined) dbUpdates.display_name = updates.displayName;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
    if (updates.niche !== undefined) dbUpdates.niche = updates.niche;
    if (updates.instagramHandle !== undefined) dbUpdates.instagram_handle = updates.instagramHandle;
    if (updates.tiktokHandle !== undefined) dbUpdates.tiktok_handle = updates.tiktokHandle;
    if (updates.youtubeHandle !== undefined) dbUpdates.youtube_handle = updates.youtubeHandle;
    if (updates.facebookHandle !== undefined) dbUpdates.facebook_handle = updates.facebookHandle;
    if (updates.instagramFollowers !== undefined) dbUpdates.instagram_followers = updates.instagramFollowers;
    if (updates.tiktokFollowers !== undefined) dbUpdates.tiktok_followers = updates.tiktokFollowers;
    if (updates.youtubeSubscribers !== undefined) dbUpdates.youtube_subscribers = updates.youtubeSubscribers;
    if (updates.facebookFollowers !== undefined) dbUpdates.facebook_followers = updates.facebookFollowers;
    if (updates.instagramEngagementRate !== undefined) dbUpdates.instagram_engagement_rate = updates.instagramEngagementRate;
    if (updates.tiktokEngagementRate !== undefined) dbUpdates.tiktok_engagement_rate = updates.tiktokEngagementRate;
    if (updates.youtubeEngagementRate !== undefined) dbUpdates.youtube_engagement_rate = updates.youtubeEngagementRate;
    if (updates.facebookEngagementRate !== undefined) dbUpdates.facebook_engagement_rate = updates.facebookEngagementRate;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.website !== undefined) dbUpdates.website = updates.website;
    if (updates.location !== undefined) dbUpdates.location = updates.location;
    if (updates.rates !== undefined) dbUpdates.rates = updates.rates;
    if (updates.demographics !== undefined) dbUpdates.demographics = updates.demographics;
    if (updates.pastBrands !== undefined) dbUpdates.past_brands = updates.pastBrands;
    if (updates.inspirationCreators !== undefined) dbUpdates.inspiration_creators = updates.inspirationCreators;

    // Upsert: insert if no row exists, update if it does
    const { data: existing } = await supabase
      .from('media_kit')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existing) {
      const { data } = await supabase
        .from('media_kit')
        .update(dbUpdates)
        .eq('user_id', user.id)
        .select()
        .single();
      if (data) setMediaKit(mapRow(data));
    } else {
      const { data } = await supabase
        .from('media_kit')
        .insert({ user_id: user.id, ...dbUpdates })
        .select()
        .single();
      if (data) setMediaKit(mapRow(data));
    }
  }, [user]);

  return { mediaKit, updateMediaKit };
}
