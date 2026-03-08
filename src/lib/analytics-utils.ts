import { MetricEntry } from '@/types/analytics';
import { parseISO, isAfter, isBefore, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';

export function calculateEngagementRate(likes: number, comments: number, shares: number, followers: number): number {
  if (followers === 0) return 0;
  return Number((((likes + comments + shares) / followers) * 100).toFixed(2));
}

export function filterByPeriod(entries: MetricEntry[], period: 'week' | 'month' | 'all'): MetricEntry[] {
  if (period === 'all') return entries;
  const now = new Date();
  const cutoff = period === 'week' ? subDays(now, 7) : subMonths(now, 1);
  return entries.filter(e => isAfter(parseISO(e.date), cutoff));
}

export function filterByMonth(entries: MetricEntry[], year: number, month: number): MetricEntry[] {
  const start = startOfMonth(new Date(year, month - 1));
  const end = endOfMonth(new Date(year, month - 1));
  return entries.filter(e => {
    const d = parseISO(e.date);
    return !isBefore(d, start) && !isAfter(d, end);
  });
}

export function getLatestEntry(entries: MetricEntry[], platform: string): MetricEntry | undefined {
  return entries
    .filter(e => e.platform === platform)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
}

export function getGrowthData(entries: MetricEntry[], platform: string) {
  return entries
    .filter(e => e.platform === platform)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(e => ({ date: e.date, followers: e.followers, engagement: e.engagementRate ?? 0 }));
}
