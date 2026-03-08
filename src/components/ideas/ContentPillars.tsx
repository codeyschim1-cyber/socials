'use client';

import { useState } from 'react';
import { useContentPillars } from '@/hooks/useContentPillars';
import { useIdeas } from '@/hooks/useIdeas';
import { useApiKey } from '@/hooks/useApiKey';
import { useMediaKit } from '@/hooks/useMediaKit';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { IDEA_CATEGORIES, PLATFORM_COLORS, PLATFORM_SHORT_LABELS } from '@/lib/constants';
import { Plus, Layers, Trash2, Sparkles, Loader2, Check } from 'lucide-react';
import { ContentIdea } from '@/types/ideas';
import { GeneratedIdea } from '@/types/ideas';

const PILLAR_COLORS = ['#8b5cf6', '#ec4899', '#2dd4bf', '#f59e0b', '#22c55e', '#06b6d4', '#f97316', '#a78bfa'];

interface ContentPillarsProps {
  onAddIdea?: (idea: Omit<ContentIdea, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite'>) => void;
}

export function ContentPillars({ onAddIdea }: ContentPillarsProps) {
  const { pillars, addPillar, deletePillar } = useContentPillars();
  const { ideas } = useIdeas();
  const { apiKey } = useApiKey();
  const { mediaKit } = useMediaKit();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Per-pillar AI generation state
  const [generatingPillarId, setGeneratingPillarId] = useState<string | null>(null);
  const [pillarIdeas, setPillarIdeas] = useState<Record<string, GeneratedIdea[]>>({});
  const [addedPillarIdeas, setAddedPillarIdeas] = useState<Set<string>>(new Set());
  const [pillarError, setPillarError] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const color = PILLAR_COLORS[pillars.length % PILLAR_COLORS.length];
    addPillar({ name, description, color });
    setName(''); setDescription(''); setIsFormOpen(false);
  };

  const handleGeneratePillarIdeas = async (pillarId: string, pillarName: string, pillarDescription: string) => {
    if (!apiKey) return;

    setGeneratingPillarId(pillarId);
    setPillarError(prev => ({ ...prev, [pillarId]: '' }));

    try {
      const res = await fetch('/api/generate-pillar-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          pillarName,
          pillarDescription,
          niche: mediaKit.niche.length > 0 ? mediaKit.niche.join(', ') : undefined,
          creatorBio: mediaKit.bio || undefined,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setPillarError(prev => ({ ...prev, [pillarId]: data.error }));
      } else {
        setPillarIdeas(prev => ({ ...prev, [pillarId]: data.ideas }));
      }
    } catch {
      setPillarError(prev => ({ ...prev, [pillarId]: 'Failed to generate ideas.' }));
    } finally {
      setGeneratingPillarId(null);
    }
  };

  const handleAddPillarIdea = (pillarId: string, idea: GeneratedIdea, index: number) => {
    if (!onAddIdea) return;
    onAddIdea({
      title: idea.title,
      description: idea.description,
      platform: idea.platform,
      category: idea.category,
      tags: idea.tags,
      pillarId,
    });
    setAddedPillarIdeas(prev => new Set(prev).add(`${pillarId}-${index}`));
  };

  if (pillars.length === 0 && !isFormOpen) {
    return (
      <EmptyState
        icon={Layers}
        title="No content pillars yet"
        description="Define your content pillars (themes) to keep your content strategy focused and consistent."
        action={<Button size="sm" onClick={() => setIsFormOpen(true)}><Plus className="w-4 h-4" /> Add Pillar</Button>}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setIsFormOpen(true)}><Plus className="w-4 h-4" /> Add Pillar</Button>
      </div>

      <div className="space-y-4">
        {pillars.map(pillar => {
          const linkedIdeas = ideas.filter(i => i.pillarId === pillar.id).length;
          const generatedIdeas = pillarIdeas[pillar.id] || [];
          const isGenerating = generatingPillarId === pillar.id;
          const error = pillarError[pillar.id];

          return (
            <div key={pillar.id}>
              <Card>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: pillar.color }} />
                    <h3 className="text-sm font-semibold text-zinc-800">{pillar.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {apiKey && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleGeneratePillarIdeas(pillar.id, pillar.name, pillar.description)}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
                        ) : (
                          <><Sparkles className="w-3.5 h-3.5 text-violet-600" /> Generate Ideas</>
                        )}
                      </Button>
                    )}
                    <button onClick={() => deletePillar(pillar.id)} className="text-zinc-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {pillar.description && <p className="text-xs text-zinc-400 mb-2">{pillar.description}</p>}
                <p className="text-xs text-zinc-400">{linkedIdeas} linked idea{linkedIdeas !== 1 ? 's' : ''}</p>

                {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
              </Card>

              {/* Generated ideas for this pillar */}
              {generatedIdeas.length > 0 && (
                <div className="ml-4 mt-2 space-y-2 border-l-2 pl-4" style={{ borderColor: pillar.color }}>
                  {generatedIdeas.map((idea, i) => {
                    const key = `${pillar.id}-${i}`;
                    const added = addedPillarIdeas.has(key);
                    const catColors = IDEA_CATEGORIES[idea.category] || IDEA_CATEGORIES.evergreen;
                    const platColors = PLATFORM_COLORS[idea.platform] || PLATFORM_COLORS.all;
                    return (
                      <Card key={i} className={`py-2.5 px-3 ${added ? 'opacity-60' : ''}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <Badge className={`text-[10px] ${catColors.color}`}>{catColors.label}</Badge>
                              <Badge className={`text-[10px] ${platColors.badge}`}>{PLATFORM_SHORT_LABELS[idea.platform] || 'All'}</Badge>
                            </div>
                            <h4 className="text-xs font-medium text-zinc-800">{idea.title}</h4>
                            <p className="text-[11px] text-zinc-400 mt-0.5">{idea.description}</p>
                          </div>
                          {onAddIdea && (
                            <Button
                              variant={added ? 'ghost' : 'secondary'}
                              size="sm"
                              onClick={() => handleAddPillarIdea(pillar.id, idea, i)}
                              disabled={added}
                            >
                              {added ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Plus className="w-3.5 h-3.5" />}
                            </Button>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="New Content Pillar">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Pillar Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Education, Entertainment, BTS" required />
          <Textarea label="Description" value={description} onChange={e => setDescription(e.target.value)} placeholder="What kind of content falls under this pillar?" />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
