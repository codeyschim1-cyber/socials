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
import { Plus, Trash2, Flame, BarChart3, AlertTriangle, Check } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { FormatType, HookType, CloseType } from '@/types/performance';

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
  { value: 'authority', label: 'Authority ("Best in the country")' },
  { value: 'gatekept', label: 'Gatekept ("Behind me...")' },
  { value: 'price_disruption', label: 'Price Disruption ("Everything $25")' },
  { value: 'scale', label: 'Scale ("5 floors, 160 vendors")' },
  { value: 'pattern_interrupt', label: 'Pattern Interrupt' },
  { value: 'question', label: 'Question' },
  { value: 'bold_statement', label: 'Bold Statement' },
  { value: 'story', label: 'Story' },
  { value: 'relatable', label: 'Relatable' },
  { value: 'location_reveal', label: 'Location Reveal' },
];

const CLOSE_OPTIONS = [
  { value: 'comment_bait', label: 'Comment Bait ("Which one?")' },
  { value: 'spot_reveal', label: 'Spot Reveal (3, 2, 1)' },
  { value: 'fast_directive', label: 'Fast Directive ("Check it out")' },
  { value: 'strong_visual', label: 'Strong Visual (abrupt end)' },
  { value: 'save_prompt', label: 'Save Prompt' },
  { value: 'tag_a_friend', label: 'Tag a Friend' },
];

const TEMPLATE_OPTIONS = [
  { value: 'hidden_gem', label: 'Hidden Gem' },
  { value: 'epic_haul', label: 'Epic Haul / Journey' },
  { value: 'curated_list', label: 'Curated List / Tour' },
  { value: 'other', label: 'Other' },
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
  const [hookType, setHookType] = useState<HookType>('authority');
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
  const [heroItem, setHeroItem] = useState('');
  const [closeType, setCloseType] = useState<CloseType>('comment_bait');
  const [templateUsed, setTemplateUsed] = useState<'hidden_gem' | 'epic_haul' | 'curated_list' | 'other'>('hidden_gem');
  const [logisticsInVoiceover, setLogisticsInVoiceover] = useState(false);
  const [payloadTiming, setPayloadTiming] = useState('');

  const resetForm = () => {
    setTitle(''); setPlatform('instagram'); setFormatType('reel'); setHookType('authority');
    setKeyItem(''); setPricePoint(''); setLocation(''); setViews(''); setLikes('');
    setSaves(''); setShares(''); setComments(''); setViral(false); setNotes('');
    setDate(new Date().toISOString().split('T')[0]); setHeroItem('');
    setCloseType('comment_bait'); setTemplateUsed('hidden_gem');
    setLogisticsInVoiceover(false); setPayloadTiming('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEntry({
      title, platform, formatType, hookType, keyItem, pricePoint, location,
      views: Number(views) || 0, likes: Number(likes) || 0, saves: Number(saves) || 0,
      shares: Number(shares) || 0, comments: Number(comments) || 0, viral, notes, date,
      heroItem, closeType, templateUsed, logisticsInVoiceover,
      payloadTiming: Number(payloadTiming) || 0,
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
                      {entry.logisticsInVoiceover && <span title="Logistics in voiceover"><AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" /></span>}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5 flex-wrap">
                      <span>{format(parseISO(entry.date), 'MMM d, yyyy')}</span>
                      <Badge className="bg-zinc-100 text-zinc-500">{entry.formatType}</Badge>
                      <Badge className="bg-violet-50 text-violet-600">{entry.hookType.replace('_', ' ')}</Badge>
                      <Badge className="bg-zinc-100 text-zinc-500">{entry.closeType.replace('_', ' ')}</Badge>
                      {entry.templateUsed !== 'other' && <Badge className="bg-emerald-50 text-emerald-600">{entry.templateUsed.replace('_', ' ')}</Badge>}
                      {entry.location && <span>{entry.location}</span>}
                      {entry.payloadTiming > 0 && <span>Payload: {entry.payloadTiming}s</span>}
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
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Log Post Performance" maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title / Hook" value={title} onChange={e => setTitle(e.target.value)} placeholder="The opening line or title of the post" required />

          <div className="grid grid-cols-3 gap-3">
            <Select label="Platform" options={PLATFORM_OPTIONS} value={platform} onChange={e => setPlatform(e.target.value as typeof platform)} />
            <Select label="Format" options={FORMAT_OPTIONS} value={formatType} onChange={e => setFormatType(e.target.value as FormatType)} />
            <Select label="Template" options={TEMPLATE_OPTIONS} value={templateUsed} onChange={e => setTemplateUsed(e.target.value as typeof templateUsed)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select label="Hook Type" options={HOOK_OPTIONS} value={hookType} onChange={e => setHookType(e.target.value as HookType)} />
            <Select label="Close Type" options={CLOSE_OPTIONS} value={closeType} onChange={e => setCloseType(e.target.value as CloseType)} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input label="Hero Item" value={heroItem} onChange={e => setHeroItem(e.target.value)} placeholder="Item shown in first 2 sec" />
            <Input label="Key Item" value={keyItem} onChange={e => setKeyItem(e.target.value)} placeholder="e.g. Ralph Lauren jacket" />
            <Input label="Price Point" value={pricePoint} onChange={e => setPricePoint(e.target.value)} placeholder="e.g. $45" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. L Train Vintage" />
            <Input label="Payload Timing (seconds)" type="number" step="0.5" value={payloadTiming} onChange={e => setPayloadTiming(e.target.value)} placeholder="e.g. 3" />
          </div>

          <div className="grid grid-cols-5 gap-3">
            <Input label="Views" type="number" value={views} onChange={e => setViews(e.target.value)} placeholder="0" />
            <Input label="Likes" type="number" value={likes} onChange={e => setLikes(e.target.value)} placeholder="0" />
            <Input label="Saves" type="number" value={saves} onChange={e => setSaves(e.target.value)} placeholder="0" />
            <Input label="Shares" type="number" value={shares} onChange={e => setShares(e.target.value)} placeholder="0" />
            <Input label="Comments" type="number" value={comments} onChange={e => setComments(e.target.value)} placeholder="0" />
          </div>

          <div className="flex items-center gap-6">
            <Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            <label className="flex items-center gap-2 cursor-pointer mt-5">
              <input type="checkbox" checked={viral} onChange={e => setViral(e.target.checked)} className="rounded border-zinc-300 text-violet-600 focus:ring-violet-500" />
              <span className="text-sm text-zinc-700 flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-500" /> Viral</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer mt-5">
              <input type="checkbox" checked={logisticsInVoiceover} onChange={e => setLogisticsInVoiceover(e.target.checked)} className="rounded border-zinc-300 text-amber-600 focus:ring-amber-500" />
              <span className="text-sm text-zinc-700 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Logistics in VO</span>
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
