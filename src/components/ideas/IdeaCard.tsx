'use client';

import { ContentIdea } from '@/types/ideas';
import { Badge, PlatformBadge } from '@/components/ui/Badge';
import { IDEA_CATEGORIES } from '@/lib/constants';
import { Star } from 'lucide-react';

interface IdeaCardProps {
  idea: ContentIdea;
  onClick: () => void;
  onToggleFavorite: () => void;
}

export function IdeaCard({ idea, onClick, onToggleFavorite }: IdeaCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-surface-card border border-zinc-800 rounded-lg p-4 cursor-pointer hover:border-zinc-700 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex gap-2">
          <Badge className={IDEA_CATEGORIES[idea.category].color}>{IDEA_CATEGORIES[idea.category].label}</Badge>
          <PlatformBadge platform={idea.platform} />
        </div>
        <button
          onClick={e => { e.stopPropagation(); onToggleFavorite(); }}
          className="text-zinc-600 hover:text-yellow-400 transition-colors"
        >
          <Star className={`w-4 h-4 ${idea.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
        </button>
      </div>
      <h3 className="text-sm font-medium text-zinc-200 mb-1">{idea.title}</h3>
      {idea.description && <p className="text-xs text-zinc-500 line-clamp-2">{idea.description}</p>}
      {idea.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {idea.tags.map(tag => (
            <span key={tag} className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">#{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
