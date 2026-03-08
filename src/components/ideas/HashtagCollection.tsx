'use client';

import { useState } from 'react';
import { useHashtags } from '@/hooks/useHashtags';
import { useApiKey } from '@/hooks/useApiKey';
import { useMediaKit } from '@/hooks/useMediaKit';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { PlatformBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

import { Platform } from '@/types/common';
import { PLATFORM_OPTIONS } from '@/lib/constants';
import { Plus, Hash, Copy, Trash2, Check, Sparkles, Loader2, RefreshCw } from 'lucide-react';

export function HashtagCollection() {
  const { sets, addSet, deleteSet } = useHashtags();
  const { apiKey } = useApiKey();
  const { mediaKit } = useMediaKit();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [platform, setPlatform] = useState<Platform>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // AI generation state
  const [aiDescription, setAiDescription] = useState('');
  const [aiPlatform, setAiPlatform] = useState<Platform>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiPreview, setAiPreview] = useState<{ name: string; hashtags: string[] } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSet({ name, hashtags: hashtags.split(/[\s,]+/).map(h => h.startsWith('#') ? h : `#${h}`).filter(h => h.length > 1), platform });
    setName(''); setHashtags(''); setIsFormOpen(false);
  };

  const copyHashtags = (id: string, tags: string[]) => {
    navigator.clipboard.writeText(tags.join(' '));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAIGenerate = async () => {
    if (!apiKey || !aiDescription.trim()) return;

    setIsGenerating(true);
    setAiError('');
    setAiPreview(null);

    try {
      const res = await fetch('/api/generate-hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          contentDescription: aiDescription,
          platform: aiPlatform,
          niche: mediaKit.niche.length > 0 ? mediaKit.niche.join(', ') : undefined,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setAiError(data.error);
      } else {
        setAiPreview({ name: data.name, hashtags: data.hashtags });
      }
    } catch {
      setAiError('Failed to generate hashtags. Check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAISet = () => {
    if (!aiPreview) return;
    addSet({ name: aiPreview.name, hashtags: aiPreview.hashtags, platform: aiPlatform });
    setAiPreview(null);
    setAiDescription('');
  };

  return (
    <div>
      {/* AI Generation Card */}
      {apiKey && (
        <Card className="border-violet-300 bg-violet-50 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-violet-600" />
            <h3 className="text-sm font-semibold text-zinc-800">AI Hashtag Generator</h3>
          </div>

          <div className="space-y-3">
            <Textarea
              value={aiDescription}
              onChange={e => setAiDescription(e.target.value)}
              placeholder="Describe your content or paste your script... e.g. 'A thrift haul video showing vintage Polo Ralph Lauren finds from a Goodwill in Brooklyn'"
              rows={2}
            />
            <Select
              label="Platform"
              options={PLATFORM_OPTIONS}
              value={aiPlatform}
              onChange={e => setAiPlatform(e.target.value as Platform)}
            />
            <Button
              size="sm"
              onClick={handleAIGenerate}
              disabled={isGenerating || !aiDescription.trim()}
            >
              {isGenerating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate Hashtags</>
              )}
            </Button>

            {aiError && <p className="text-sm text-red-600">{aiError}</p>}
          </div>

          {/* AI Preview */}
          {aiPreview && (
            <div className="mt-4 p-3 bg-surface-elevated rounded-lg border border-zinc-300">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-zinc-800">{aiPreview.name}</h4>
                <span className="text-xs text-zinc-400">{aiPreview.hashtags.length} hashtags</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {aiPreview.hashtags.map(tag => (
                  <span key={tag} className="text-xs text-violet-600 bg-violet-100 px-2 py-1 rounded">{tag}</span>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveAISet}>
                  <Plus className="w-4 h-4" /> Save to Collection
                </Button>
                <Button variant="secondary" size="sm" onClick={handleAIGenerate} disabled={isGenerating}>
                  <RefreshCw className="w-4 h-4" /> Regenerate
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(aiPreview.hashtags.join(' '));
                    setCopiedId('ai-preview');
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                >
                  {copiedId === 'ai-preview' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />} Copy
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {sets.length === 0 && !apiKey ? (
        <EmptyState
          icon={Hash}
          title="No hashtag sets yet"
          description="Create collections of hashtags to quickly copy and paste into your posts."
          action={<Button size="sm" onClick={() => setIsFormOpen(true)}><Plus className="w-4 h-4" /> New Set</Button>}
        />
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <Button size="sm" onClick={() => setIsFormOpen(true)}><Plus className="w-4 h-4" /> New Set</Button>
          </div>

          {sets.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-8">No saved hashtag sets yet. Use AI above or create one manually.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {sets.map(set => (
                <Card key={set.id}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-zinc-800">{set.name}</h3>
                      <PlatformBadge platform={set.platform} />
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => copyHashtags(set.id, set.hashtags)}
                        className="p-1.5 text-zinc-400 hover:text-violet-600 transition-colors"
                      >
                        {copiedId === set.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button onClick={() => deleteSet(set.id)} className="p-1.5 text-zinc-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {set.hashtags.map(tag => (
                      <span key={tag} className="text-xs text-violet-600 bg-violet-100 px-2 py-1 rounded">{tag}</span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="New Hashtag Set">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Set Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Fitness Reels" required />
          <Select
            label="Platform"
            options={PLATFORM_OPTIONS}
            value={platform}
            onChange={e => setPlatform(e.target.value as Platform)}
          />
          <Textarea label="Hashtags" value={hashtags} onChange={e => setHashtags(e.target.value)} placeholder="#fitness #workout #gym #health" rows={4} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
