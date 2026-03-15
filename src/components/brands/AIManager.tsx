'use client';

import { useState } from 'react';
import { useApiKey } from '@/hooks/useApiKey';
import { useMediaKit } from '@/hooks/useMediaKit';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Sparkles, Loader2, Copy, Check, Mail, ArrowLeftRight, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

type ManagerTab = 'inbound' | 'counter' | 'rate-check';

const VERDICT_COLORS: Record<string, { bg: string; text: string; icon: typeof CheckCircle }> = {
  good_deal: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle },
  fair_deal: { bg: 'bg-blue-50', text: 'text-blue-700', icon: CheckCircle },
  undervalued: { bg: 'bg-amber-50', text: 'text-amber-700', icon: AlertTriangle },
  red_flag: { bg: 'bg-red-50', text: 'text-red-700', icon: AlertTriangle },
};

export function AIManager() {
  const { apiKey } = useApiKey();
  const { mediaKit } = useMediaKit();
  const [tab, setTab] = useState<ManagerTab>('inbound');

  // Inbound state
  const [email, setEmail] = useState('');
  const [inboundResponse, setInboundResponse] = useState('');
  const [isInboundGenerating, setIsInboundGenerating] = useState(false);

  // Counter-offer state
  const [brandProposal, setBrandProposal] = useState('');
  const [brandResponse, setBrandResponse] = useState('');
  const [counterResult, setCounterResult] = useState<{ analysis: string; strategy: string; counterEmail: string; keyPoints: string[] } | null>(null);
  const [isCounterGenerating, setIsCounterGenerating] = useState(false);

  // Rate check state
  const [dealDescription, setDealDescription] = useState('');
  const [rateResult, setRateResult] = useState<{ verdict: string; assessment: string; fairValue: string; hiddenCosts: string[]; redFlags: string[]; recommendedCounter: string; summary: string } | null>(null);
  const [isRateGenerating, setIsRateGenerating] = useState(false);

  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Inbound handler
  const handleDraftResponse = async () => {
    if (!apiKey || !email.trim()) return;
    setIsInboundGenerating(true);
    setError('');
    setInboundResponse('');

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
      if (data.error) setError(data.error);
      else setInboundResponse(data.response);
    } catch {
      setError('Failed to generate response.');
    } finally {
      setIsInboundGenerating(false);
    }
  };

  // Counter-offer handler
  const handleCounterOffer = async () => {
    if (!apiKey || !brandProposal.trim() || !brandResponse.trim()) return;
    setIsCounterGenerating(true);
    setError('');
    setCounterResult(null);

    try {
      const res = await fetch('/api/counter-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, brandProposal, brandResponse }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setCounterResult(data);
    } catch {
      setError('Failed to generate counter-offer.');
    } finally {
      setIsCounterGenerating(false);
    }
  };

  // Rate check handler
  const handleRateCheck = async () => {
    if (!apiKey || !dealDescription.trim()) return;
    setIsRateGenerating(true);
    setError('');
    setRateResult(null);

    try {
      const res = await fetch('/api/rate-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, dealDescription }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setRateResult(data);
    } catch {
      setError('Failed to check rate.');
    } finally {
      setIsRateGenerating(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Tab selector */}
      <div className="flex bg-surface-elevated rounded-lg p-0.5">
        {([
          { id: 'inbound' as const, label: 'Inbound', icon: Mail },
          { id: 'counter' as const, label: 'Counter-Offer', icon: ArrowLeftRight },
          { id: 'rate-check' as const, label: 'Rate Check', icon: DollarSign },
        ]).map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
              tab === t.id ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-zinc-800'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {!apiKey && (
        <Card className="border-amber-200 bg-amber-50">
          <p className="text-xs text-amber-700">Set your API key in the Ideas → AI Generate tab first.</p>
        </Card>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* INBOUND TAB */}
      {tab === 'inbound' && (
        <>
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-5 h-5 text-violet-600" />
              <h3 className="text-sm font-semibold text-zinc-800">Inbound Brand Email</h3>
            </div>
            <p className="text-xs text-zinc-500 mb-4">
              Paste an inbound brand email and get a professional manager-toned response using your rates and profile.
            </p>
            <Textarea
              label="Brand Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Paste the brand's email here..."
              rows={8}
            />
            <div className="mt-3">
              <Button size="sm" onClick={handleDraftResponse} disabled={isInboundGenerating || !email.trim() || !apiKey}>
                {isInboundGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Drafting...</> : <><Sparkles className="w-4 h-4" /> Draft Response</>}
              </Button>
            </div>
          </Card>

          {inboundResponse && (
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-zinc-800">Generated Response</h3>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(inboundResponse)}>
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <textarea
                value={inboundResponse}
                onChange={e => setInboundResponse(e.target.value)}
                rows={12}
                className="w-full bg-surface-elevated border border-zinc-200 rounded-lg p-3 text-sm text-zinc-700 focus:outline-none focus:border-violet-500 resize-y"
              />
            </Card>
          )}
        </>
      )}

      {/* COUNTER-OFFER TAB */}
      {tab === 'counter' && (
        <>
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <ArrowLeftRight className="w-5 h-5 text-violet-600" />
              <h3 className="text-sm font-semibold text-zinc-800">Counter-Offer Strategy</h3>
            </div>
            <p className="text-xs text-zinc-500 mb-4">
              Paste your original proposal and the brand&apos;s response to get a negotiation strategy and counter-offer email.
            </p>
            <Textarea
              label="Your Original Proposal"
              value={brandProposal}
              onChange={e => setBrandProposal(e.target.value)}
              placeholder="Paste what you (or your AI manager) originally proposed..."
              rows={5}
            />
            <div className="mt-3">
              <Textarea
                label="Brand's Response"
                value={brandResponse}
                onChange={e => setBrandResponse(e.target.value)}
                placeholder="Paste the brand's counter or response..."
                rows={5}
              />
            </div>
            <div className="mt-3">
              <Button size="sm" onClick={handleCounterOffer} disabled={isCounterGenerating || !brandProposal.trim() || !brandResponse.trim() || !apiKey}>
                {isCounterGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Sparkles className="w-4 h-4" /> Generate Counter</>}
              </Button>
            </div>
          </Card>

          {counterResult && (
            <div className="space-y-4">
              <Card>
                <h3 className="text-sm font-semibold text-zinc-800 mb-2">Analysis</h3>
                <p className="text-sm text-zinc-600 whitespace-pre-wrap">{counterResult.analysis}</p>
              </Card>
              <Card>
                <h3 className="text-sm font-semibold text-zinc-800 mb-2">Strategy</h3>
                <p className="text-sm text-zinc-600 whitespace-pre-wrap">{counterResult.strategy}</p>
                {counterResult.keyPoints.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {counterResult.keyPoints.map((p, i) => (
                      <li key={i} className="text-xs text-zinc-500 flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-violet-500 mt-0.5 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-zinc-800">Counter-Offer Email</h3>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(counterResult.counterEmail)}>
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
                <textarea
                  value={counterResult.counterEmail}
                  onChange={e => setCounterResult({ ...counterResult, counterEmail: e.target.value })}
                  rows={12}
                  className="w-full bg-surface-elevated border border-zinc-200 rounded-lg p-3 text-sm text-zinc-700 focus:outline-none focus:border-violet-500 resize-y"
                />
              </Card>
            </div>
          )}
        </>
      )}

      {/* RATE CHECK TAB */}
      {tab === 'rate-check' && (
        <>
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-violet-600" />
              <h3 className="text-sm font-semibold text-zinc-800">Rate Check</h3>
            </div>
            <p className="text-xs text-zinc-500 mb-4">
              Describe a deal opportunity and get an assessment of its fair value, hidden costs, and recommended counter.
            </p>
            <Textarea
              label="Deal Description"
              value={dealDescription}
              onChange={e => setDealDescription(e.target.value)}
              placeholder="Describe the deal: brand name, deliverables requested, rate offered, timeline, exclusivity, usage rights, etc."
              rows={6}
            />
            <div className="mt-3">
              <Button size="sm" onClick={handleRateCheck} disabled={isRateGenerating || !dealDescription.trim() || !apiKey}>
                {isRateGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Checking...</> : <><Sparkles className="w-4 h-4" /> Check Rate</>}
              </Button>
            </div>
          </Card>

          {rateResult && (
            <div className="space-y-4">
              {/* Verdict banner */}
              {(() => {
                const v = VERDICT_COLORS[rateResult.verdict] || VERDICT_COLORS.fair_deal;
                const Icon = v.icon;
                return (
                  <div className={`${v.bg} ${v.text} rounded-lg px-4 py-3 flex items-center gap-3`}>
                    <Icon className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">{rateResult.verdict.replace('_', ' ').toUpperCase()}</p>
                      <p className="text-xs mt-0.5">{rateResult.summary}</p>
                    </div>
                    <p className="ml-auto text-lg font-bold">{rateResult.fairValue}</p>
                  </div>
                );
              })()}

              <Card>
                <h3 className="text-sm font-semibold text-zinc-800 mb-2">Assessment</h3>
                <p className="text-sm text-zinc-600 whitespace-pre-wrap">{rateResult.assessment}</p>
              </Card>

              {rateResult.hiddenCosts.length > 0 && (
                <Card>
                  <h3 className="text-sm font-semibold text-zinc-800 mb-2">Hidden Costs</h3>
                  <ul className="space-y-1.5">
                    {rateResult.hiddenCosts.map((c, i) => (
                      <li key={i} className="text-xs text-zinc-600 flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {rateResult.redFlags.length > 0 && (
                <Card>
                  <h3 className="text-sm font-semibold text-zinc-800 mb-2">Red Flags</h3>
                  <ul className="space-y-1.5">
                    {rateResult.redFlags.map((f, i) => (
                      <li key={i} className="text-xs text-red-600 flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              <Card>
                <h3 className="text-sm font-semibold text-zinc-800 mb-2">Recommended Counter</h3>
                <p className="text-sm text-zinc-600 whitespace-pre-wrap">{rateResult.recommendedCounter}</p>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
