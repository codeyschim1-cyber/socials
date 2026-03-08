'use client';

import { useState } from 'react';
import { useApiKey } from '@/hooks/useApiKey';
import { useMediaKit } from '@/hooks/useMediaKit';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';

export function AIManager() {
  const { apiKey } = useApiKey();
  const { mediaKit } = useMediaKit();
  const [email, setEmail] = useState('');
  const [response, setResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleDraftResponse = async () => {
    if (!apiKey || !email.trim()) return;
    setIsGenerating(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/draft-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          email,
          creatorProfile: {
            displayName: mediaKit.displayName,
            bio: mediaKit.bio,
            niche: mediaKit.niche.join(', '),
            instagramHandle: mediaKit.instagramHandle,
            tiktokHandle: mediaKit.tiktokHandle,
            youtubeHandle: mediaKit.youtubeHandle,
            instagramFollowers: mediaKit.instagramFollowers,
            tiktokFollowers: mediaKit.tiktokFollowers,
            youtubeSubscribers: mediaKit.youtubeSubscribers,
            rates: mediaKit.rates,
          },
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResponse(data.response);
      }
    } catch {
      setError('Failed to generate response.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-violet-600" />
          <h3 className="text-sm font-semibold text-zinc-800">AI Manager</h3>
        </div>
        <p className="text-xs text-zinc-500 mb-4">
          Paste an inbound brand email and get a professional manager-toned response draft using your media kit rates and profile.
        </p>

        <Textarea
          label="Inbound Brand Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Paste the brand's email here..."
          rows={8}
        />

        <div className="mt-3">
          <Button size="sm" onClick={handleDraftResponse} disabled={isGenerating || !email.trim() || !apiKey}>
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Drafting...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Draft Response</>
            )}
          </Button>
        </div>

        {!apiKey && (
          <p className="text-xs text-zinc-400 mt-2">Set your API key in the Ideas &rarr; AI Generate tab first.</p>
        )}
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </Card>

      {response && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-zinc-800">Generated Response</h3>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <textarea
            value={response}
            onChange={e => setResponse(e.target.value)}
            rows={12}
            className="w-full bg-surface-elevated border border-zinc-200 rounded-lg p-3 text-sm text-zinc-700 focus:outline-none focus:border-violet-500 resize-y"
          />
        </Card>
      )}
    </div>
  );
}
