'use client';

import { useState } from 'react';
import { useApiKey } from '@/hooks/useApiKey';
import { useContentLibrary } from '@/hooks/useContentLibrary';
import { useMediaKit } from '@/hooks/useMediaKit';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { IDEA_CATEGORIES, PLATFORM_COLORS, PLATFORM_SHORT_LABELS } from '@/lib/constants';
import { Sparkles, Loader2, Key, Plus, Check } from 'lucide-react';
import { ContentIdea, GeneratedIdea } from '@/types/ideas';
import { Platform } from '@/types/common';
import { IdeaDeepDiveModal } from './IdeaDeepDiveModal';

interface AIGeneratorProps {
  onAddIdea: (idea: Omit<ContentIdea, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite'>) => void;
}

export function AIGenerator({ onAddIdea }: AIGeneratorProps) {
  const { apiKey, setApiKey } = useApiKey();
  const { entries: contentLibrary } = useContentLibrary();
  const { mediaKit } = useMediaKit();
  const [notes, setNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([]);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyInput, setKeyInput] = useState('');

  // Deep dive state
  const [deepDiveIdea, setDeepDiveIdea] = useState<GeneratedIdea | null>(null);
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);

  const handleSaveKey = () => {
    setApiKey(keyInput);
    setShowKeyInput(false);
    setKeyInput('');
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      setShowKeyInput(true);
      return;
    }
    if (!notes.trim()) return;

    setIsGenerating(true);
    setError('');
    setGeneratedIdeas([]);
    setAddedIds(new Set());

    try {
      const res = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          notes,
          contentContext: contentLibrary.slice(0, 20).map(c => ({
            title: c.title,
            platform: c.platform,
            notes: c.notes,
            url: c.url,
          })),
          platforms: mediaKit.instagramHandle || mediaKit.tiktokHandle || mediaKit.youtubeHandle || mediaKit.facebookHandle
            ? [
              mediaKit.instagramHandle && 'Instagram',
              mediaKit.tiktokHandle && 'TikTok',
              mediaKit.youtubeHandle && 'YouTube',
              mediaKit.facebookHandle && 'Facebook',
            ].filter(Boolean).join(', ')
            : undefined,
          niche: mediaKit.niche.length > 0 ? mediaKit.niche.join(', ') : undefined,
          creatorBio: mediaKit.bio || undefined,
          inspirationCreators: mediaKit.inspirationCreators?.length > 0 ? mediaKit.inspirationCreators : undefined,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setGeneratedIdeas(data.ideas);
      }
    } catch {
      setError('Failed to connect to AI. Check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddIdea = (idea: GeneratedIdea, index: number) => {
    onAddIdea({
      title: idea.title,
      description: idea.description,
      platform: idea.platform,
      category: idea.category,
      tags: idea.tags,
    });
    setAddedIds(prev => new Set(prev).add(index));
  };

  const handleAddAll = () => {
    generatedIdeas.forEach((idea, i) => {
      if (!addedIds.has(i)) handleAddIdea(idea, i);
    });
  };

  const handleCardClick = (idea: GeneratedIdea) => {
    setDeepDiveIdea(idea);
    setIsDeepDiveOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* API key setup */}
      {!apiKey && !showKeyInput && (
        <Card className="border-violet-500/30 bg-violet-500/5">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-violet-400 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-zinc-200">Connect your Anthropic API key to enable AI-powered idea generation.</p>
              <p className="text-xs text-zinc-500 mt-1">Your key is stored locally and never sent to our servers.</p>
            </div>
            <Button size="sm" onClick={() => setShowKeyInput(true)}>Set Key</Button>
          </div>
        </Card>
      )}

      {showKeyInput && (
        <Card>
          <h3 className="text-sm font-semibold text-zinc-200 mb-3">Enter Anthropic API Key</h3>
          <div className="flex gap-2">
            <Input
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              placeholder="sk-ant-..."
              type="password"
              className="flex-1"
            />
            <Button size="sm" onClick={handleSaveKey} disabled={!keyInput}>Save</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowKeyInput(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {/* Generator */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-violet-400" />
          <h3 className="text-sm font-semibold text-zinc-200">AI Idea Generator</h3>
          {apiKey && (
            <button onClick={() => setShowKeyInput(true)} className="ml-auto text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              Change API Key
            </button>
          )}
        </div>

        <Textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Tell the AI what kind of content you want ideas for... e.g. 'I want to create content about morning routines that are relatable for college students' or 'Give me trending reel ideas for a fitness account'"
          rows={3}
        />

        {contentLibrary.length > 0 && (
          <p className="text-xs text-zinc-600 mt-2">
            AI will also reference your {contentLibrary.length} saved content entries for context.
          </p>
        )}

        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            onClick={handleGenerate}
            disabled={isGenerating || !notes.trim()}
          >
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Generate Ideas</>
            )}
          </Button>
          {generatedIdeas.length > 0 && (
            <Button variant="secondary" size="sm" onClick={handleAddAll}>
              <Plus className="w-4 h-4" /> Add All to Ideas
            </Button>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-400 mt-3">{error}</p>
        )}
      </Card>

      {/* Generated ideas */}
      {generatedIdeas.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Generated Ideas</h3>
            <p className="text-xs text-zinc-600">Click a card for a full production plan</p>
          </div>
          {generatedIdeas.map((idea, i) => {
            const added = addedIds.has(i);
            const catColors = IDEA_CATEGORIES[idea.category] || IDEA_CATEGORIES.evergreen;
            const platColors = PLATFORM_COLORS[idea.platform] || PLATFORM_COLORS.all;
            return (
              <Card key={i} className={`${added ? 'opacity-60' : 'cursor-pointer hover:border-violet-500/40 transition-colors'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1" onClick={() => handleCardClick(idea)}>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={catColors.color}>{catColors.label}</Badge>
                      <Badge className={platColors.badge}>{PLATFORM_SHORT_LABELS[idea.platform] || 'All'}</Badge>
                    </div>
                    <h4 className="text-sm font-medium text-zinc-200">{idea.title}</h4>
                    <p className="text-xs text-zinc-400 mt-1">{idea.description}</p>
                    {idea.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {idea.tags.map(tag => (
                          <span key={tag} className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant={added ? 'ghost' : 'secondary'}
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); handleAddIdea(idea, i); }}
                    disabled={added}
                  >
                    {added ? <Check className="w-4 h-4 text-green-400" /> : <Plus className="w-4 h-4" />}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Deep Dive Modal */}
      <IdeaDeepDiveModal
        idea={deepDiveIdea}
        isOpen={isDeepDiveOpen}
        onClose={() => { setIsDeepDiveOpen(false); setDeepDiveIdea(null); }}
      />
    </div>
  );
}
