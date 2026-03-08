'use client';

import { useState } from 'react';
import { useCaptionTemplates } from '@/hooks/useCaptionTemplates';
import { useApiKey } from '@/hooks/useApiKey';
import { useMediaKit } from '@/hooks/useMediaKit';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { Badge, PlatformBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

import { Platform } from '@/types/common';
import { PLATFORM_OPTIONS } from '@/lib/constants';
import { Plus, FileText, Copy, Trash2, Check, Sparkles, Loader2, RefreshCw, Save } from 'lucide-react';

const TONE_OPTIONS = [
  { value: 'casual', label: 'Casual' },
  { value: 'professional', label: 'Professional' },
  { value: 'funny', label: 'Funny' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'storytelling', label: 'Storytelling' },
  { value: 'educational', label: 'Educational' },
];

export function CaptionTemplates() {
  const { templates, addTemplate, deleteTemplate } = useCaptionTemplates();
  const { apiKey } = useApiKey();
  const { mediaKit } = useMediaKit();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [template, setTemplate] = useState('');
  const [category, setCategory] = useState('');
  const [platform, setPlatform] = useState<Platform>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // AI generation state
  const [aiDescription, setAiDescription] = useState('');
  const [aiPlatform, setAiPlatform] = useState<Platform>('all');
  const [aiTone, setAiTone] = useState('casual');
  const [aiEmojis, setAiEmojis] = useState(true);
  const [aiCTA, setAiCTA] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiPreview, setAiPreview] = useState<{ name: string; category: string; caption: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTemplate({ name, template, category, platform });
    setName(''); setTemplate(''); setCategory(''); setIsFormOpen(false);
  };

  const copyTemplate = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAIGenerate = async () => {
    if (!apiKey || !aiDescription.trim()) return;

    setIsGenerating(true);
    setAiError('');
    setAiPreview(null);

    try {
      const res = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          contentDescription: aiDescription,
          platform: aiPlatform,
          tone: aiTone,
          includeEmojis: aiEmojis,
          includeCTA: aiCTA,
          niche: mediaKit.niche.length > 0 ? mediaKit.niche.join(', ') : undefined,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setAiError(data.error);
      } else {
        setAiPreview({ name: data.name, category: data.category, caption: data.caption });
      }
    } catch {
      setAiError('Failed to generate caption. Check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAICaption = () => {
    if (!aiPreview) return;
    addTemplate({ name: aiPreview.name, template: aiPreview.caption, category: aiPreview.category, platform: aiPlatform });
    setAiPreview(null);
    setAiDescription('');
  };

  return (
    <div>
      {/* AI Generation Card */}
      {apiKey && (
        <Card className="border-violet-500/30 bg-violet-500/5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <h3 className="text-sm font-semibold text-zinc-200">AI Caption Generator</h3>
          </div>

          <div className="space-y-3">
            <Textarea
              value={aiDescription}
              onChange={e => setAiDescription(e.target.value)}
              placeholder="Describe your content... e.g. 'A reel showing my top 5 vintage Ralph Lauren finds from this week's thrift run'"
              rows={2}
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Platform"
                options={PLATFORM_OPTIONS}
                value={aiPlatform}
                onChange={e => setAiPlatform(e.target.value as Platform)}
              />
              <Select
                label="Tone"
                options={TONE_OPTIONS}
                value={aiTone}
                onChange={e => setAiTone(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aiEmojis}
                  onChange={e => setAiEmojis(e.target.checked)}
                  className="rounded border-zinc-600 bg-zinc-800 text-violet-500 focus:ring-violet-500"
                />
                Include Emojis
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aiCTA}
                  onChange={e => setAiCTA(e.target.checked)}
                  className="rounded border-zinc-600 bg-zinc-800 text-violet-500 focus:ring-violet-500"
                />
                Include CTA
              </label>
            </div>
            <Button
              size="sm"
              onClick={handleAIGenerate}
              disabled={isGenerating || !aiDescription.trim()}
            >
              {isGenerating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate Caption</>
              )}
            </Button>

            {aiError && <p className="text-sm text-red-400">{aiError}</p>}
          </div>

          {/* AI Preview */}
          {aiPreview && (
            <div className="mt-4 p-3 bg-surface-elevated rounded-lg border border-zinc-700">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-sm font-medium text-zinc-200">{aiPreview.name}</h4>
                <Badge className="bg-zinc-700 text-zinc-300">{aiPreview.category}</Badge>
              </div>
              <p className="text-xs text-zinc-400 whitespace-pre-wrap bg-zinc-900/50 rounded-lg p-3 mb-3">{aiPreview.caption}</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveAICaption}>
                  <Save className="w-4 h-4" /> Save as Template
                </Button>
                <Button variant="secondary" size="sm" onClick={handleAIGenerate} disabled={isGenerating}>
                  <RefreshCw className="w-4 h-4" /> Regenerate
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(aiPreview.caption);
                    setCopiedId('ai-preview');
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                >
                  {copiedId === 'ai-preview' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />} Copy
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {templates.length === 0 && !apiKey ? (
        <EmptyState
          icon={FileText}
          title="No caption templates yet"
          description="Save reusable caption templates to speed up your content creation."
          action={<Button size="sm" onClick={() => setIsFormOpen(true)}><Plus className="w-4 h-4" /> New Template</Button>}
        />
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <Button size="sm" onClick={() => setIsFormOpen(true)}><Plus className="w-4 h-4" /> New Template</Button>
          </div>

          {templates.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-8">No saved templates yet. Use AI above or create one manually.</p>
          ) : (
            <div className="space-y-3">
              {templates.map(t => (
                <Card key={t.id}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-zinc-200">{t.name}</h3>
                        <PlatformBadge platform={t.platform} />
                        {t.category && <Badge className="bg-zinc-700 text-zinc-300">{t.category}</Badge>}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => copyTemplate(t.id, t.template)} className="p-1.5 text-zinc-500 hover:text-violet-400 transition-colors">
                        {copiedId === t.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button onClick={() => deleteTemplate(t.id)} className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 whitespace-pre-wrap bg-surface-elevated rounded-lg p-3">{t.template}</p>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="New Caption Template">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Product Review" required />
          <Input label="Category" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. review, story time" />
          <Select
            label="Platform"
            options={PLATFORM_OPTIONS}
            value={platform}
            onChange={e => setPlatform(e.target.value as Platform)}
          />
          <Textarea label="Template" value={template} onChange={e => setTemplate(e.target.value)} placeholder="Write your template... Use {{placeholder}} for dynamic parts" rows={6} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
