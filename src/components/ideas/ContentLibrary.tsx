'use client';

import { useState } from 'react';
import { useContentLibrary } from '@/hooks/useContentLibrary';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { PlatformBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Platform } from '@/types/common';
import { ContentEntry } from '@/types/content-library';
import { Plus, Library, ExternalLink, Trash2 } from 'lucide-react';

const TYPE_LABELS: Record<string, string> = {
  post: 'Post',
  reel: 'Reel',
  video: 'Video',
  story: 'Story',
  short: 'Short',
  other: 'Other',
};

export function ContentLibrary() {
  const { entries, addEntry, deleteEntry } = useContentLibrary();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState<Exclude<Platform, 'all'>>('instagram');
  const [type, setType] = useState<ContentEntry['type']>('post');
  const [notes, setNotes] = useState('');
  const [performance, setPerformance] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEntry({
      title,
      url: url || undefined,
      platform,
      type,
      notes,
      performance: performance || undefined,
    });
    setTitle(''); setUrl(''); setNotes(''); setPerformance('');
    setIsFormOpen(false);
  };

  if (entries.length === 0 && !isFormOpen) {
    return (
      <EmptyState
        icon={Library}
        title="No content saved yet"
        description="Save your published content here. AI will use this context to generate better, more personalized ideas for you."
        action={<Button size="sm" onClick={() => setIsFormOpen(true)}><Plus className="w-4 h-4" /> Add Content</Button>}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-zinc-500">
          {entries.length} piece{entries.length !== 1 ? 's' : ''} of content saved. AI uses this to understand your style.
        </p>
        <Button size="sm" onClick={() => setIsFormOpen(true)}><Plus className="w-4 h-4" /> Add Content</Button>
      </div>

      <div className="space-y-2">
        {entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(entry => (
          <div key={entry.id} className="flex items-center justify-between bg-surface-card border border-zinc-800 rounded-lg px-4 py-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <PlatformBadge platform={entry.platform} />
              <span className="text-xs text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">{TYPE_LABELS[entry.type]}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-zinc-200 truncate">{entry.title}</p>
                {entry.notes && <p className="text-xs text-zinc-500 truncate">{entry.notes}</p>}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {entry.performance && <span className="text-xs text-emerald-400 mr-2">{entry.performance}</span>}
              {entry.url && (
                <a href={entry.url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-zinc-500 hover:text-violet-400 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button onClick={() => deleteEntry(entry.id)} className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Add Content">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title / Description" value={title} onChange={e => setTitle(e.target.value)} placeholder="What was this content about?" required />
          <Input label="URL (optional)" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://instagram.com/p/..." />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Platform"
              options={[
                { value: 'instagram', label: 'Instagram' },
                { value: 'tiktok', label: 'TikTok' },
                { value: 'youtube', label: 'YouTube' },
                { value: 'facebook', label: 'Facebook' },
              ]}
              value={platform}
              onChange={e => setPlatform(e.target.value as Exclude<Platform, 'all'>)}
            />
            <Select
              label="Content Type"
              options={[
                { value: 'post', label: 'Post' },
                { value: 'reel', label: 'Reel' },
                { value: 'video', label: 'Video' },
                { value: 'story', label: 'Story' },
                { value: 'short', label: 'Short' },
                { value: 'other', label: 'Other' },
              ]}
              value={type}
              onChange={e => setType(e.target.value as ContentEntry['type'])}
            />
          </div>
          <Textarea label="Notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="What was the hook? What worked well?" />
          <Input label="Performance (optional)" value={performance} onChange={e => setPerformance(e.target.value)} placeholder="e.g. 50K views, 2K likes" />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
