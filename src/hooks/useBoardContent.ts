'use client';

import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { BoardContent, BoardStatus } from '@/types/board';
import { v4 as uuid } from 'uuid';

export function useBoardContent() {
  const [items, setItems] = useLocalStorage<BoardContent[]>(STORAGE_KEYS.BOARD_CONTENT, []);

  const addItem = (item: Omit<BoardContent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    setItems(prev => [...prev, { ...item, id: uuid(), createdAt: now, updatedAt: now }]);
  };

  const updateItem = (id: string, updates: Partial<Omit<BoardContent, 'id' | 'createdAt'>>) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const moveItem = (id: string, status: BoardStatus) => {
    updateItem(id, { status });
  };

  return { items, addItem, updateItem, deleteItem, moveItem };
}
