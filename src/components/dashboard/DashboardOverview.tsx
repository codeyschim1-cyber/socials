'use client';

import { useState } from 'react';
import { useCalendarPosts } from '@/hooks/useCalendarPosts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useIdeas } from '@/hooks/useIdeas';
import { useIncome } from '@/hooks/useIncome';
import { useBrandDeals } from '@/hooks/useBrandDeals';
import { Card } from '@/components/ui/Card';
import { Badge, PlatformBadge } from '@/components/ui/Badge';
import { LineChartWrapper } from '@/components/charts/LineChartWrapper';
import { getLatestEntry, getGrowthData } from '@/lib/analytics-utils';
import { getMonthlyRevenue, getGoalProgress } from '@/lib/revenue-utils';
import { STATUS_COLORS, STATUS_LABELS, CHART_COLORS, IDEA_CATEGORIES, DEAL_STATUS_COLORS, DEAL_STATUS_LABELS } from '@/lib/constants';
import { format, parseISO } from 'date-fns';
import {
  Users, TrendingUp, CalendarDays, DollarSign,
  Lightbulb, Handshake, ArrowUpRight, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { MilestoneWidget } from './MilestoneWidget';

const PLATFORMS = [
  { key: 'instagram' as const, label: 'Instagram', color: 'text-pink-600' },
  { key: 'tiktok' as const, label: 'TikTok', color: 'text-teal-600' },
  { key: 'youtube' as const, label: 'YouTube', color: 'text-red-600' },
  { key: 'facebook' as const, label: 'Facebook', color: 'text-blue-600' },
];

export function DashboardOverview() {
  const { posts } = useCalendarPosts();
  const { entries: analyticsEntries, addEntry } = useAnalytics();
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const { ideas } = useIdeas();
  const { entries: incomeEntries, goals } = useIncome();
  const { deals } = useBrandDeals();

  const latestByPlatform = Object.fromEntries(
    PLATFORMS.map(p => [p.key, getLatestEntry(analyticsEntries, p.key)])
  );

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const monthlyRevenue = getMonthlyRevenue(incomeEntries, currentYear, currentMonth);

  const currentGoal = goals.find(g => g.period === 'monthly' && g.year === currentYear && g.month === currentMonth)
    || goals.find(g => g.period === 'yearly' && g.year === currentYear);

  const upcomingPosts = posts
    .filter(p => p.status !== 'published' && p.scheduledDate >= new Date().toISOString().split('T')[0])
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
    .slice(0, 5);

  const recentIdeas = ideas
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const activeDeals = deals.filter(d => d.status !== 'completed');

  // Growth chart data
  const growthData = (() => {
    const dateMap: Record<string, Record<string, unknown>> = {};
    PLATFORMS.forEach(p => {
      getGrowthData(analyticsEntries, p.key).forEach(e => {
        if (!dateMap[e.date]) dateMap[e.date] = {};
        dateMap[e.date][p.key] = e.followers;
      });
    });
    return Object.entries(dateMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([date, data]) => ({ date: format(parseISO(date), 'M/d'), ...data }));
  })();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-violet-600" />
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Welcome back</h2>
          <p className="text-sm text-zinc-400">Here&apos;s your creator overview for today</p>
        </div>
      </div>

      {/* Platform stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PLATFORMS.map(p => {
          const latest = latestByPlatform[p.key];
          const isEditing = editingPlatform === p.key;

          const handleSave = async () => {
            if (editingPlatform !== p.key) return; // guard double-fire
            const val = parseInt(editValue, 10);
            if (!isNaN(val) && val >= 0) {
              setEditingPlatform(null);
              await addEntry({
                platform: p.key,
                date: new Date().toISOString().split('T')[0],
                followers: val,
                following: 0,
                postsCount: 0,
                likes: 0,
                comments: 0,
                shares: 0,
                views: 0,
              });
            } else {
              setEditingPlatform(null);
            }
          };

          return (
            <Card key={p.key}>
              <div className="flex items-center gap-2 mb-2">
                <Users className={`w-4 h-4 ${p.color}`} />
                <span className="text-xs text-zinc-400">{p.label}</span>
              </div>
              {isEditing ? (
                <input
                  type="number"
                  autoFocus
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditingPlatform(null); }}
                  className="w-full text-2xl font-bold bg-zinc-100 border border-violet-500 rounded px-2 py-0.5 text-zinc-900 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              ) : (
                <p
                  className="text-2xl font-bold text-zinc-900 cursor-pointer hover:text-violet-600 transition-colors"
                  title="Click to edit"
                  onClick={() => { setEditingPlatform(p.key); setEditValue(latest?.followers?.toString() ?? ''); }}
                >
                  {latest?.followers?.toLocaleString() ?? '—'}
                </p>
              )}
              {latest?.engagementRate != null && (
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />{latest.engagementRate}% eng.
                </p>
              )}
            </Card>
          );
        })}
      </div>

      {/* Revenue + Deals row */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span className="text-xs text-zinc-400">This Month</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">${monthlyRevenue.toLocaleString()}</p>
          {currentGoal && (
            <div className="mt-2">
              <div className="w-full bg-zinc-100 rounded-full h-1.5">
                <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: `${Math.min(getGoalProgress(incomeEntries, currentGoal), 100)}%` }} />
              </div>
              <p className="text-[10px] text-zinc-400 mt-1">{Math.round(getGoalProgress(incomeEntries, currentGoal))}% of ${currentGoal.targetAmount.toLocaleString()}</p>
            </div>
          )}
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Handshake className="w-4 h-4 text-violet-600" />
            <span className="text-xs text-zinc-400">Active Deals</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">{activeDeals.length}</p>
          <p className="text-xs text-zinc-400 mt-1">${activeDeals.reduce((s, d) => s + d.rate, 0).toLocaleString()} pipeline</p>
        </Card>
      </div>

      {/* Milestone widget */}
      <MilestoneWidget />

      <div className="grid md:grid-cols-2 gap-4">
        {/* Growth chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-600" /> Follower Growth
            </h3>
            <Link href="/analytics" className="text-xs text-violet-600 hover:text-violet-500 transition-colors">View All</Link>
          </div>
          {growthData.length > 1 ? (
            <LineChartWrapper
              data={growthData}
              lines={PLATFORMS.map(p => ({ dataKey: p.key, stroke: CHART_COLORS[p.key], name: p.label }))}
              xAxisKey="date"
              height={200}
            />
          ) : (
            <div className="flex items-center justify-center h-[200px] text-sm text-zinc-400">
              <Link href="/analytics" className="hover:text-zinc-500 transition-colors">Add analytics data to see trends</Link>
            </div>
          )}
        </Card>

        {/* Upcoming posts */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-violet-600" /> Upcoming Posts
            </h3>
            <Link href="/calendar" className="text-xs text-violet-600 hover:text-violet-500 transition-colors">View Calendar</Link>
          </div>
          {upcomingPosts.length > 0 ? (
            <div className="space-y-2">
              {upcomingPosts.map(post => (
                <div key={post.id} className="flex items-center justify-between bg-surface-elevated rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <PlatformBadge platform={post.platform} />
                    <span className="text-sm text-zinc-800 truncate">{post.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className={`${STATUS_COLORS[post.status].bg} ${STATUS_COLORS[post.status].text}`}>
                      {STATUS_LABELS[post.status]}
                    </Badge>
                    <span className="text-xs text-zinc-400">{format(parseISO(post.scheduledDate), 'MMM d')}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[140px] text-sm text-zinc-400">
              <Link href="/calendar" className="hover:text-zinc-500 transition-colors">Plan your first post</Link>
            </div>
          )}
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Recent ideas */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-violet-600" /> Recent Ideas
            </h3>
            <Link href="/ideas" className="text-xs text-violet-600 hover:text-violet-500 transition-colors">View All</Link>
          </div>
          {recentIdeas.length > 0 ? (
            <div className="space-y-2">
              {recentIdeas.map(idea => (
                <div key={idea.id} className="flex items-center justify-between bg-surface-elevated rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge className={IDEA_CATEGORIES[idea.category].color}>
                      {IDEA_CATEGORIES[idea.category].label}
                    </Badge>
                    <span className="text-sm text-zinc-800 truncate">{idea.title}</span>
                  </div>
                  <PlatformBadge platform={idea.platform} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[140px] text-sm text-zinc-400">
              <Link href="/ideas" className="hover:text-zinc-500 transition-colors">Start brainstorming ideas</Link>
            </div>
          )}
        </Card>

        {/* Active deals */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
              <Handshake className="w-4 h-4 text-violet-600" /> Active Deals
            </h3>
            <Link href="/brands" className="text-xs text-violet-600 hover:text-violet-500 transition-colors">View Pipeline</Link>
          </div>
          {activeDeals.length > 0 ? (
            <div className="space-y-2">
              {activeDeals.slice(0, 5).map(deal => (
                <div key={deal.id} className="flex items-center justify-between bg-surface-elevated rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm text-zinc-800 truncate">{deal.brandName}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className={`${DEAL_STATUS_COLORS[deal.status].bg} ${DEAL_STATUS_COLORS[deal.status].text}`}>
                      {DEAL_STATUS_LABELS[deal.status]}
                    </Badge>
                    <span className="text-sm font-medium text-emerald-600">${deal.rate.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[140px] text-sm text-zinc-400">
              <Link href="/brands" className="hover:text-zinc-500 transition-colors">Start tracking brand deals</Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
