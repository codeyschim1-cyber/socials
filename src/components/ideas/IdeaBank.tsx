'use client';

import { useState, useMemo } from 'react';
import { useIdeas } from '@/hooks/useIdeas';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { IdeaCard } from './IdeaCard';
import { IdeaFormModal } from './IdeaFormModal';
import { AIGenerator } from './AIGenerator';
import { ContentLibrary } from './ContentLibrary';
import { HashtagCollection } from './HashtagCollection';
import { CaptionTemplates } from './CaptionTemplates';
import { TrendingTracker } from './TrendingTracker';
import { ContentPillars } from './ContentPillars';
import { SwipeFile } from './SwipeFile';
import { ContentBoard } from './ContentBoard';
import { ContentIdea } from '@/types/ideas';
import { Plus, Lightbulb, Search } from 'lucide-react';

const TABS = [
  { id: 'ai', label: 'AI Generate' },
  { id: 'ideas', label: 'Ideas' },
  { id: 'board', label: 'Board' },
  { id: 'library', label: 'My Content' },
  { id: 'hashtags', label: 'Hashtags' },
  { id: 'captions', label: 'Captions' },
  { id: 'trending', label: 'Trending' },
  { id: 'pillars', label: 'Pillars' },
  { id: 'swipe', label: 'Swipe File' },
];

export function IdeaBank() {
  const { ideas, addIdea, updateIdea, deleteIdea, toggleFavorite } = useIdeas();
  const [activeTab, setActiveTab] = useState('ai');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editIdea, setEditIdea] = useState<ContentIdea | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredIdeas = useMemo(() => {
    return ideas.filter(idea => {
      if (categoryFilter !== 'all' && idea.category !== categoryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return idea.title.toLowerCase().includes(q) || idea.description.toLowerCase().includes(q) || idea.tags.some(t => t.toLowerCase().includes(q));
      }
      return true;
    }).sort((a, b) => {
      if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [ideas, search, categoryFilter]);

  return (
    <div className="space-y-6">
      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* AI Generate tab */}
      {activeTab === 'ai' && <AIGenerator onAddIdea={addIdea} />}

      {/* Ideas tab */}
      {activeTab === 'ideas' && (
        <div>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search ideas..."
                className="w-full bg-surface-elevated border border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'trending', 'evergreen', 'series'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    categoryFilter === cat ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
            <Button size="sm" onClick={() => { setEditIdea(null); setIsFormOpen(true); }}>
              <Plus className="w-4 h-4" /> New Idea
            </Button>
          </div>

          {filteredIdeas.length === 0 ? (
            <EmptyState
              icon={Lightbulb}
              title={ideas.length === 0 ? "No content ideas yet" : "No ideas match your search"}
              description={ideas.length === 0 ? "Start brainstorming, or use the AI Generate tab to get ideas." : "Try adjusting your filters or search query."}
              action={ideas.length === 0 ? <Button size="sm" onClick={() => setActiveTab('ai')}>Try AI Generate</Button> : undefined}
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIdeas.map(idea => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onClick={() => { setEditIdea(idea); setIsFormOpen(true); }}
                  onToggleFavorite={() => toggleFavorite(idea.id)}
                />
              ))}
            </div>
          )}

          <IdeaFormModal
            isOpen={isFormOpen}
            onClose={() => { setIsFormOpen(false); setEditIdea(null); }}
            onSave={addIdea}
            onUpdate={updateIdea}
            onDelete={deleteIdea}
            editIdea={editIdea}
          />
        </div>
      )}

      {/* Board tab */}
      {activeTab === 'board' && <ContentBoard />}

      {/* Content Library tab */}
      {activeTab === 'library' && <ContentLibrary />}

      {activeTab === 'hashtags' && <HashtagCollection />}
      {activeTab === 'captions' && <CaptionTemplates />}
      {activeTab === 'trending' && <TrendingTracker />}
      {activeTab === 'pillars' && <ContentPillars onAddIdea={addIdea} />}
      {activeTab === 'swipe' && <SwipeFile />}
    </div>
  );
}
