'use client';

import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { CaptionTemplate } from '@/types/ideas';
import { v4 as uuid } from 'uuid';

export function useCaptionTemplates() {
  const [templates, setTemplates] = useLocalStorage<CaptionTemplate[]>(STORAGE_KEYS.CAPTION_TEMPLATES, []);

  const addTemplate = (template: Omit<CaptionTemplate, 'id' | 'createdAt'>) => {
    setTemplates(prev => [...prev, { ...template, id: uuid(), createdAt: new Date().toISOString() }]);
  };

  const updateTemplate = (id: string, updates: Partial<CaptionTemplate>) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  return { templates, addTemplate, updateTemplate, deleteTemplate };
}
