'use client';

import { useState } from 'react';
import { useSwipeFile } from '@/hooks/useSwipeFile';
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
import { Plus, Bookmark, ExternalLink, Trash2 } from 'lucide-react';

export function SwipeFile() {
  const { entries, addEntry, deleteEntry } = useSwipeFile();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [platform, setPlatform] = useState<Platform>('all');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEntry({
      title,
      sourceUrl: sourceUrl || undefined,
      notes,
      platform,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    setTitle(''); setSourceUrl(''); setNotes(''); setTags(''); setIsFormOpen(false);
  };

  if (entries.length === 0 && !isFormOpen) {
    return (
      <EmptyState
        icon={Bookmark}
        title="No inspiration saved yet"
        description="Save posts, videos, and content that inspire you. Build your creative reference library."
        action={<Button size="sm" onClick={() => setIsFormOpen(true)}><Plus className="w-4 h-4" /> Save Inspiration</Button>}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setIsFormOpen(true)}><Plus className="w-4 h-4" /> Save Inspiration</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map(entry => (
          <Card key={entry.id}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <PlatformBadge platform={entry.platform} />
              </div>
              <div className="flex gap-1">
                {entry.sourceUrl && (
                  <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-zinc-500 hover:text-violet-400 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button onClick={() => deleteEntry(entry.id)} className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="text-sm font-medium text-zinc-200 mb-1">{entry.title}</h3>
            {entry.notes && <p className="text-xs text-zinc-500 line-clamp-3">{entry.notes}</p>}
            {entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {entry.tags.map(tag => (
                  <span key={tag} className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">#{tag}</span>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Save Inspiration">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="What caught your eye?" required />
          <Input label="Source URL" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} placeholder="https://..." />
          <Select
            label="Platform"
            options={PLATFORM_OPTIONS}
            value={platform}
            onChange={e => setPlatform(e.target.value as Platform)}
          />
          <Textarea label="Notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Why did this inspire you? What could you adapt?" rows={4} />
          <Input label="Tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="tag1, tag2, tag3" />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
