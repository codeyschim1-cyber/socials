'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import {
  ChevronDown, ChevronRight, Zap, Shield, Skull, Film,
  Mic, Clock, BookOpen
} from 'lucide-react';

function CollapsibleSection({ title, icon: Icon, children, defaultOpen = false }: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 text-left"
      >
        <Icon className="w-5 h-5 text-violet-600 shrink-0" />
        <h2 className="text-sm font-bold text-zinc-900 flex-1">{title}</h2>
        {open ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />}
      </button>
      {open && <div className="mt-4">{children}</div>}
    </Card>
  );
}

function TierBadge({ tier }: { tier: 'S' | 'A' | 'B' | 'C' }) {
  const colors = {
    S: 'bg-violet-100 text-violet-700 border-violet-300',
    A: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    B: 'bg-amber-100 text-amber-700 border-amber-300',
    C: 'bg-zinc-100 text-zinc-500 border-zinc-300',
  };
  return <span className={`text-xs font-bold px-2 py-0.5 rounded border ${colors[tier]}`}>{tier}-Tier</span>;
}

export function PlaybookDashboard() {
  const [activeTemplate, setActiveTemplate] = useState<'hidden_gem' | 'epic_haul' | 'curated_list'>('hidden_gem');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="w-6 h-6 text-violet-600" />
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Content Playbook</h1>
          <p className="text-sm text-zinc-400">Data-backed reference guide — pull up before filming or writing any script</p>
        </div>
      </div>

      {/* 1. HOOK RANKINGS */}
      <CollapsibleSection title="Hook Rankings" icon={Zap} defaultOpen>
        <div className="space-y-3">
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TierBadge tier="S" />
              <span className="text-sm font-semibold text-zinc-800">Authority / Fight Me</span>
            </div>
            <p className="text-xs text-zinc-600">&ldquo;The best vintage store in the country&rdquo; — Highest reach and shares. Triggers debate and FOMO.</p>
            <p className="text-[10px] text-violet-600 mt-1">Proof: &ldquo;GIANT bulk thrift&rdquo; — 1.7M views, 63K shares, 4,083 follows</p>
          </div>

          <div className="bg-violet-50 border border-violet-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TierBadge tier="S" />
              <span className="text-sm font-semibold text-zinc-800">Secret / Gatekept</span>
            </div>
            <p className="text-xs text-zinc-600">&ldquo;Behind me...&rdquo; / &ldquo;Secret designer showroom&rdquo; — Highest saves. Feels like insider knowledge.</p>
            <p className="text-[10px] text-violet-600 mt-1">Proof: &ldquo;The BEST designer bags&rdquo; — 542K views, 7.3K saves, 33% skip rate (vs 59.5% typical)</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TierBadge tier="A" />
              <span className="text-sm font-semibold text-zinc-800">Price Disruption</span>
            </div>
            <p className="text-xs text-zinc-600">&ldquo;Everything is $25&rdquo; — Highest retention. 105% retention on top videos. Price anchors hook immediately.</p>
            <p className="text-[10px] text-emerald-600 mt-1">Proof: &ldquo;BUY BY THE POUND&rdquo; — 2.8M views (all-time #1)</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TierBadge tier="A" />
              <span className="text-sm font-semibold text-zinc-800">Scale / Quantity</span>
            </div>
            <p className="text-xs text-zinc-600">&ldquo;5 floors of furniture&rdquo; / &ldquo;160 vendors&rdquo; — Strong utility, builds local audience. Number anchors.</p>
            <p className="text-[10px] text-emerald-600 mt-1">Proof: &ldquo;FIVE STORY VINTAGE FURNITURE&rdquo; — 235K views, 4.6K shares</p>
          </div>
        </div>
      </CollapsibleSection>

      {/* 2. THE 10 RULES */}
      <CollapsibleSection title="The 10 Rules" icon={Shield}>
        <div className="space-y-2">
          {[
            { rule: 'Lead with a quantifiable superlative by frame 0', proof: '"GIANT bulk thrift" — 1.7M views. Superlatives trigger FOMO and debate.' },
            { rule: 'Deliver core payload by 0:04', proof: '"BUY BY THE POUND" — 2.8M views. Price in first 3 seconds = highest retention.' },
            { rule: 'Logistics in text overlays ONLY, never voiceover', proof: 'Top videos never speak addresses. Voiceover sells vibe, text handles the map.' },
            { rule: 'Show a hero item in first 2 seconds', proof: '"The BEST designer bags" — 542K views. Immediate visual proof of hook claim.' },
            { rule: 'On-screen checklists drive saves', proof: '"Best for: X, Y, Z" format consistently produces highest save rates.' },
            { rule: 'Number anchors for scale', proof: '"3 floors", "160 vendors", "pay by the pound" — concrete numbers outperform vague descriptions.' },
            { rule: 'B-roll cuts every 1-2 seconds', proof: 'Rack-scanning without cuts = highest skip rates. Fast cuts maintain attention.' },
            { rule: 'Spot Reveal 3-2-1 countdown', proof: 'Builds watch time via anticipation. Viewers stay to see the reveal.' },
            { rule: 'Comment-bait close spikes engagement', proof: '"Which one would you pick?" — drives comments which boost algorithmic reach.' },
            { rule: 'Out-of-city gatekeeping increases shares', proof: '"A train trip out of NYC" — 83K views. Feels like a secret, drives friend-tags.' },
          ].map((item, i) => (
            <div key={i} className="bg-surface-elevated rounded-lg px-3 py-2.5">
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold text-violet-600 mt-0.5 shrink-0">#{i + 1}</span>
                <div>
                  <p className="text-sm font-medium text-zinc-800">{item.rule}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{item.proof}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* 3. THE KILL LIST */}
      <CollapsibleSection title="The Kill List" icon={Skull}>
        <div className="space-y-2">
          {[
            { killer: 'Spoken logistics in voiceover', detail: 'Addresses, hours, dates spoken aloud = immediate drop-off. Always use text overlays instead.' },
            { killer: 'Owner biography or store history', detail: 'Backstory kills pacing. Viewers want to see items, not hear founding stories.' },
            { killer: 'Static architecture over 1.5 seconds', detail: 'Ceilings, building exteriors, flags — anything that isn\'t product = viewer leaves.' },
            { killer: 'Generic rack scanning without hero item', detail: 'Panning across racks with no specific callout = dead b-roll. Always name what you\'re showing.' },
            { killer: 'Weak opening (greeting, slow intro, static)', detail: '"Hey guys welcome back" = instant skip. Always start mid-action with bold text at frame 0.' },
          ].map((item, i) => (
            <div key={i} className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
              <p className="text-sm font-medium text-red-800">{item.killer}</p>
              <p className="text-xs text-red-600 mt-0.5">{item.detail}</p>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* 4. SCRIPT TEMPLATES */}
      <CollapsibleSection title="Script Templates" icon={Film}>
        <div className="flex bg-surface-elevated rounded-lg p-0.5 mb-4">
          {([
            { id: 'hidden_gem' as const, label: 'Hidden Gem' },
            { id: 'epic_haul' as const, label: 'Epic Haul' },
            { id: 'curated_list' as const, label: 'Curated List' },
          ]).map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTemplate(t.id)}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                activeTemplate === t.id ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-zinc-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTemplate === 'hidden_gem' && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-500">For unique stores, secret spots, lesser-known markets</p>
            <div className="space-y-2">
              <div className="bg-violet-50 rounded-lg p-3">
                <p className="text-xs font-bold text-violet-700 mb-1">HOOK (0-3s)</p>
                <p className="text-sm text-zinc-700">Dynamic movement toward camera + bold secret/gatekept text overlay</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs font-bold text-blue-700 mb-1">BUILD (3-10s)</p>
                <p className="text-sm text-zinc-700">Fast cuts of best items + on-screen checklist of what store is known for</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-xs font-bold text-emerald-700 mb-1">CLIMAX (10-15s)</p>
                <p className="text-sm text-zinc-700">Spot Reveal 3-2-1 countdown into store name and location text</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-xs font-bold text-amber-700 mb-1">CLOSE (15-18s)</p>
                <p className="text-sm text-zinc-700">Comment bait question or abrupt strong visual</p>
              </div>
            </div>
          </div>
        )}

        {activeTemplate === 'epic_haul' && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-500">For wholesale, warehouses, out-of-city trips</p>
            <div className="space-y-2">
              <div className="bg-violet-50 rounded-lg p-3">
                <p className="text-xs font-bold text-violet-700 mb-1">HOOK (0-3s)</p>
                <p className="text-sm text-zinc-700">Travel shot (train, walking out of station) + superlative scale claim</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs font-bold text-blue-700 mb-1">BUILD (3-10s)</p>
                <p className="text-sm text-zinc-700">Scale montage — bins, piles, bulk stats, pay-by-pound text overlay</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-xs font-bold text-emerald-700 mb-1">CLIMAX (10-15s)</p>
                <p className="text-sm text-zinc-700">Hero find close-up with price reveal</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-xs font-bold text-amber-700 mb-1">CLOSE (15-18s)</p>
                <p className="text-sm text-zinc-700">Tag-a-friend CTA (&ldquo;Who are you bringing here?&rdquo;)</p>
              </div>
            </div>
          </div>
        )}

        {activeTemplate === 'curated_list' && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-500">For neighborhood roundups, best-of lists</p>
            <div className="space-y-2">
              <div className="bg-violet-50 rounded-lg p-3">
                <p className="text-xs font-bold text-violet-700 mb-1">HOOK (0-3s)</p>
                <p className="text-sm text-zinc-700">Street corner shot with neighborhood name + &ldquo;come with me&rdquo; invite</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs font-bold text-blue-700 mb-1">BUILD (3-10s)</p>
                <p className="text-sm text-zinc-700">Rapid-fire stops with map pin text overlays (&ldquo;Best for: X&rdquo;)</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-xs font-bold text-emerald-700 mb-1">CLIMAX (10-15s)</p>
                <p className="text-sm text-zinc-700">Spot Reveal countdown on the final stop</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-xs font-bold text-amber-700 mb-1">CLOSE (15-18s)</p>
                <p className="text-sm text-zinc-700">&ldquo;Drop your favorite spot in the comments&rdquo; CTA</p>
              </div>
            </div>
          </div>
        )}
      </CollapsibleSection>

      {/* 5. BRAND VOICE */}
      <CollapsibleSection title="Brand Voice" icon={Mic}>
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Tone & Energy</h3>
            <div className="flex flex-wrap gap-2">
              {['Authoritative', 'High-energy', 'Fast-paced', 'Unpretentious', 'In-the-know', 'Discerning', 'Direct', 'Urgent'].map(t => (
                <span key={t} className="text-xs bg-violet-50 text-violet-700 px-2 py-1 rounded">{t}</span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Sentence Structure</h3>
            <ul className="text-xs text-zinc-600 space-y-1">
              <li>Short punchy fragments. High information density.</li>
              <li>No filler words (um, like, so basically).</li>
              <li>State facts, don&apos;t editorialize. Rhythmic and fast pacing.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Recurring Phrases</h3>
            <div className="flex flex-wrap gap-2">
              {['"Behind me..."', '"The best [X] in the country"', '"True thrifting..."', '"Let\'s go"', '"Come with me"', '"Check it out"', '"3 floors"', '"160 vendors"'].map(p => (
                <span key={p} className="text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded">{p}</span>
              ))}
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <h3 className="text-xs font-bold text-red-700 mb-2">NEVER SAY</h3>
            <ul className="text-xs text-red-600 space-y-1">
              <li>&ldquo;Hey guys, welcome back&rdquo;</li>
              <li>&ldquo;Make sure to like, comment, and subscribe&rdquo;</li>
              <li>&ldquo;The vibes here are immaculate&rdquo;</li>
              <li>Flowery slow introductions</li>
              <li>Anything generic that doesn&apos;t reference a specific item, price, or place</li>
            </ul>
          </div>

          <div className="bg-violet-50 border border-violet-200 rounded-lg p-3">
            <h3 className="text-xs font-bold text-violet-700 mb-2">CONTENT PERSONALITY (3 sentences)</h3>
            <p className="text-sm text-zinc-700">
              I am the ultimate insider giving viewers the keys to the city&apos;s best hidden gems and true thrift spots. I bypass tourist traps to deliver actionable, high-value maps directly to my audience. I respect my viewers&apos; time by leading with a massive hook, proving value immediately with hero items, and getting out of the way.
            </p>
          </div>
        </div>
      </CollapsibleSection>

      {/* 6. OPTIMAL FORMAT */}
      <CollapsibleSection title="Optimal Format" icon={Clock}>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="bg-surface-elevated rounded-lg p-3">
            <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Length Sweet Spot</p>
            <p className="text-xl font-bold text-violet-600">12–18 seconds</p>
            <p className="text-xs text-zinc-500 mt-1">Flag any script over 18s. Average viewer leaves at 4-5s without payload.</p>
          </div>

          <div className="bg-surface-elevated rounded-lg p-3">
            <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Payload Timing</p>
            <p className="text-xl font-bold text-violet-600">By 0:04</p>
            <p className="text-xs text-zinc-500 mt-1">Core value (price, secret, hero item) must land in first 4 seconds.</p>
          </div>

          <div className="bg-surface-elevated rounded-lg p-3">
            <p className="text-xs font-bold text-zinc-500 uppercase mb-1">B-Roll Pace</p>
            <p className="text-xl font-bold text-violet-600">1–2s per cut</p>
            <p className="text-xs text-zinc-500 mt-1">Never linger on a single item unless it&apos;s a confirmed grail piece.</p>
          </div>

          <div className="bg-surface-elevated rounded-lg p-3">
            <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Structure</p>
            <p className="text-sm font-bold text-zinc-800">Hook → Build → Reveal → CTA</p>
            <p className="text-xs text-zinc-500 mt-1">0-3s → 3-10s → 10-15s → 15-18s</p>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Close Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { type: 'Comment Bait', example: '"Which one would you pick?"', use: 'Spike comments' },
              { type: 'Spot Reveal', example: '"3, 2, 1..."', use: 'Build watch time' },
              { type: 'Fast Directive', example: '"Check it out"', use: 'Quick CTA' },
              { type: 'Strong Visual', example: 'Abrupt end on hero item', use: 'Replay value' },
              { type: 'Save Prompt', example: '"Save for your next trip"', use: 'Drive saves' },
              { type: 'Tag a Friend', example: '"Tag who you\'d bring"', use: 'Drive reach' },
            ].map(c => (
              <div key={c.type} className="bg-zinc-50 border border-zinc-200 rounded-lg p-2">
                <p className="text-xs font-semibold text-zinc-800">{c.type}</p>
                <p className="text-[10px] text-zinc-500">{c.example}</p>
                <p className="text-[10px] text-violet-600">{c.use}</p>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}
