'use client';

import { BoardContent } from '@/types/board';
import { PlatformBadge, Badge } from '@/components/ui/Badge';
import { format, parseISO } from 'date-fns';
import { CalendarDays, GripVertical } from 'lucide-react';

interface BoardCardProps {
  item: BoardContent;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
}

export function BoardCard({ item, onClick, onDragStart }: BoardCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className="bg-surface-card border border-zinc-200 rounded-lg p-3 cursor-pointer hover:border-zinc-400 transition-colors group"
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 text-zinc-700 group-hover:text-zinc-500 mt-0.5 shrink-0 cursor-grab" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-zinc-800 truncate">{item.title}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <PlatformBadge platform={item.platform} />
            {item.tags.slice(0, 2).map(tag => (
              <Badge key={tag} className="bg-zinc-100 text-zinc-400">{tag}</Badge>
            ))}
          </div>
          {item.scheduledDate && (
            <div className="flex items-center gap-1 mt-2 text-xs text-zinc-400">
              <CalendarDays className="w-3 h-3" />
              {format(parseISO(item.scheduledDate), 'MMM d, yyyy')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
