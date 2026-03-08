'use client';

import { useState } from 'react';
import { useBoardContent } from '@/hooks/useBoardContent';
import { BoardContent, BoardStatus } from '@/types/board';
import { BoardCard } from './BoardCard';
import { ContentFormModal } from './ContentFormModal';
import { Plus } from 'lucide-react';

const COLUMNS: { status: BoardStatus; label: string; headerColor: string; bgColor: string }[] = [
  { status: 'idea', label: 'IDEA', headerColor: 'bg-zinc-600', bgColor: 'bg-zinc-500/5' },
  { status: 'in_progress', label: 'IN PROGRESS', headerColor: 'bg-violet-600', bgColor: 'bg-violet-50' },
  { status: 'pending', label: 'PENDING', headerColor: 'bg-rose-600', bgColor: 'bg-rose-500/5' },
  { status: 'approved', label: 'APPROVED', headerColor: 'bg-emerald-600', bgColor: 'bg-emerald-500/5' },
];

export function ContentBoard() {
  const { items, addItem, updateItem, deleteItem, moveItem } = useBoardContent();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<BoardContent | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<BoardStatus>('idea');
  const [dragOverColumn, setDragOverColumn] = useState<BoardStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: BoardStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, status: BoardStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) moveItem(id, status);
    setDragOverColumn(null);
  };

  const openCreate = (status: BoardStatus) => {
    setEditItem(null);
    setDefaultStatus(status);
    setIsFormOpen(true);
  };

  const openEdit = (item: BoardContent) => {
    setEditItem(item);
    setDefaultStatus(item.status);
    setIsFormOpen(true);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map(col => {
        const columnItems = items.filter(i => i.status === col.status);
        const isDragOver = dragOverColumn === col.status;

        return (
          <div
            key={col.status}
            className={`flex-1 min-w-[260px] rounded-xl ${col.bgColor} ${isDragOver ? 'ring-2 ring-violet-500/50' : ''} transition-all`}
            onDragOver={e => handleDragOver(e, col.status)}
            onDragLeave={handleDragLeave}
            onDrop={e => handleDrop(e, col.status)}
          >
            <div className={`${col.headerColor} rounded-t-xl px-4 py-2 flex items-center justify-between`}>
              <span className="text-xs font-bold text-white tracking-wider">{col.label}</span>
              <span className="text-xs text-white/90">{columnItems.length}</span>
            </div>
            <div className="p-3 space-y-3 min-h-[200px]">
              {columnItems.map(item => (
                <BoardCard
                  key={item.id}
                  item={item}
                  onClick={() => openEdit(item)}
                  onDragStart={e => handleDragStart(e, item.id)}
                />
              ))}
              <button
                onClick={() => openCreate(col.status)}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Create Content
              </button>
            </div>
          </div>
        );
      })}

      <ContentFormModal
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditItem(null); }}
        onSave={addItem}
        onUpdate={updateItem}
        onDelete={deleteItem}
        editItem={editItem}
        defaultStatus={defaultStatus}
      />
    </div>
  );
}
