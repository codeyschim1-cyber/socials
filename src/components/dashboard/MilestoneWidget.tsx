'use client';

import { useState, useMemo } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useApiKey } from '@/hooks/useApiKey';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { getGrowthData, getLatestEntry } from '@/lib/analytics-utils';
import { Target, Loader2, Sparkles } from 'lucide-react';

const MILESTONES = [
  { platform: 'instagram' as const, label: 'Instagram', goal: 100000, color: 'bg-pink-500' },
  { platform: 'tiktok' as const, label: 'TikTok', goal: 50000, color: 'bg-teal-500' },
  { platform: 'youtube' as const, label: 'YouTube', goal: 5000, color: 'bg-red-500' },
];

export function MilestoneWidget() {
  const { entries } = useAnalytics();
  const { apiKey } = useApiKey();
  const [isGenerating, setIsGenerating] = useState(false);
  const [sprintPlan, setSprintPlan] = useState('');
  const [showPlan, setShowPlan] = useState(false);

  const milestoneData = useMemo(() => {
    return MILESTONES.map(m => {
      const latest = getLatestEntry(entries, m.platform);
      const current = latest?.followers ?? 0;
      const remaining = Math.max(m.goal - current, 0);
      const progress = m.goal > 0 ? Math.min((current / m.goal) * 100, 100) : 0;

      // Velocity: avg weekly gain over last 4 entries
      const growth = getGrowthData(entries, m.platform);
      let weeklyVelocity = 0;
      if (growth.length >= 2) {
        const recent = growth.slice(-4);
        const totalGain = recent[recent.length - 1].followers - recent[0].followers;
        const weeks = Math.max(recent.length - 1, 1);
        weeklyVelocity = Math.round(totalGain / weeks);
      }

      const weeksAway = weeklyVelocity > 0 ? Math.ceil(remaining / weeklyVelocity) : null;

      return { ...m, current, remaining, progress, weeklyVelocity, weeksAway };
    });
  }, [entries]);

  const handleGeneratePlan = async () => {
    if (!apiKey) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/sprint-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          milestones: milestoneData.map(m => ({
            platform: m.label,
            current: m.current,
            goal: m.goal,
            weeksAway: m.weeksAway ? `~${m.weeksAway} weeks away` : 'no velocity data',
          })),
        }),
      });
      const data = await res.json();
      if (data.plan) {
        setSprintPlan(data.plan);
        setShowPlan(true);
      }
    } catch {
      // silently fail
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
            <Target className="w-4 h-4 text-violet-600" /> Milestone Countdown
          </h3>
          {apiKey && (
            <Button variant="secondary" size="sm" onClick={handleGeneratePlan} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              Sprint Plan
            </Button>
          )}
        </div>
        <div className="space-y-4">
          {milestoneData.map(m => (
            <div key={m.platform}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-zinc-700">{m.label}</span>
                <span className="text-xs text-zinc-500">
                  {m.current.toLocaleString()} / {m.goal.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-2">
                <div className={`${m.color} h-2 rounded-full transition-all`} style={{ width: `${m.progress}%` }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-zinc-400">
                  {m.remaining > 0 ? `${m.remaining.toLocaleString()} remaining` : 'Goal reached!'}
                </span>
                {m.weeksAway !== null && m.remaining > 0 && (
                  <span className="text-[10px] text-violet-600">
                    ~{m.weeksAway} weeks ({m.weeklyVelocity > 0 ? '+' : ''}{m.weeklyVelocity.toLocaleString()}/wk)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal isOpen={showPlan} onClose={() => setShowPlan(false)} title="2-Week Growth Sprint Plan" maxWidth="max-w-2xl">
        <div className="prose prose-sm max-w-none text-zinc-700 [&_h1]:text-zinc-900 [&_h2]:text-zinc-800 [&_h3]:text-zinc-800 [&_strong]:text-zinc-800 [&_li]:text-zinc-600">
          <pre className="whitespace-pre-wrap text-sm bg-zinc-50 rounded-lg p-4 border border-zinc-200">{sprintPlan}</pre>
        </div>
      </Modal>
    </>
  );
}
