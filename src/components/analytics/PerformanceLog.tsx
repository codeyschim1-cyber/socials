'use client';

import { useState } from 'react';
import { usePerformanceLog } from '@/hooks/usePerformanceLog';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { Badge, PlatformBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Plus, Trash2, Flame, BarChart3 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { FormatType, HookType } from '@/types/performance';

const FORMAT_OPTIONS = [
  { value: 'reel', label: 'Reel' },
  { value: 'carousel', label: 'Carousel' },
  { value: 'static', label: 'Static Post' },
  { value: 'story', label: 'Story' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube Video' },
  { value: 'short', label: 'YouTube Short' },
];

const HOOK_OPTIONS = [
  { value: 'question', label: 'Question' },
  { value: 'bold_statement', label: 'Bold Statement' },
  { value: 'story', label: 'Story' },
  { value: 'relatable', label: 'Relatable' },
  { value: 'pattern_interrupt', label: 'Pattern Interrupt' },
  { value: 'listicle', label: 'Listicle' },
  { value: 'location_reveal', label: 'Location Reveal' },
];

const PLATFORM_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'facebook', label: 'Facebook' },
];

export function PerformanceLog() {
  const { entries, addEntry, deleteEntry } = usePerformanceLog();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<'instagram' | 'tiktok' | 'youtube' | 'facebook'>('instagram');
  const [formatType, setFormatType] = useState<FormatType>('reel');
  const [hookType, setHookType] = useState<HookType>('bold_statement');
  const [keyItem, setKeyItem] = useState('');
  const [pricePoint, setPricePoint] = useState('');
  const [location, setLocation] = useState('');
  const [views, setViews] = useState('');
  const [likes, setLikes] = useState('');
  const [saves, setSaves] = useState('');
  const [shares, setShares] = useState('');
  const [comments, setComments] = useState('');
  const [viral, setViral] = useState(false);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const resetForm = () => {
    setTitle(''); setPlatform('instagram'); setFormatType('reel'); setHookType('bold_statement');
    setKeyItem(''); setPricePoint(''); setLocation(''); setViews(''); setLikes('');
    setSaves(''); setShares(''); setComments(''); setViral(false); setNotes('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEntry({
      title, platform, formatType, hookType, keyItem, pricePoint, location,
      views: Number(views) || 0, likes: Number(likes) || 0, saves: Number(saves) || 0,
      shares: Number(shares) || 0, comments: Number(comments) || 0, viral, notes, date,
    });
    resetForm();
    setIsFormOpen(false);
  };

  // Summary stats
  const totalViews = entries.reduce((s, e) => s + e.views, 0);
  const avgViews = entries.length > 0 ? Math.round(totalViews / entries.length) : 0;
  const viralCount = entries.filter(e => e.viral).length;
  const bestPost = entries.length > 0 ? entries.reduce((best, e) => e.views > best.views ? e : best, entries[0]) : null;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-xs text-zinc-400 mb-1">Total Posts Logged</p>
          <p className="text-2xl font-bold text-zinc-900">{entries.length}</p>
        </Card>
        <Card>
          <p className="text-xs text-zinc-400 mb-1">Avg Views</p>
          <p className="text-2xl font-bold text-zinc-900">{avgViews.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-xs text-zinc-400 mb-1">Viral Posts</p>
          <p className="text-2xl font-bold text-violet-600">{viralCount}</p>
        </Card>
        <Card>
          <p className="text-xs text-zinc-400 mb-1">Best Post</p>
          <p className="text-sm font-bold text-zinc-900 truncate">{bestPost?.title || '—'}</p>
          {bestPost && <p className="text-xs text-emerald-600">{bestPost.views.toLocaleString()} views</p>}
        </Card>
      </div>

      {/* Add button */}
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4" /> Log Post
        </Button>
      </div>

      {/* Entries */}
      {entries.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No posts logged yet"
          description="Start tracking your post performance to identify patterns and feed AI recommendations."
          action={<Button size="sm" onClick={() => setIsFormOpen(true)}><Plus className="w-4 h-4" /> Log Your First Post</Button>}
        />
      ) : (
        <div className="space-y-2">
          {entries.map(entry => (
            <Card key={entry.id} className="!p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <PlatformBadge platform={entry.platform} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-zinc-800 truncate">{entry.title}</h4>
                      {entry.viral && <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-400 mt-0.5">
                      <span>{format(parseISO(entry.date), 'MMM d, yyyy')}</span>
                      <Badge className="bg-zinc-100 text-zinc-500">{entry.formatType}</Badge>
                      <Badge className="bg-zinc-100 text-zinc-500">{entry.hookType.replace('_', ' ')}</Badge>
                      {entry.location && <span>{entry.location}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-zinc-900">{entry.views.toLocaleString()} views</p>
                    <p className="text-xs text-zinc-400">
                      {entry.likes.toLocaleString()} likes &middot; {entry.saves.toLocaleString()} saves &middot; {entry.shares.toLocaleString()} shares
                    </p>
                  </div>
                  <button onClick={() => deleteEntry(entry.id)} className="text-zinc-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add form modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Log Post Performance">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title / Hook" value={title} onChange={e => setTitle(e.target.value)} placeholder="The opening line or title of the post" required />

          <div className="grid grid-cols-3 gap-3">
            <Select label="Platform" options={PLATFORM_OPTIONS} value={platform} onChange={e => setPlatform(e.target.value as typeof platform)} />
            <Select label="Format" options={FORMAT_OPTIONS} value={formatType} onChange={e => setFormatType(e.target.value as FormatType)} />
            <Select label="Hook Type" options={HOOK_OPTIONS} value={hookType} onChange={e => setHookType(e.target.value as HookType)} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input label="Key Item" value={keyItem} onChange={e => setKeyItem(e.target.value)} placeholder="e.g. Ralph Lauren jacket" />
            <Input label="Price Point" value={pricePoint} onChange={e => setPricePoint(e.target.value)} placeholder="e.g. $45" />
            <Input label="Location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. L Train Vintage" />
          </div>

          <div className="grid grid-cols-5 gap-3">
            <Input label="Views" type="number" value={views} onChange={e => setViews(e.target.value)} placeholder="0" />
            <Input label="Likes" type="number" value={likes} onChange={e => setLikes(e.target.value)} placeholder="0" />
            <Input label="Saves" type="number" value={saves} onChange={e => setSaves(e.target.value)} placeholder="0" />
            <Input label="Shares" type="number" value={shares} onChange={e => setShares(e.target.value)} placeholder="0" />
            <Input label="Comments" type="number" value={comments} onChange={e => setComments(e.target.value)} placeholder="0" />
          </div>

          <div className="flex items-center gap-4">
            <Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            <label className="flex items-center gap-2 cursor-pointer mt-5">
              <input type="checkbox" checked={viral} onChange={e => setViral(e.target.checked)} className="rounded border-zinc-300 text-violet-600 focus:ring-violet-500" />
              <span className="text-sm text-zinc-700 flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-500" /> Viral</span>
            </label>
          </div>

          <Textarea label="Notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="What worked, what didn't, audience reaction..." rows={2} />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm" disabled={!title.trim()}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
