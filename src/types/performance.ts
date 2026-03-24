export type FormatType = 'reel' | 'carousel' | 'static' | 'story' | 'tiktok' | 'youtube' | 'short';

export type HookType =
  | 'authority'        // "Best in the country/city"
  | 'gatekept'         // "Behind me" / secret location
  | 'price_disruption' // "Everything is $25"
  | 'scale'            // "5 floors", "160 vendors"
  | 'pattern_interrupt'// unexpected reveal
  | 'question'         // opens with question
  | 'bold_statement'   // controversial claim
  | 'story'            // mini anecdote open
  | 'relatable'        // relatable situation
  | 'location_reveal'; // location-forward open

export type CloseType =
  | 'comment_bait'     // "Which one would you pick?"
  | 'spot_reveal'      // "Spot reveal in 3, 2, 1"
  | 'fast_directive'   // "Check it out"
  | 'strong_visual'    // abrupt end on hero item
  | 'save_prompt'      // "Save this for your next trip"
  | 'tag_a_friend';    // "Tag who you'd bring here"

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
  heroItem: string;
  closeType: CloseType;
  templateUsed: 'hidden_gem' | 'epic_haul' | 'curated_list' | 'other';
  logisticsInVoiceover: boolean;
  payloadTiming: number;
  createdAt: string;
}
