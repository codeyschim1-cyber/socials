interface RateInput {
  followers: number;
  engagementRate: number;
}

interface RateOutput {
  instagramPost: number;
  instagramStory: number;
  instagramReel: number;
  tiktokVideo: number;
  youtubeVideo: number;
  youtubeShort: number;
  facebookPost: number;
  facebookReel: number;
}

const BASE_CPM = {
  instagramPost: 10,
  instagramStory: 5,
  instagramReel: 12,
  tiktokVideo: 8,
  youtubeVideo: 20,
  youtubeShort: 8,
  facebookPost: 6,
  facebookReel: 8,
};

export function calculateRates(input: RateInput): RateOutput {
  const engagementMultiplier = input.engagementRate > 5 ? 1.5 : input.engagementRate > 3 ? 1.2 : 1.0;
  const base = (input.followers / 1000) * engagementMultiplier;

  return {
    instagramPost: Math.round(base * BASE_CPM.instagramPost),
    instagramStory: Math.round(base * BASE_CPM.instagramStory),
    instagramReel: Math.round(base * BASE_CPM.instagramReel),
    tiktokVideo: Math.round(base * BASE_CPM.tiktokVideo),
    youtubeVideo: Math.round(base * BASE_CPM.youtubeVideo),
    youtubeShort: Math.round(base * BASE_CPM.youtubeShort),
    facebookPost: Math.round(base * BASE_CPM.facebookPost),
    facebookReel: Math.round(base * BASE_CPM.facebookReel),
  };
}
