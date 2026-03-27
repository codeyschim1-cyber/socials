'use client';

import { useState } from 'react';
import { useApiKey } from '@/hooks/useApiKey';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { IDEA_CATEGORIES, PLATFORM_COLORS, PLATFORM_SHORT_LABELS } from '@/lib/constants';
import { Sparkles, Loader2, Key, Plus, Check, Camera, Film, Link2, X } from 'lucide-react';
import { ContentIdea, GeneratedIdea } from '@/types/ideas';
import { IdeaDeepDiveModal } from './IdeaDeepDiveModal';

interface AIGeneratorProps {
  onAddIdea: (idea: Omit<ContentIdea, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite'>) => void;
}

const PLATFORM_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'all', label: 'All Platforms' },
];

export function AIGenerator({ onAddIdea }: AIGeneratorProps) {
  const { apiKey, setApiKey } = useApiKey();

  const [mode, setMode] = useState<'pre-shoot' | 'post-shoot'>('pre-shoot');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([]);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyInput, setKeyInput] = useState('');

  // Pre-shoot state
  const [location, setLocation] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [referenceLinks, setReferenceLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState('');

  // Post-shoot state
  const [rawNotes, setRawNotes] = useState('');

  // Deep dive state
  const [deepDiveIdea, setDeepDiveIdea] = useState<GeneratedIdea | null>(null);
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);

  const handleSaveKey = () => {
    setApiKey(keyInput);
    setShowKeyInput(false);
    setKeyInput('');
  };

  const handleAddLink = () => {
    const trimmed = linkInput.trim();
    if (trimmed && referenceLinks.length < 5) {
      const url = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
      setReferenceLinks(prev => [...prev, url]);
      setLinkInput('');
    }
  };

  const handleRemoveLink = (index: number) => {
    setReferenceLinks(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      setShowKeyInput(true);
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedIdeas([]);
    setAddedIds(new Set());

    const notes = mode === 'pre-shoot'
      ? `PRE-SHOOT MODE: I'm about to visit "${location}". Platform: ${platform}. Give me hook concepts, content angles, and a posting strategy for this location. Think about what makes this place special, what shots to get, and how to build anticipation.`
      : `POST-SHOOT MODE: Here are my raw notes/thoughts from today's shoot:\n\n${rawNotes}\n\nTurn these into content angles, hook options, a TikTok script, and a caption with hashtags. Give me multiple ways to cut and frame this footage.`;

    try {
      const res = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          notes,
          platforms: platform,
          niche: 'vintage fashion, thrifting, menswear',
          referenceLinks: mode === 'pre-shoot' && referenceLinks.length > 0 ? referenceLinks : undefined,
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

  const canGenerate = mode === 'pre-shoot' ? location.trim() : rawNotes.trim();

  return (
    <div className="space-y-4">
      {/* API key setup */}
      {!apiKey && !showKeyInput && (
        <Card className="border-violet-300 bg-violet-50">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-violet-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-zinc-800">Connect your Anthropic API key to enable AI-powered idea generation.</p>
              <p className="text-xs text-zinc-400 mt-1">Your key is stored securely and never sent to our servers.</p>
            </div>
            <Button size="sm" onClick={() => setShowKeyInput(true)}>Set Key</Button>
          </div>
        </Card>
      )}

      {showKeyInput && (
        <Card>
          <h3 className="text-sm font-semibold text-zinc-800 mb-3">Enter Anthropic API Key</h3>
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

      {/* Mode toggle */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-violet-600" />
          <h3 className="text-sm font-semibold text-zinc-800">AI Content Generator</h3>
          {apiKey && (
            <button onClick={() => setShowKeyInput(true)} className="ml-auto text-xs text-zinc-400 hover:text-zinc-500 transition-colors">
              Change API Key
            </button>
          )}
        </div>

        {/* Mode selector */}
        <div className="flex bg-surface-elevated rounded-lg p-0.5 mb-4">
          <button
            onClick={() => setMode('pre-shoot')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
              mode === 'pre-shoot' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-zinc-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Pre-Shoot
          </button>
          <button
            onClick={() => setMode('post-shoot')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
              mode === 'post-shoot' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-zinc-800'
            }`}
          >
            <Film className="w-3.5 h-3.5" /> Post-Shoot
          </button>
        </div>

        {/* Pre-shoot mode */}
        {mode === 'pre-shoot' && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-500">Heading to a location? Get hook concepts and posting strategy before you shoot.</p>
            <Input
              label="Location / Store / Event"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. L Train Vintage Brooklyn, ThriftCon NYC, Goodwill Bins Portland..."
            />
            <Select
              label="Primary Platform"
              options={PLATFORM_OPTIONS}
              value={platform}
              onChange={e => setPlatform(e.target.value)}
            />

            {/* Reference Links */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-zinc-400" />
                  Reference Links
                  <span className="text-xs text-zinc-400 font-normal">(optional — up to 5)</span>
                </span>
              </label>
              <p className="text-xs text-zinc-400 mb-2">Add links to the store&apos;s website, Instagram, Yelp, Google Maps, etc. for accurate location details.</p>

              {/* Existing links */}
              {referenceLinks.length > 0 && (
                <div className="space-y-1.5 mb-2">
                  {referenceLinks.map((link, i) => (
                    <div key={i} className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5">
                      <Link2 className="w-3 h-3 text-violet-500 shrink-0" />
                      <span className="text-xs text-zinc-600 truncate flex-1">{link}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(i)}
                        className="text-zinc-400 hover:text-red-500 transition-colors shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add link input */}
              {referenceLinks.length < 5 && (
                <div className="flex gap-2">
                  <Input
                    value={linkInput}
                    onChange={e => setLinkInput(e.target.value)}
                    placeholder="Paste a URL (website, Instagram, Yelp, Google Maps...)"
                    className="flex-1"
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddLink(); } }}
                  />
                  <Button type="button" variant="secondary" size="sm" onClick={handleAddLink} disabled={!linkInput.trim()}>
                    <Plus className="w-3.5 h-3.5" /> Add
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Post-shoot mode */}
        {mode === 'post-shoot' && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-500">Just finished shooting? Dump your raw notes and get content angles, hooks, scripts, and captions.</p>
            <Textarea
              label="Raw Notes"
              value={rawNotes}
              onChange={e => setRawNotes(e.target.value)}
              placeholder="Dump everything here — what you found, prices, reactions, cool moments, store vibes, anything notable. The messier the better, AI will organize it."
              rows={5}
            />
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            onClick={handleGenerate}
            disabled={isGenerating || !canGenerate}
          >
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> {mode === 'pre-shoot' ? 'Get Shot Plan' : 'Generate Content'}</>
            )}
          </Button>
          {generatedIdeas.length > 0 && (
            <Button variant="secondary" size="sm" onClick={handleAddAll}>
              <Plus className="w-4 h-4" /> Add All to Ideas
            </Button>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 mt-3">{error}</p>
        )}
      </Card>

      {/* Generated ideas */}
      {generatedIdeas.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {mode === 'pre-shoot' ? 'Shot Plan & Content Ideas' : 'Content From Your Shoot'}
            </h3>
            <p className="text-xs text-zinc-400">Click a card for a full production plan</p>
          </div>
          {generatedIdeas.map((idea, i) => {
            const added = addedIds.has(i);
            const catColors = IDEA_CATEGORIES[idea.category] || IDEA_CATEGORIES.evergreen;
            const platColors = PLATFORM_COLORS[idea.platform] || PLATFORM_COLORS.all;
            return (
              <Card key={i} className={`${added ? 'opacity-60' : 'cursor-pointer hover:border-violet-400 transition-colors'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1" onClick={() => handleCardClick(idea)}>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={catColors.color}>{catColors.label}</Badge>
                      <Badge className={platColors.badge}>{PLATFORM_SHORT_LABELS[idea.platform] || 'All'}</Badge>
                    </div>
                    <h4 className="text-sm font-medium text-zinc-800">{idea.title}</h4>
                    <p className="text-xs text-zinc-400 mt-1">{idea.description}</p>
                    {idea.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {idea.tags.map(tag => (
                          <span key={tag} className="text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">#{tag}</span>
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
                    {added ? <Check className="w-4 h-4 text-green-600" /> : <Plus className="w-4 h-4" />}
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
        referenceLinks={referenceLinks.length > 0 ? referenceLinks : undefined}
      />
    </div>
  );
}
