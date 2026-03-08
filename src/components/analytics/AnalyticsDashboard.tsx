'use client';

import { useState, useMemo } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, PlatformBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LineChartWrapper } from '@/components/charts/LineChartWrapper';
import { BarChartWrapper } from '@/components/charts/BarChartWrapper';
import { MetricEntryForm } from './MetricEntryForm';
import { getLatestEntry, getGrowthData, filterByPeriod, calculateEngagementRate } from '@/lib/analytics-utils';
import { CHART_COLORS, PLATFORM_COLORS, PLATFORM_LABELS } from '@/lib/constants';
import { Plus, BarChart3, TrendingUp, Users, Eye, Heart, Calculator, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { format, parseISO } from 'date-fns';

const ALL_PLATFORMS = [
  { key: 'instagram' as const, label: 'Instagram', color: 'text-pink-600' },
  { key: 'tiktok' as const, label: 'TikTok', color: 'text-teal-600' },
  { key: 'youtube' as const, label: 'YouTube', color: 'text-red-600' },
  { key: 'facebook' as const, label: 'Facebook', color: 'text-blue-600' },
];

export function AnalyticsDashboard() {
  const { entries, addEntry, deleteEntry } = useAnalytics();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('all');
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcFollowers, setCalcFollowers] = useState('');
  const [calcLikes, setCalcLikes] = useState('');
  const [calcComments, setCalcComments] = useState('');
  const [calcShares, setCalcShares] = useState('');

  const filteredEntries = useMemo(() => filterByPeriod(entries, period), [entries, period]);

  const latestByPlatform = Object.fromEntries(
    ALL_PLATFORMS.map(p => [p.key, getLatestEntry(entries, p.key)])
  );

  const combinedGrowth = useMemo(() => {
    const dateMap: Record<string, Record<string, number>> = {};
    ALL_PLATFORMS.forEach(p => {
      getGrowthData(filteredEntries, p.key).forEach(entry => {
        if (!dateMap[entry.date]) dateMap[entry.date] = {};
        dateMap[entry.date][`${p.key}Followers`] = entry.followers;
      });
    });
    return Object.entries(dateMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({ date: format(parseISO(date), 'MMM d'), ...data }));
  }, [filteredEntries]);

  const engagementData = useMemo(() => {
    return filteredEntries
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(e => ({ date: format(parseISO(e.date), 'MMM d'), engagement: e.engagementRate ?? 0 }));
  }, [filteredEntries]);

  const calcResult = Number(calcFollowers) > 0
    ? calculateEngagementRate(Number(calcLikes), Number(calcComments), Number(calcShares), Number(calcFollowers))
    : 0;

  if (entries.length === 0 && !isFormOpen) {
    return (
      <div>
        <EmptyState
          icon={BarChart3}
          title="No analytics data yet"
          description="Start tracking your social media metrics to see growth trends and insights."
          action={<Button size="sm" onClick={() => setIsFormOpen(true)}><Plus className="w-4 h-4" /> Add Metrics</Button>}
        />
        <MetricEntryForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={addEntry} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(['week', 'month', 'all'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                period === p ? 'bg-violet-600 text-white' : 'bg-zinc-100 text-zinc-400 hover:text-zinc-800'
              }`}
            >
              {p === 'all' ? 'All Time' : p === 'week' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowCalculator(!showCalculator)}>
            <Calculator className="w-4 h-4" /> Calculator
          </Button>
          <Button size="sm" onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4" /> Add Metrics
          </Button>
        </div>
      </div>

      {/* Summary cards — one per platform */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ALL_PLATFORMS.map(p => {
          const latest = latestByPlatform[p.key];
          return (
            <Card key={p.key}>
              <div className="flex items-center gap-2 mb-2">
                <Users className={`w-4 h-4 ${p.color}`} />
                <span className="text-xs text-zinc-400">{p.label}</span>
              </div>
              <p className="text-2xl font-bold text-zinc-900">{latest?.followers?.toLocaleString() ?? '—'}</p>
              {latest?.engagementRate != null && <p className="text-xs text-emerald-600 mt-1">{latest.engagementRate}% engagement</p>}
            </Card>
          );
        })}
      </div>

      {/* Aggregate stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-red-600" />
            <span className="text-xs text-zinc-400">Total Likes</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">
            {filteredEntries.reduce((sum, e) => sum + e.likes, 0).toLocaleString()}
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-zinc-400">Total Views</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">
            {filteredEntries.reduce((sum, e) => sum + e.views, 0).toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Engagement calculator */}
      {showCalculator && (
        <Card>
          <h3 className="text-sm font-semibold text-zinc-800 mb-3 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-violet-600" /> Engagement Rate Calculator
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <Input label="Followers" type="number" placeholder="10000" value={calcFollowers} onChange={e => setCalcFollowers(e.target.value)} />
            <Input label="Likes" type="number" placeholder="500" value={calcLikes} onChange={e => setCalcLikes(e.target.value)} />
            <Input label="Comments" type="number" placeholder="50" value={calcComments} onChange={e => setCalcComments(e.target.value)} />
            <Input label="Shares" type="number" placeholder="20" value={calcShares} onChange={e => setCalcShares(e.target.value)} />
          </div>
          <div className="bg-surface-elevated rounded-lg p-3 inline-block">
            <span className="text-xs text-zinc-400 mr-2">Engagement Rate:</span>
            <span className="text-lg font-bold text-violet-600">{calcResult}%</span>
          </div>
        </Card>
      )}

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-semibold text-zinc-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-violet-600" /> Follower Growth
          </h3>
          {combinedGrowth.length > 0 ? (
            <LineChartWrapper
              data={combinedGrowth}
              lines={ALL_PLATFORMS.map(p => ({ dataKey: `${p.key}Followers`, stroke: CHART_COLORS[p.key], name: p.label }))}
              xAxisKey="date"
              height={250}
            />
          ) : (
            <p className="text-sm text-zinc-400 text-center py-8">Add metrics to see growth trends</p>
          )}
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-zinc-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-violet-600" /> Engagement Rate
          </h3>
          {engagementData.length > 0 ? (
            <BarChartWrapper
              data={engagementData}
              bars={[{ dataKey: 'engagement', fill: CHART_COLORS.primary, name: 'Engagement %' }]}
              xAxisKey="date"
              height={250}
            />
          ) : (
            <p className="text-sm text-zinc-400 text-center py-8">Add metrics to see engagement data</p>
          )}
        </Card>
      </div>

      {/* Platform comparison */}
      <Card>
        <h3 className="text-sm font-semibold text-zinc-800 mb-4">Platform Comparison</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ALL_PLATFORMS.map(p => {
            const latest = latestByPlatform[p.key];
            const colors = PLATFORM_COLORS[p.key];
            return (
              <div key={p.key} className={`border ${colors.border} rounded-lg p-4`}>
                <Badge className={colors.badge}>{p.label}</Badge>
                {latest ? (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div><p className="text-xs text-zinc-400">Followers</p><p className="text-lg font-bold text-zinc-900">{latest.followers.toLocaleString()}</p></div>
                    <div><p className="text-xs text-zinc-400">Engagement</p><p className="text-lg font-bold text-zinc-900">{latest.engagementRate}%</p></div>
                    <div><p className="text-xs text-zinc-400">Likes</p><p className="text-sm font-medium text-zinc-700">{latest.likes.toLocaleString()}</p></div>
                    <div><p className="text-xs text-zinc-400">Views</p><p className="text-sm font-medium text-zinc-700">{latest.views.toLocaleString()}</p></div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-400 mt-3">No data yet</p>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent entries */}
      <Card>
        <h3 className="text-sm font-semibold text-zinc-800 mb-3">Recent Entries</h3>
        <div className="space-y-2">
          {entries.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10).map(entry => (
            <div key={entry.id} className="flex items-center justify-between bg-surface-elevated rounded-lg px-3 py-2">
              <div className="flex items-center gap-3">
                <PlatformBadge platform={entry.platform} />
                <span className="text-sm text-zinc-700">{format(parseISO(entry.date), 'MMM d, yyyy')}</span>
                <span className="text-xs text-zinc-400">{entry.followers.toLocaleString()} followers</span>
                <span className="text-xs text-zinc-400">{entry.engagementRate}% eng.</span>
              </div>
              <button onClick={() => deleteEntry(entry.id)} className="text-zinc-400 hover:text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <MetricEntryForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={addEntry} />
    </div>
  );
}
