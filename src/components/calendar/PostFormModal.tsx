'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CalendarPost, PostStatus } from '@/types/calendar';
import { Platform } from '@/types/common';
import { PLATFORM_OPTIONS } from '@/lib/constants';
import { Trash2 } from 'lucide-react';

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: Omit<CalendarPost, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate?: (id: string, updates: Partial<CalendarPost>) => void;
  onDelete?: (id: string) => void;
  editPost?: CalendarPost | null;
  defaultDate?: string;
}

const STATUS_OPTIONS = [
  { value: 'idea', label: 'Idea' },
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'published', label: 'Published' },
];

export function PostFormModal({ isOpen, onClose, onSave, onUpdate, onDelete, editPost, defaultDate }: PostFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [status, setStatus] = useState<PostStatus>('idea');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title);
      setDescription(editPost.description);
      setPlatform(editPost.platform);
      setStatus(editPost.status);
      setScheduledDate(editPost.scheduledDate);
      setScheduledTime(editPost.scheduledTime || '');
      setTags(editPost.tags.join(', '));
      setNotes(editPost.notes);
    } else {
      setTitle('');
      setDescription('');
      setPlatform('instagram');
      setStatus('idea');
      setScheduledDate(defaultDate || '');
      setScheduledTime('');
      setTags('');
      setNotes('');
    }
  }, [editPost, defaultDate, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const postData = {
      title,
      description,
      platform,
      status,
      scheduledDate,
      scheduledTime: scheduledTime || undefined,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      notes,
    };

    if (editPost && onUpdate) {
      onUpdate(editPost.id, postData);
    } else {
      onSave(postData);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editPost ? 'Edit Post' : 'New Post'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title..." required />
        <Textarea label="Description" value={description} onChange={e => setDescription(e.target.value)} placeholder="What's this post about?" />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Platform" options={PLATFORM_OPTIONS} value={platform} onChange={e => setPlatform(e.target.value as Platform)} />
          <Select label="Status" options={STATUS_OPTIONS} value={status} onChange={e => setStatus(e.target.value as PostStatus)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Date" type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} required />
          <Input label="Time" type="time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} />
        </div>
        <Input label="Tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="tag1, tag2, tag3" />
        <Textarea label="Notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional notes..." />
        <div className="flex gap-3 justify-between pt-2">
          <div>
            {editPost && onDelete && (
              <Button type="button" variant="danger" size="sm" onClick={() => { onDelete(editPost.id); onClose(); }}>
                <Trash2 className="w-4 h-4" /> Delete
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm">{editPost ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
