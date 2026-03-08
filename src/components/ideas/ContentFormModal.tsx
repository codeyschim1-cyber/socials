'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { BoardContent, BoardStatus } from '@/types/board';
import { PLATFORM_OPTIONS } from '@/lib/constants';
import { Platform } from '@/types/common';
import { Trash2 } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'idea', label: 'Idea' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
];

interface ContentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<BoardContent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate?: (id: string, updates: Partial<Omit<BoardContent, 'id' | 'createdAt'>>) => void;
  onDelete?: (id: string) => void;
  editItem?: BoardContent | null;
  defaultStatus?: BoardStatus;
}

export function ContentFormModal({ isOpen, onClose, onSave, onUpdate, onDelete, editItem, defaultStatus = 'idea' }: ContentFormModalProps) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<BoardStatus>(defaultStatus);
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [project, setProject] = useState('');
  const [tags, setTags] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editItem) {
      setTitle(editItem.title);
      setStatus(editItem.status);
      setPlatform(editItem.platform);
      setProject(editItem.project);
      setTags(editItem.tags.join(', '));
      setScheduledDate(editItem.scheduledDate ?? '');
      setCaption(editItem.caption);
      setHashtags(editItem.hashtags.join(', '));
      setNotes(editItem.notes);
    } else {
      setTitle('');
      setStatus(defaultStatus);
      setPlatform('instagram');
      setProject('');
      setTags('');
      setScheduledDate('');
      setCaption('');
      setHashtags('');
      setNotes('');
    }
  }, [editItem, defaultStatus, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parseTags = (str: string) => str.split(',').map(s => s.trim()).filter(Boolean);
    const data = {
      title: title.trim(),
      status,
      platform,
      project: project.trim(),
      tags: parseTags(tags),
      scheduledDate: scheduledDate || undefined,
      caption: caption.trim(),
      hashtags: parseTags(hashtags),
      notes: notes.trim(),
    };

    if (editItem && onUpdate) {
      onUpdate(editItem.id, data);
    } else {
      onSave(data);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editItem ? 'Edit Content' : 'Create Content'} maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Content title..." required />

        <div className="grid grid-cols-2 gap-4">
          <Select label="Status" options={STATUS_OPTIONS} value={status} onChange={e => setStatus(e.target.value as BoardStatus)} />
          <Select label="Platform" options={PLATFORM_OPTIONS} value={platform} onChange={e => setPlatform(e.target.value as Platform)} />
        </div>

        <Input label="Project" value={project} onChange={e => setProject(e.target.value)} placeholder="Project name..." />

        <Input label="Tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="tag1, tag2, tag3..." />

        <Input label="Schedule" type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} />

        <Textarea label="Caption" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Write your caption..." />

        <Input label="Hashtags" value={hashtags} onChange={e => setHashtags(e.target.value)} placeholder="#vintage, #thrift, #ootd..." />

        <Textarea label="Notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional notes..." />

        <div className="flex items-center justify-between pt-2">
          {editItem && onDelete ? (
            <Button type="button" variant="danger" size="sm" onClick={() => { onDelete(editItem.id); onClose(); }}>
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          ) : <div />}
          <div className="flex gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm">{editItem ? 'Save Changes' : 'Create'}</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
