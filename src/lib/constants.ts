export const PLATFORM_COLORS = {
  instagram: { bg: 'bg-gradient-to-r from-purple-500 to-pink-500', text: 'text-pink-600', border: 'border-pink-300', badge: 'bg-pink-100 text-pink-700' },
  tiktok: { bg: 'bg-gradient-to-r from-teal-400 to-cyan-500', text: 'text-teal-600', border: 'border-teal-300', badge: 'bg-teal-100 text-teal-700' },
  youtube: { bg: 'bg-gradient-to-r from-red-500 to-red-600', text: 'text-red-600', border: 'border-red-300', badge: 'bg-red-100 text-red-700' },
  facebook: { bg: 'bg-gradient-to-r from-blue-500 to-blue-600', text: 'text-blue-600', border: 'border-blue-300', badge: 'bg-blue-100 text-blue-700' },
  all: { bg: 'bg-gradient-to-r from-purple-500 via-pink-500 to-teal-400', text: 'text-violet-600', border: 'border-violet-300', badge: 'bg-violet-100 text-violet-700' },
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
  idea: { bg: 'bg-zinc-200', text: 'text-zinc-600', dot: 'bg-zinc-400' },
  draft: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  scheduled: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  published: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
} as const;

export const STATUS_LABELS = {
  idea: 'Idea',
  draft: 'Draft',
  scheduled: 'Scheduled',
  published: 'Published',
} as const;

export const DEAL_STATUS_COLORS = {
  outreach: { bg: 'bg-slate-200', text: 'text-slate-700' },
  negotiation: { bg: 'bg-amber-100', text: 'text-amber-700' },
  confirmed: { bg: 'bg-blue-100', text: 'text-blue-700' },
  completed: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
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
  trending: { label: 'Trending', color: 'bg-rose-100 text-rose-700' },
  evergreen: { label: 'Evergreen', color: 'bg-emerald-100 text-emerald-700' },
  series: { label: 'Series', color: 'bg-blue-100 text-blue-700' },
} as const;

export const CHART_COLORS = {
  instagram: '#ec4899',
  tiktok: '#14b8a6',
  youtube: '#ef4444',
  facebook: '#3b82f6',
  primary: '#8b5cf6',
  secondary: '#06b6d4',
  success: '#22c55e',
  warning: '#f59e0b',
  grid: '#e5e7eb',
  text: '#6b7280',
  tooltip: { bg: '#ffffff', border: '#e5e7eb' },
} as const;
