'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ContentIdea, IdeaCategory } from '@/types/ideas';
import { Platform } from '@/types/common';
import { PLATFORM_OPTIONS } from '@/lib/constants';
import { Trash2 } from 'lucide-react';

interface IdeaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (idea: Omit<ContentIdea, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite'>) => void;
  onUpdate?: (id: string, updates: Partial<ContentIdea>) => void;
  onDelete?: (id: string) => void;
  editIdea?: ContentIdea | null;
}

export function IdeaFormModal({ isOpen, onClose, onSave, onUpdate, onDelete, editIdea }: IdeaFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IdeaCategory>('evergreen');
  const [platform, setPlatform] = useState<Platform>('all');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (editIdea) {
      setTitle(editIdea.title);
      setDescription(editIdea.description);
      setCategory(editIdea.category);
      setPlatform(editIdea.platform);
      setTags(editIdea.tags.join(', '));
    } else {
      setTitle(''); setDescription(''); setCategory('evergreen'); setPlatform('all'); setTags('');
    }
  }, [editIdea, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title, description, category, platform,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    if (editIdea && onUpdate) {
      onUpdate(editIdea.id, data);
    } else {
      onSave(data);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editIdea ? 'Edit Idea' : 'New Content Idea'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Content idea title..." required />
        <Textarea label="Description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the idea..." />
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Category"
            options={[
              { value: 'trending', label: 'Trending' },
              { value: 'evergreen', label: 'Evergreen' },
              { value: 'series', label: 'Series' },
            ]}
            value={category}
            onChange={e => setCategory(e.target.value as IdeaCategory)}
          />
          <Select
            label="Platform"
            options={PLATFORM_OPTIONS}
            value={platform}
            onChange={e => setPlatform(e.target.value as Platform)}
          />
        </div>
        <Input label="Tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="tag1, tag2, tag3" />
        <div className="flex justify-between pt-2">
          <div>
            {editIdea && onDelete && (
              <Button type="button" variant="danger" size="sm" onClick={() => { onDelete(editIdea.id); onClose(); }}>
                <Trash2 className="w-4 h-4" /> Delete
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm">{editIdea ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
