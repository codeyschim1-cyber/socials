'use client';

import { useState } from 'react';
import { useApiKey } from '@/hooks/useApiKey';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';

const PLATFORM_FORMAT_OPTIONS = [
  { value: 'tiktok-video', label: 'TikTok Video' },
  { value: 'instagram-reel', label: 'Instagram Reel' },
  { value: 'instagram-carousel', label: 'Instagram Carousel' },
  { value: 'youtube-video', label: 'YouTube Video' },
  { value: 'youtube-short', label: 'YouTube Short' },
  { value: 'blog-post', label: 'Blog Post' },
];

interface PlatformResult {
  title: string;
  [key: string]: unknown;
}

export function RepurposeEngine() {
  const { apiKey } = useApiKey();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [originalPlatform, setOriginalPlatform] = useState('tiktok-video');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<Record<string, PlatformResult> | null>(null);
  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!apiKey || !title.trim()) return;
    setIsGenerating(true);
    setError('');
    setResults(null);

    try {
      const res = await fetch('/api/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, title, description, originalPlatform }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResults(data);
      }
    } catch {
      setError('Failed to generate repurposed content.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const renderPlatformCard = (platform: string, data: PlatformResult) => {
    const colors: Record<string, string> = {
      tiktok: 'border-teal-300 bg-teal-50/50',
      instagram: 'border-pink-300 bg-pink-50/50',
      youtube: 'border-red-300 bg-red-50/50',
      pinterest: 'border-orange-300 bg-orange-50/50',
    };

    const labels: Record<string, string> = {
      tiktok: 'TikTok',
      instagram: 'Instagram Carousel',
      youtube: 'YouTube',
      pinterest: 'Pinterest',
    };

    const content = JSON.stringify(data, null, 2);
    const isCopied = copiedKey === platform;

    return (
      <Card key={platform} className={`${colors[platform] || ''}`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-zinc-800">{labels[platform] || platform}</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(formatForCopy(data), platform)}
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </Button>
        </div>
        <h5 className="text-sm font-medium text-zinc-700 mb-2">{data.title}</h5>
        {renderFields(data)}
      </Card>
    );
  };

  const renderFields = (data: PlatformResult) => {
    const skip = ['title', 'tips'];
    return (
      <div className="space-y-2">
        {Object.entries(data).filter(([k]) => !skip.includes(k)).map(([key, value]) => (
          <div key={key}>
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1')}</span>
            {Array.isArray(value) ? (
              <ul className="mt-1 space-y-0.5">
                {value.map((item, i) => (
                  <li key={i} className="text-xs text-zinc-600 pl-2 border-l-2 border-zinc-200">{typeof item === 'string' ? item : JSON.stringify(item)}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-zinc-600 mt-0.5 whitespace-pre-wrap">{String(value)}</p>
            )}
          </div>
        ))}
        {typeof data.tips === 'string' && data.tips && (
          <div className="mt-2 bg-violet-50 border border-violet-200 rounded px-2 py-1.5">
            <span className="text-[10px] font-semibold text-violet-600">TIP:</span>
            <p className="text-xs text-violet-700 mt-0.5">{String(data.tips)}</p>
          </div>
        )}
      </div>
    );
  };

  const formatForCopy = (data: PlatformResult): string => {
    return Object.entries(data).map(([key, value]) => {
      if (Array.isArray(value)) return `${key}:\n${value.map(v => `  - ${v}`).join('\n')}`;
      return `${key}: ${value}`;
    }).join('\n\n');
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-violet-600" />
          <h3 className="text-sm font-semibold text-zinc-800">Content Repurposing Engine</h3>
        </div>
        <p className="text-xs text-zinc-500 mb-4">
          Enter a content idea and get platform-optimized versions for TikTok, Instagram, YouTube, and Pinterest.
        </p>

        <div className="space-y-3">
          <Input label="Content Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Top 5 Thrift Store Finds This Week" />
          <Textarea label="Description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of the content..." />
          <Select label="Original Format" options={PLATFORM_FORMAT_OPTIONS} value={originalPlatform} onChange={e => setOriginalPlatform(e.target.value)} />
        </div>

        <div className="mt-4">
          <Button size="sm" onClick={handleGenerate} disabled={isGenerating || !title.trim() || !apiKey}>
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Repurpose</>
            )}
          </Button>
        </div>

        {!apiKey && (
          <p className="text-xs text-zinc-400 mt-2">Set your API key in the AI Generate tab first.</p>
        )}
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </Card>

      {results && (
        <div className="grid md:grid-cols-2 gap-4">
          {['tiktok', 'instagram', 'youtube', 'pinterest'].map(platform =>
            results[platform] ? renderPlatformCard(platform, results[platform]) : null
          )}
        </div>
      )}
    </div>
  );
}
