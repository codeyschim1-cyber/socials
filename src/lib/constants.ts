export const PLATFORM_COLORS = {
  instagram: { bg: 'bg-gradient-to-r from-purple-500 to-pink-500', text: 'text-pink-400', border: 'border-pink-500/50', badge: 'bg-pink-500/20 text-pink-400' },
  tiktok: { bg: 'bg-gradient-to-r from-teal-400 to-cyan-500', text: 'text-teal-400', border: 'border-teal-500/50', badge: 'bg-teal-500/20 text-teal-400' },
  youtube: { bg: 'bg-gradient-to-r from-red-500 to-red-600', text: 'text-red-400', border: 'border-red-500/50', badge: 'bg-red-500/20 text-red-400' },
  facebook: { bg: 'bg-gradient-to-r from-blue-500 to-blue-600', text: 'text-blue-400', border: 'border-blue-500/50', badge: 'bg-blue-500/20 text-blue-400' },
  all: { bg: 'bg-gradient-to-r from-purple-500 via-pink-500 to-teal-400', text: 'text-violet-400', border: 'border-violet-500/50', badge: 'bg-violet-500/20 text-violet-400' },
} as const;

export const PLATFORM_LABELS = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  facebook: 'Facebook',
  all: 'All',
} as const;

export const PLATFORM_SHORT_LABELS = {
  instagram: 'IG',
  tiktok: 'TT',
  youtube: 'YT',
  facebook: 'FB',
  all: 'All',
} as const;

export const PLATFORM_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'all', label: 'All Platforms' },
];

export const STATUS_COLORS = {
  idea: { bg: 'bg-zinc-700', text: 'text-zinc-300', dot: 'bg-zinc-400' },
  draft: { bg: 'bg-yellow-900/50', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  scheduled: { bg: 'bg-blue-900/50', text: 'text-blue-400', dot: 'bg-blue-400' },
  published: { bg: 'bg-green-900/50', text: 'text-green-400', dot: 'bg-green-400' },
} as const;

export const STATUS_LABELS = {
  idea: 'Idea',
  draft: 'Draft',
  scheduled: 'Scheduled',
  published: 'Published',
} as const;

export const DEAL_STATUS_COLORS = {
  outreach: { bg: 'bg-slate-700', text: 'text-slate-300' },
  negotiation: { bg: 'bg-amber-900/50', text: 'text-amber-400' },
  confirmed: { bg: 'bg-blue-900/50', text: 'text-blue-400' },
  completed: { bg: 'bg-emerald-900/50', text: 'text-emerald-400' },
} as const;

export const DEAL_STATUS_LABELS = {
  outreach: 'Outreach',
  negotiation: 'Negotiation',
  confirmed: 'Confirmed',
  completed: 'Completed',
} as const;

export const INCOME_CATEGORIES = {
  sponsorship: 'Sponsorship',
  affiliate: 'Affiliate',
  ad_revenue: 'Ad Revenue',
  merchandise: 'Merchandise',
  other: 'Other',
} as const;

export const IDEA_CATEGORIES = {
  trending: { label: 'Trending', color: 'bg-rose-500/20 text-rose-400' },
  evergreen: { label: 'Evergreen', color: 'bg-emerald-500/20 text-emerald-400' },
  series: { label: 'Series', color: 'bg-blue-500/20 text-blue-400' },
} as const;

export const CHART_COLORS = {
  instagram: '#ec4899',
  tiktok: '#2dd4bf',
  youtube: '#ef4444',
  facebook: '#3b82f6',
  primary: '#8b5cf6',
  secondary: '#06b6d4',
  success: '#22c55e',
  warning: '#f59e0b',
  grid: '#27272a',
  text: '#71717a',
  tooltip: { bg: '#18181b', border: '#27272a' },
} as const;
