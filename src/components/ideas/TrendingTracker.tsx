'use client';

import { useState } from 'react';
import { useTrendingTopics } from '@/hooks/useTrendingTopics';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { PlatformBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';


import { Platform } from '@/types/common';
import { PLATFORM_OPTIONS } from '@/lib/constants';
import { Plus, TrendingUp, Trash2 } from 'lucide-react';

export function TrendingTracker() {
  const { topics, addTopic, updateTopic, deleteTopic } = useTrendingTopics();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<Platform>('all');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTopic({ topic, platform, notes, dateSpotted: new Date().toISOString().split('T')[0], isActive: true });
    setTopic(''); setNotes(''); setIsFormOpen(false);
  };

  const activeTopics = topics.filter(t => t.isActive);
  const pastTopics = topics.filter(t => !t.isActive);

  if (topics.length === 0 && !isFormOpen) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="No trending topics tracked"
        description="Track trending sounds, hashtags, and topics to stay ahead of the curve."
        action={<Button size="sm" onClick={() => setIsFormOpen(true)}><Plus className="w-4 h-4" /> Add Topic</Button>}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setIsFormOpen(true)}><Plus className="w-4 h-4" /> Add Topic</Button>
      </div>

      {activeTopics.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Active Trends</h3>
          <div className="space-y-2">
            {activeTopics.map(t => (
              <div key={t.id} className="flex items-center justify-between bg-surface-card border border-zinc-800 rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm font-medium text-zinc-200">{t.topic}</span>
                  <PlatformBadge platform={t.platform} />
                  {t.notes && <span className="text-xs text-zinc-500">{t.notes}</span>}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => updateTopic(t.id, { isActive: false })}>Archive</Button>
                  <button onClick={() => deleteTopic(t.id)} className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pastTopics.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Past Trends</h3>
          <div className="space-y-2">
            {pastTopics.map(t => (
              <div key={t.id} className="flex items-center justify-between bg-surface-card border border-zinc-800/50 rounded-lg px-4 py-3 opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-zinc-600" />
                  <span className="text-sm text-zinc-400">{t.topic}</span>
                  <PlatformBadge platform={t.platform} />
                </div>
                <button onClick={() => deleteTopic(t.id)} className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Track Trending Topic">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Topic / Sound / Hashtag" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. #BookTok trend" required />
          <Select
            label="Platform"
            options={PLATFORM_OPTIONS}
            value={platform}
            onChange={e => setPlatform(e.target.value as Platform)}
          />
          <Textarea label="Notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any context about this trend..." />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
