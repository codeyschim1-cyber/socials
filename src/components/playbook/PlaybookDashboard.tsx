'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import {
  ChevronDown, ChevronRight, Zap, Shield, Skull, Film,
  Mic, Clock, BookOpen, TrendingUp, MessageSquare, FileText, Users, Target
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

function ScoreBar({ score, max = 5, color = 'violet' }: { score: number; max?: number; color?: string }) {
  const colorMap: Record<string, string> = {
    violet: 'bg-violet-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
  };
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className={`w-4 h-2 rounded-sm ${i < score ? colorMap[color] || 'bg-violet-500' : 'bg-zinc-200'}`} />
      ))}
      <span className="text-xs text-zinc-500 ml-1">{score}/{max}</span>
    </div>
  );
}

export function PlaybookDashboard() {
  const [activeTemplate, setActiveTemplate] = useState<'hidden_gem' | 'epic_haul' | 'curated_list'>('hidden_gem');
  const [activeExample, setActiveExample] = useState(0);

  const workedExamples = [
    {
      title: 'Bulk Warehouse',
      location: 'Philadelphia',
      likes: '71.9K',
      duration: '28s',
      words: 78,
      template: 'Epic Haul',
      geography: 'Out-of-city',
      hooks: [
        { type: 'Scale', text: 'THE BIGGEST BULK THRIFT WAREHOUSE ON THE EAST COAST' },
        { type: 'Value', text: 'EVERYTHING PRICED BY THE POUND' },
        { type: 'Secret', text: "THE WAREHOUSE THEY DON'T WANT YOU TO KNOW ABOUT" },
      ],
      phases: [
        { phase: 'HOOK', time: '0:00-0:04', visual: 'Wide shot walking into massive warehouse', text: 'BULK THRIFT WAREHOUSE — PHILLY', vo: 'This is the biggest bulk thrift warehouse on the entire East Coast.' },
        { phase: 'LOCATION', time: '0:04-0:09', visual: 'Pan across endless rows of bins', text: 'PAY BY THE POUND', vo: "Everything here is priced by the pound. We're talking Ralph Lauren, Burberry, vintage Levi's." },
        { phase: 'INVENTORY', time: '0:09-0:18', visual: 'Rapid cuts: designer tags, price tags, bin diving', text: 'RALPH LAUREN — $3/LB / BURBERRY — $3/LB', vo: 'Three dollars a pound for designer. Bins as far as you can see. People drive hours for this place.' },
        { phase: 'HERO + CLOSE', time: '0:18-0:28', visual: 'Hero item pull + wide warehouse shot', text: 'VINTAGE LEATHER JACKET — $8', vo: 'Just pulled this vintage leather jacket. Eight dollars. Spot reveal in 3, 2, 1.' },
      ],
      audio: 'Uptempo hip-hop, triumphant energy',
      viralityScore: { scale: 5, geography: 5, value: 5, total: 15 },
    },
    {
      title: 'Single-Brand Archive',
      location: 'Kingston, NY',
      likes: '36.9K',
      duration: '30s',
      words: 82,
      template: 'Hidden Gem',
      geography: '2 hrs from NYC',
      hooks: [
        { type: 'Scale', text: 'THE LARGEST RALPH LAUREN ARCHIVE IN THE COUNTRY' },
        { type: 'Secret', text: 'A SECRET DESIGNER ARCHIVE 2 HOURS FROM NYC' },
        { type: 'Value', text: '10,000 PIECES OF RALPH LAUREN UNDER ONE ROOF' },
      ],
      phases: [
        { phase: 'HOOK', time: '0:00-0:04', visual: 'Walking toward storefront, dramatic approach', text: 'THE LARGEST RALPH LAUREN ARCHIVE IN THE COUNTRY', vo: 'This is the largest Ralph Lauren archive in the entire country.' },
        { phase: 'LOCATION', time: '0:04-0:09', visual: 'Push through door, reveal massive interior', text: 'KINGSTON, NY — 2 HRS FROM NYC', vo: 'Two hours north of the city. Ten thousand pieces under one roof.' },
        { phase: 'INVENTORY', time: '0:09-0:20', visual: 'Rapid cuts: Polo, RRL, Purple Label, Sport racks', text: 'POLO / RRL / PURPLE LABEL / SPORT', vo: "Polo, RRL, Purple Label, Sport. Every era, every line. Stuff you cannot find anywhere else." },
        { phase: 'HERO + CLOSE', time: '0:20-0:30', visual: 'Vintage stadium jacket slow zoom + wide store', text: 'VINTAGE STADIUM JACKET — $185', vo: 'This vintage stadium jacket. One eighty-five. This goes for eight hundred online. Which piece would you grab first?' },
      ],
      audio: 'Lo-fi hip-hop, mysterious/exploratory vibe',
      viralityScore: { scale: 4, geography: 5, value: 4, total: 13 },
    },
    {
      title: 'Extreme Value Deal',
      location: 'Williamsburg, BK',
      likes: '14.8K',
      duration: '24s',
      words: 72,
      template: 'Hidden Gem',
      geography: 'NYC (needs value angle)',
      hooks: [
        { type: 'Value', text: 'FILL A BAG OF VINTAGE FOR $10' },
        { type: 'Scale', text: 'THE BEST DEAL IN NYC VINTAGE RIGHT NOW' },
        { type: 'Secret', text: "THE $10 BAG SALE THEY'RE NOT ADVERTISING" },
      ],
      phases: [
        { phase: 'HOOK', time: '0:00-0:04', visual: 'Close-up stuffing items into bag, fast hands', text: 'FILL A BAG — $10', vo: 'Fill an entire bag of vintage for ten dollars.' },
        { phase: 'LOCATION', time: '0:04-0:08', visual: 'Pull back to show store interior', text: 'WILLIAMSBURG, BK', vo: 'This spot in Williamsburg is running the best deal in the city right now.' },
        { phase: 'INVENTORY', time: '0:08-0:18', visual: 'Rapid cuts: brand tags, unique pieces, overflowing bags', text: 'NIKE / CARHARTT / VINTAGE BAND TEES', vo: "Nike, Carhartt, vintage band tees. I'm talking four, five pieces in one bag. Ten dollars." },
        { phase: 'HERO + CLOSE', time: '0:18-0:24', visual: 'Vintage Nike windbreaker + full bag held up', text: 'VINTAGE NIKE — IN THE $10 BAG', vo: 'This vintage Nike windbreaker. In the ten dollar bag. Would you fill a bag?' },
      ],
      audio: 'Uptempo, energetic beat',
      viralityScore: { scale: 2, geography: 1, value: 5, total: 8 },
    },
    {
      title: 'Hidden Gem Reveal',
      location: "Hell's Kitchen, NYC",
      likes: '13.4K',
      duration: '26s',
      words: 74,
      template: 'Hidden Gem',
      geography: 'NYC',
      hooks: [
        { type: 'Secret', text: "A SECRET DESIGNER SHOWROOM IN HELL'S KITCHEN" },
        { type: 'Scale', text: 'THE MOST UNDERRATED VINTAGE STORE IN MANHATTAN' },
        { type: 'Value', text: 'DESIGNER VINTAGE STARTING AT $15' },
      ],
      phases: [
        { phase: 'HOOK', time: '0:00-0:04', visual: 'Walking down side street, camera follows', text: 'SECRET DESIGNER SHOWROOM', vo: "There's a secret designer showroom hiding in Hell's Kitchen." },
        { phase: 'LOCATION', time: '0:04-0:09', visual: 'Enter through unmarked door, reveal interior', text: "HELL'S KITCHEN, NYC", vo: 'No sign out front. You have to know about it. And now you do.' },
        { phase: 'INVENTORY', time: '0:09-0:19', visual: 'Rapid cuts: Gucci, Prada, YSL pieces', text: 'GUCCI / PRADA / YSL', vo: 'Gucci, Prada, Saint Laurent. All authenticated. Prices starting at fifteen dollars.' },
        { phase: 'HERO + CLOSE', time: '0:19-0:26', visual: 'Vintage Gucci bag slow reveal + exterior', text: 'VINTAGE GUCCI — $45', vo: 'This vintage Gucci bag. Forty-five dollars. Retail was twelve hundred. Spot reveal in 3, 2, 1.' },
      ],
      audio: 'Lo-fi, mysterious, discovery vibe',
      viralityScore: { scale: 2, geography: 1, value: 4, total: 7 },
    },
    {
      title: 'Legendary Institution',
      location: 'Lynn, MA',
      likes: '29.3K',
      duration: '30s',
      words: 80,
      template: 'Epic Haul',
      geography: '4 hrs from NYC',
      hooks: [
        { type: 'Scale', text: 'THE MOST LEGENDARY THRIFT STORE IN NEW ENGLAND' },
        { type: 'Secret', text: 'THE THRIFT STORE WORTH THE 4-HOUR DRIVE' },
        { type: 'Value', text: 'FIVE FLOORS OF VINTAGE STARTING AT $1' },
      ],
      phases: [
        { phase: 'HOOK', time: '0:00-0:04', visual: 'Dramatic approach to massive building', text: 'THE MOST LEGENDARY THRIFT IN NEW ENGLAND', vo: 'This is the most legendary thrift store in all of New England.' },
        { phase: 'LOCATION', time: '0:04-0:09', visual: 'Enter, camera tilts up showing floors', text: '5 FLOORS — LYNN, MA', vo: 'Five floors. Starting at one dollar. People drive four hours for this place.' },
        { phase: 'INVENTORY', time: '0:09-0:20', visual: 'Floor-by-floor rapid cuts', text: 'FLOOR 1-5 LABELS', vo: "Floor one, furniture. Floor two, men's. Floor three, women's. Four, records. Five, the vintage vault." },
        { phase: 'HERO + CLOSE', time: '0:20-0:30', visual: 'Vintage varsity jacket + wide exterior', text: 'VINTAGE VARSITY JACKET — $12', vo: "This vintage varsity jacket. Twelve dollars. This is true thrifting. Who's making the drive?" },
      ],
      audio: 'Triumphant hip-hop, epic journey energy',
      viralityScore: { scale: 5, geography: 5, value: 4, total: 14 },
    },
  ];

  const example = workedExamples[activeExample];
  const phaseColors: Record<string, { bg: string; text: string }> = {
    HOOK: { bg: 'bg-violet-50', text: 'text-violet-700' },
    LOCATION: { bg: 'bg-blue-50', text: 'text-blue-700' },
    INVENTORY: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    'HERO + CLOSE': { bg: 'bg-amber-50', text: 'text-amber-700' },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="w-6 h-6 text-violet-600" />
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Content Playbook</h1>
          <p className="text-sm text-zinc-400">Data-backed production bible — pull up before filming or writing any script</p>
        </div>
      </div>

      {/* 1. VIRALITY MATRIX */}
      <CollapsibleSection title="Virality Matrix" icon={TrendingUp} defaultOpen>
        <div className="space-y-4">
          <p className="text-xs text-zinc-500">Score any location on these 3 variables. Total 12+ = high viral potential. Below 8 = needs a stronger angle.</p>

          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-3">
              <p className="text-xs font-bold text-violet-700 mb-1">1. SCALE OF LOCATION</p>
              <p className="text-sm text-zinc-700">Warehouse &gt; Boutique. Massive inventory = visual proof of value.</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[10px]"><span className="text-zinc-500">5 — Warehouse / Mega-store</span><span className="text-violet-600">71.9K likes</span></div>
                <div className="flex justify-between text-[10px]"><span className="text-zinc-500">3 — Multi-floor / Large market</span><span className="text-violet-600">29.3K likes</span></div>
                <div className="flex justify-between text-[10px]"><span className="text-zinc-500">1 — Small boutique / Pop-up</span><span className="text-zinc-400">1-5K likes</span></div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <p className="text-xs font-bold text-emerald-700 mb-1">2. &ldquo;DAY TRIP&rdquo; GEOGRAPHY</p>
              <p className="text-sm text-zinc-700">Out-of-city = 3.5x more engagement. The pilgrimage narrative amplifies shares.</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[10px]"><span className="text-zinc-500">Out-of-city avg:</span><span className="text-emerald-600 font-bold">25,364 likes</span></div>
                <div className="flex justify-between text-[10px]"><span className="text-zinc-500">NYC-only avg:</span><span className="text-zinc-400">7,149 likes</span></div>
                <div className="flex justify-between text-[10px]"><span className="text-zinc-500">Multiplier:</span><span className="text-emerald-600 font-bold">3.5x</span></div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs font-bold text-amber-700 mb-1">3. EXTREME VALUE DISCONNECT</p>
              <p className="text-sm text-zinc-700">Gamified pricing overcomes geography disadvantage for NYC content.</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[10px]"><span className="text-zinc-500">5 — Pay by pound / Fill a bag</span><span className="text-amber-600">14.8K+ likes</span></div>
                <div className="flex justify-between text-[10px]"><span className="text-zinc-500">3 — Everything under $X</span><span className="text-amber-600">10K+ likes</span></div>
                <div className="flex justify-between text-[10px]"><span className="text-zinc-500">1 — Standard retail pricing</span><span className="text-zinc-400">1-5K likes</span></div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3">
            <p className="text-xs font-bold text-zinc-700 mb-2">HOW TO USE: Evaluate any new store before filming</p>
            <p className="text-xs text-zinc-600">Score Scale (1-5) + Geography (1-5) + Value Disconnect (1-5)</p>
            <div className="flex gap-4 mt-2">
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-600">12-15</p>
                <p className="text-[10px] text-zinc-500">Mega-viral potential</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-amber-600">8-11</p>
                <p className="text-[10px] text-zinc-500">Strong, needs angle</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-red-500">3-7</p>
                <p className="text-[10px] text-zinc-500">Find Tier 1 angle</p>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* 2. CONTENT PERFORMANCE TIERS */}
      <CollapsibleSection title="Content Performance Tiers" icon={TrendingUp}>
        <div className="space-y-3">
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-violet-200 text-violet-800">TIER 1</span>
              <span className="text-sm font-semibold text-zinc-800">Mega-Viral (20K-75K+ likes)</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-zinc-600"><span className="font-semibold">Bulk Warehouse</span> — Massive scale + pay-by-pound + out-of-city. 71.9K likes.</p>
              <p className="text-xs text-zinc-600"><span className="font-semibold">Single-Brand Archive</span> — Niche authority + day trip geography. 36.9K likes.</p>
              <p className="text-xs text-zinc-600"><span className="font-semibold">Legendary Institution</span> — Multi-floor scale + pilgrimage narrative. 29.3K likes.</p>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-800">TIER 2</span>
              <span className="text-sm font-semibold text-zinc-800">High-Engagement (10K-19K likes)</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-zinc-600"><span className="font-semibold">Gamified Thrift</span> — Fill-a-bag, everything $10. Value angle overcomes NYC geography.</p>
              <p className="text-xs text-zinc-600"><span className="font-semibold">Definitive Claim</span> — &ldquo;The best X in Y&rdquo; format. Authority hook drives debate + shares.</p>
            </div>
          </div>

          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-200 text-zinc-700">TIER 3</span>
              <span className="text-sm font-semibold text-zinc-800">Baseline (1K-9K likes)</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-zinc-600"><span className="font-semibold">High-End Designer</span> — Niche audience, lower share potential.</p>
              <p className="text-xs text-zinc-600"><span className="font-semibold">Furniture Focus</span> — Limited audience overlap with core demo.</p>
              <p className="text-xs text-zinc-600"><span className="font-semibold">Ticketed Pop-Ups</span> — Paywall limits shareability and &ldquo;I need to go&rdquo; impulse.</p>
            </div>
            <p className="text-[10px] text-violet-600 mt-2 font-semibold">TIP: If a location is Tier 3, find a Tier 1 angle — add Scale, Geography, or Value Disconnect framing.</p>
          </div>
        </div>
      </CollapsibleSection>

      {/* 3. HOOK RANKINGS */}
      <CollapsibleSection title="Hook Rankings" icon={Zap}>
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
            <p className="text-xs text-zinc-600">&ldquo;Behind me...&rdquo; / &ldquo;Secret designer showroom&rdquo; — Highest saves. Anti-gatekeeper psychology.</p>
            <p className="text-[10px] text-violet-600 mt-1">Proof: &ldquo;The BEST designer bags&rdquo; — 542K views, 7.3K saves, 33% skip rate</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TierBadge tier="A" />
              <span className="text-sm font-semibold text-zinc-800">Price Disruption</span>
            </div>
            <p className="text-xs text-zinc-600">&ldquo;Everything is $25&rdquo; — Highest retention. 105% retention on top videos.</p>
            <p className="text-[10px] text-emerald-600 mt-1">Proof: &ldquo;BUY BY THE POUND&rdquo; — 2.8M views (all-time #1)</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TierBadge tier="A" />
              <span className="text-sm font-semibold text-zinc-800">Scale / Quantity</span>
            </div>
            <p className="text-xs text-zinc-600">&ldquo;5 floors of furniture&rdquo; / &ldquo;160 vendors&rdquo; — Strong utility, builds local audience.</p>
            <p className="text-[10px] text-emerald-600 mt-1">Proof: &ldquo;FIVE STORY VINTAGE FURNITURE&rdquo; — 235K views, 4.6K shares</p>
          </div>
        </div>
      </CollapsibleSection>

      {/* 4. COMMENT PSYCHOLOGY */}
      <CollapsibleSection title="Comment Psychology & Algorithm" icon={MessageSquare}>
        <div className="space-y-4">
          <p className="text-xs text-zinc-500">Comments are algorithm signals. Optimize for the right comment types to boost reach.</p>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Optimize For</h3>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <p className="text-sm font-semibold text-zinc-800 mb-1">Logistics Planners</p>
              <p className="text-xs text-zinc-600">&ldquo;Where is this?&rdquo; / &ldquo;What are the hours?&rdquo; — These drive friend-tagging and shares. Put logistics in text overlays so viewers MUST save to reference later.</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <p className="text-sm font-semibold text-zinc-800 mb-1">Anti-Gatekeepers</p>
              <p className="text-xs text-zinc-600">&ldquo;Don&apos;t share this!&rdquo; / &ldquo;Now it&apos;s gonna be packed&rdquo; — Controversy = algorithm signal. These comments increase reach. The debate amplifies the content.</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <p className="text-sm font-semibold text-zinc-800 mb-1">Nostalgics</p>
              <p className="text-xs text-zinc-600">&ldquo;I used to go here as a kid&rdquo; — Emotional engagement produces long comments. Long comments = higher algorithm weight.</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider">Avoid Triggering</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm font-semibold text-zinc-800 mb-1">Overpriced Consensus</p>
              <p className="text-xs text-zinc-600">&ldquo;That&apos;s not a deal&rdquo; / &ldquo;Way overpriced&rdquo; — Kills the value proposition. Avoid by always anchoring to an extreme price or comparing to retail.</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm font-semibold text-zinc-800 mb-1">Quality / Safety Warnings</p>
              <p className="text-xs text-zinc-600">&ldquo;That place is dirty&rdquo; / &ldquo;The clothes smell&rdquo; — Avoid by showing clean, curated items. Lead with quality hero items to set expectations.</p>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* 5. 4-PHASE FRAMEWORK */}
      <CollapsibleSection title="4-Phase Video Framework" icon={Film}>
        <div className="space-y-4">
          <p className="text-xs text-zinc-500">Every video follows this structure. No exceptions. Based on production bible and top-performing content analysis.</p>

          <div className="space-y-2">
            <div className="bg-violet-50 rounded-lg p-3">
              <p className="text-xs font-bold text-violet-700 mb-1">PHASE 1 — HOOK (0:00-0:04)</p>
              <p className="text-sm text-zinc-700">Bold text overlay at frame 0 + dynamic camera movement + core payload delivered</p>
              <p className="text-[10px] text-zinc-500 mt-1">Must include: superlative claim, text overlay, movement. No static openings. No greetings.</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs font-bold text-blue-700 mb-1">PHASE 2 — LOCATION DROP (0:04-0:09)</p>
              <p className="text-sm text-zinc-700">Establish the space, show scale, on-screen store name and neighborhood</p>
              <p className="text-[10px] text-zinc-500 mt-1">Prove the hook visually. Wide shots showing size. Address in text overlay only.</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3">
              <p className="text-xs font-bold text-emerald-700 mb-1">PHASE 3 — INVENTORY MEAT (0:09-0:25)</p>
              <p className="text-sm text-zinc-700">Rapid 1-2 second cuts of hero items, brands, price tags. Stack with &ldquo;The List&rdquo; technique.</p>
              <p className="text-[10px] text-zinc-500 mt-1">This is where value is proven. Every cut = specific item. Use brand overlays. No generic rack scanning.</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-3">
              <p className="text-xs font-bold text-amber-700 mb-1">PHASE 4 — INSIDER TIP (0:25-0:30+)</p>
              <p className="text-sm text-zinc-700">Close with hero item reveal, save-worthy tip, comment bait, or Spot Reveal countdown</p>
              <p className="text-[10px] text-zinc-500 mt-1">Must use one of 6 approved close types. Address overlay on final frame.</p>
            </div>
          </div>

          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3">
            <p className="text-xs font-bold text-zinc-700 mb-1">VOICEOVER RULES</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="text-xs text-zinc-600">Target word count: <span className="font-bold text-violet-600">60-85 words</span></div>
              <div className="text-xs text-zinc-600">Pace: <span className="font-bold text-violet-600">Moderate, steady</span></div>
              <div className="text-xs text-zinc-600">Logistics: <span className="font-bold text-violet-600">Text only, never spoken</span></div>
              <div className="text-xs text-zinc-600">Every sentence: <span className="font-bold text-violet-600">Must have a specific</span></div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* 6. SCRIPT TEMPLATES */}
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
                <p className="text-xs font-bold text-violet-700 mb-1">HOOK (0:00-0:04)</p>
                <p className="text-sm text-zinc-700">Dynamic movement toward camera + bold secret/gatekept text overlay</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs font-bold text-blue-700 mb-1">LOCATION DROP (0:04-0:09)</p>
                <p className="text-sm text-zinc-700">Reveal interior through door/entrance + neighborhood text overlay</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-xs font-bold text-emerald-700 mb-1">INVENTORY MEAT (0:09-0:25)</p>
                <p className="text-sm text-zinc-700">Fast cuts of best items + brand overlays + on-screen checklist</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-xs font-bold text-amber-700 mb-1">INSIDER TIP (0:25-0:30+)</p>
                <p className="text-sm text-zinc-700">Spot Reveal 3-2-1 countdown into location text + comment bait question</p>
              </div>
            </div>
          </div>
        )}

        {activeTemplate === 'epic_haul' && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-500">For wholesale, warehouses, out-of-city trips</p>
            <div className="space-y-2">
              <div className="bg-violet-50 rounded-lg p-3">
                <p className="text-xs font-bold text-violet-700 mb-1">HOOK (0:00-0:04)</p>
                <p className="text-sm text-zinc-700">Travel/approach shot (train, walking out of station) + superlative scale claim</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs font-bold text-blue-700 mb-1">LOCATION DROP (0:04-0:09)</p>
                <p className="text-sm text-zinc-700">Reveal massive interior + pay-by-pound/bulk stats text overlay</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-xs font-bold text-emerald-700 mb-1">INVENTORY MEAT (0:09-0:25)</p>
                <p className="text-sm text-zinc-700">Scale montage — bins, piles, designer tags, price-per-pound reveals</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-xs font-bold text-amber-700 mb-1">INSIDER TIP (0:25-0:30+)</p>
                <p className="text-sm text-zinc-700">Hero find close-up with price reveal + tag-a-friend CTA</p>
              </div>
            </div>
          </div>
        )}

        {activeTemplate === 'curated_list' && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-500">For neighborhood roundups, best-of lists</p>
            <div className="space-y-2">
              <div className="bg-violet-50 rounded-lg p-3">
                <p className="text-xs font-bold text-violet-700 mb-1">HOOK (0:00-0:04)</p>
                <p className="text-sm text-zinc-700">Street corner shot with neighborhood name + definitive claim overlay</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs font-bold text-blue-700 mb-1">LOCATION DROP (0:04-0:09)</p>
                <p className="text-sm text-zinc-700">First stop entrance + map pin text overlay with store name</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-xs font-bold text-emerald-700 mb-1">INVENTORY MEAT (0:09-0:25)</p>
                <p className="text-sm text-zinc-700">Rapid-fire stops with &ldquo;Best for: X&rdquo; overlay at each location</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-xs font-bold text-amber-700 mb-1">INSIDER TIP (0:25-0:30+)</p>
                <p className="text-sm text-zinc-700">Spot Reveal countdown on final stop + &ldquo;Drop your favorite spot&rdquo; CTA</p>
              </div>
            </div>
          </div>
        )}
      </CollapsibleSection>

      {/* 7. WORKED SCRIPT EXAMPLES */}
      <CollapsibleSection title="Gold-Standard Script Examples" icon={FileText}>
        <div className="space-y-4">
          <p className="text-xs text-zinc-500">5 word-for-word scripts from top-performing videos. Use as templates for style, pacing, and structure.</p>

          <div className="flex bg-surface-elevated rounded-lg p-0.5 mb-2">
            {workedExamples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setActiveExample(i)}
                className={`flex-1 px-2 py-2 text-[10px] font-medium rounded-md transition-colors ${
                  activeExample === i ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-zinc-800'
                }`}
              >
                {ex.title}
              </button>
            ))}
          </div>

          {/* Example header */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-zinc-900">{example.title}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-violet-600">{example.likes} likes</span>
                <span className="text-xs text-zinc-400">{example.duration}</span>
                <span className="text-xs text-zinc-400">{example.words} words</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-zinc-500">Location: <span className="font-medium text-zinc-700">{example.location}</span></span>
              <span className="text-zinc-500">Template: <span className="font-medium text-violet-600">{example.template}</span></span>
              <span className="text-zinc-500">Geography: <span className="font-medium text-zinc-700">{example.geography}</span></span>
            </div>

            {/* Virality Score */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-200">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500">Scale:</span>
                <ScoreBar score={example.viralityScore.scale} color="violet" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500">Geography:</span>
                <ScoreBar score={example.viralityScore.geography} color="emerald" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500">Value:</span>
                <ScoreBar score={example.viralityScore.value} color="amber" />
              </div>
              <span className="text-xs font-bold text-violet-600">{example.viralityScore.total}/15</span>
            </div>
          </div>

          {/* Hook options */}
          <div>
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">3 Hook Options</h4>
            <div className="space-y-1.5">
              {example.hooks.map((hook, i) => (
                <div key={i} className="bg-violet-50 border border-violet-200 rounded-lg px-3 py-2 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-violet-600 w-12 shrink-0">{hook.type}</span>
                  <p className="text-xs font-medium text-zinc-800">&ldquo;{hook.text}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>

          {/* Master script table */}
          <div>
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Master Script</h4>
            <div className="space-y-2">
              {example.phases.map((p, i) => {
                const colors = phaseColors[p.phase] || { bg: 'bg-zinc-50', text: 'text-zinc-700' };
                return (
                  <div key={i} className={`${colors.bg} rounded-lg p-3`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-bold ${colors.text}`}>{p.phase}</span>
                      <span className="text-[10px] text-zinc-400">{p.time}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-[10px] text-zinc-400 mb-0.5">Visual</p>
                        <p className="text-zinc-700">{p.visual}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-400 mb-0.5">Text Overlay</p>
                        <p className="font-semibold text-zinc-800">{p.text}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-400 mb-0.5">Voiceover</p>
                        <p className="text-zinc-700 italic">&ldquo;{p.vo}&rdquo;</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audio */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2">
            <span className="text-[10px] text-zinc-400">Audio Vibe: </span>
            <span className="text-xs font-medium text-zinc-700">{example.audio}</span>
          </div>
        </div>
      </CollapsibleSection>

      {/* 8. THE 10 RULES */}
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

      {/* 9. THE KILL LIST */}
      <CollapsibleSection title="The Kill List" icon={Skull}>
        <div className="space-y-2">
          {[
            { killer: 'Spoken logistics in voiceover', detail: 'Addresses, hours, dates spoken aloud = immediate drop-off. Always use text overlays instead.' },
            { killer: 'Owner biography or store history', detail: 'Backstory kills pacing. Viewers want to see items, not hear founding stories.' },
            { killer: 'Static architecture over 1.5 seconds', detail: "Ceilings, building exteriors, flags — anything that isn't product = viewer leaves." },
            { killer: 'Generic rack scanning without hero item', detail: "Panning across racks with no specific callout = dead b-roll. Always name what you're showing." },
            { killer: 'Weak opening (greeting, slow intro, static)', detail: '"Hey guys welcome back" = instant skip. Always start mid-action with bold text at frame 0.' },
            { killer: 'Banned vocabulary', detail: '"Hey guys", "Vibes", "Aesthetic", "Cute", "Obsessed", "Come with me" as opener, "Check this out" as opener.' },
            { killer: 'Voiceover over 85 words', detail: 'Over 85 words forces rushed delivery which breaks the calm authority persona. Cut to 60-85.' },
            { killer: 'Generic sentences without specifics', detail: 'Every sentence must contain a brand name, price, number, or location. Zero generic sentences.' },
          ].map((item, i) => (
            <div key={i} className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
              <p className="text-sm font-medium text-red-800">{item.killer}</p>
              <p className="text-xs text-red-600 mt-0.5">{item.detail}</p>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* 10. BRAND VOICE */}
      <CollapsibleSection title="Brand Voice & Persona" icon={Mic}>
        <div className="space-y-4">
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-3">
            <h3 className="text-xs font-bold text-violet-700 mb-2">CORE PERSONA: &ldquo;Calm but Authoritative Insider&rdquo;</h3>
            <p className="text-sm text-zinc-700">Not a hyperactive hype-beast. Confident authority through calm, measured delivery. Think showing a friend a secret spot before catching the subway.</p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Psychological Triggers</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-zinc-50 rounded-lg p-2">
                <p className="text-xs font-semibold text-zinc-800">Anti-Gatekeeper Ethos</p>
                <p className="text-[10px] text-zinc-500">&ldquo;They don&apos;t want you to know about this&rdquo;</p>
              </div>
              <div className="bg-zinc-50 rounded-lg p-2">
                <p className="text-xs font-semibold text-zinc-800">The Pilgrimage</p>
                <p className="text-[10px] text-zinc-500">Out-of-city = earned secret (3.5x engagement)</p>
              </div>
              <div className="bg-zinc-50 rounded-lg p-2">
                <p className="text-xs font-semibold text-zinc-800">Value Disconnect</p>
                <p className="text-[10px] text-zinc-500">&ldquo;$2,000 jacket for $45&rdquo; — the price gap</p>
              </div>
              <div className="bg-zinc-50 rounded-lg p-2">
                <p className="text-xs font-semibold text-zinc-800">Calm Guide Voice</p>
                <p className="text-[10px] text-zinc-500">Authority through confidence, not volume</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Tone & Energy</h3>
            <div className="flex flex-wrap gap-2">
              {['Authoritative', 'High-energy', 'Fast-paced', 'Unpretentious', 'In-the-know', 'Discerning', 'Direct', 'Urgent'].map(t => (
                <span key={t} className="text-xs bg-violet-50 text-violet-700 px-2 py-1 rounded">{t}</span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">&ldquo;The List&rdquo; Technique</h3>
            <p className="text-xs text-zinc-600 mb-2">Stack items without &ldquo;and&rdquo; until the final item. Creates rhythm and density.</p>
            <div className="bg-zinc-50 rounded-lg p-2">
              <p className="text-xs text-zinc-500 line-through">Ralph Lauren and Burberry and Versace and vintage Levi&apos;s</p>
              <p className="text-xs text-emerald-700 font-medium mt-1">Ralph Lauren, Burberry, Versace, and vintage Levi&apos;s</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <h3 className="text-xs font-bold text-emerald-700 mb-2">APPROVED VOCABULARY</h3>
              <ul className="text-xs text-zinc-600 space-y-1">
                <li>&ldquo;Massive&rdquo;, &ldquo;Insane&rdquo;, &ldquo;Unbelievable&rdquo;</li>
                <li>&ldquo;Hidden gem&rdquo;, &ldquo;Literal dream&rdquo;</li>
                <li>&ldquo;The best [X] in [city]&rdquo;</li>
                <li>&ldquo;Behind me...&rdquo;, &ldquo;True thrifting&rdquo;</li>
                <li>Brand names as proof points</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h3 className="text-xs font-bold text-red-700 mb-2">BANNED VOCABULARY</h3>
              <ul className="text-xs text-red-600 space-y-1">
                <li>&ldquo;Hey guys&rdquo;, &ldquo;Welcome back&rdquo;</li>
                <li>&ldquo;Come with me&rdquo; (as opener)</li>
                <li>&ldquo;Vibes&rdquo;, &ldquo;Aesthetic&rdquo;, &ldquo;Cute&rdquo;</li>
                <li>&ldquo;Obsessed&rdquo;, &ldquo;Check this out&rdquo;</li>
                <li>&ldquo;Like, comment, subscribe&rdquo;</li>
              </ul>
            </div>
          </div>

          <div className="bg-violet-50 border border-violet-200 rounded-lg p-3">
            <h3 className="text-xs font-bold text-violet-700 mb-2">CONTENT PERSONALITY</h3>
            <p className="text-sm text-zinc-700">
              I am the ultimate insider giving viewers the keys to the city&apos;s best hidden gems and true thrift spots. I bypass tourist traps to deliver actionable, high-value maps directly to my audience. I respect my viewers&apos; time by leading with a massive hook, proving value immediately with hero items, and getting out of the way.
            </p>
          </div>
        </div>
      </CollapsibleSection>

      {/* 11. OPTIMAL FORMAT */}
      <CollapsibleSection title="Optimal Format & Virality Checklist" icon={Clock}>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="bg-surface-elevated rounded-lg p-3">
            <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Target Runtime</p>
            <p className="text-xl font-bold text-violet-600">20–36 seconds</p>
            <p className="text-xs text-zinc-500 mt-1">Sweet spot for reels. Viewer leaves at 4-5s without payload.</p>
          </div>

          <div className="bg-surface-elevated rounded-lg p-3">
            <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Voiceover Word Count</p>
            <p className="text-xl font-bold text-violet-600">60–85 words</p>
            <p className="text-xs text-zinc-500 mt-1">Strict max. Over 85 = rushed delivery = broken persona.</p>
          </div>

          <div className="bg-surface-elevated rounded-lg p-3">
            <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Payload Timing</p>
            <p className="text-xl font-bold text-violet-600">By 0:04</p>
            <p className="text-xs text-zinc-500 mt-1">Core value (price, secret, hero item) must land in 4 seconds.</p>
          </div>

          <div className="bg-surface-elevated rounded-lg p-3">
            <p className="text-xs font-bold text-zinc-500 uppercase mb-1">B-Roll Pace</p>
            <p className="text-xl font-bold text-violet-600">1–2s per cut</p>
            <p className="text-xs text-zinc-500 mt-1">Never linger unless it&apos;s a confirmed grail piece.</p>
          </div>
        </div>

        <div className="mt-4 bg-violet-50 border border-violet-200 rounded-lg p-4">
          <h3 className="text-xs font-bold text-violet-700 mb-3">VIRALITY CHECKLIST — Must hit 4/5 before publishing</h3>
          <div className="space-y-2">
            {[
              'Hook delivers payload within first 4 seconds',
              'At least one extreme value claim (price, scale, or geography)',
              'Voiceover is 60-85 words max',
              'No logistics spoken in voiceover (all in text overlays)',
              'Close uses one of the 6 approved close types',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-zinc-700">
                <div className="w-4 h-4 border-2 border-violet-300 rounded" />
                <span>{item}</span>
              </div>
            ))}
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

        <div className="mt-4">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Music Direction</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-2">
              <p className="text-xs font-semibold text-zinc-800">Hidden Gem</p>
              <p className="text-[10px] text-zinc-500">Lo-fi / downtempo hip-hop, mysterious</p>
            </div>
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-2">
              <p className="text-xs font-semibold text-zinc-800">Epic Haul</p>
              <p className="text-[10px] text-zinc-500">Uptempo hip-hop, triumphant energy</p>
            </div>
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-2">
              <p className="text-xs font-semibold text-zinc-800">Curated List</p>
              <p className="text-[10px] text-zinc-500">Jazzy, walking-pace rhythm</p>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* ── Competitor Intelligence ── */}
      <CollapsibleSection title="Competitor Hook Library — 8 Ranked Formulas" icon={Users}>
        <p className="text-xs text-zinc-500 mb-3">From analysis of 23 top vintage creator videos (170K+ combined likes). Ranked by average engagement.</p>
        <div className="space-y-3">
          {[
            { rank: 1, name: 'Authority / Definitive Claim', formula: '"The BEST [X] in [city/region]"', avgLikes: '25.3K', proof: '@bestdressed "THE vintage store in LA" — 42K likes', bestFor: 'Store reveals, location content', tier: 'S' as const },
            { rank: 2, name: 'Secret / Gatekept Location', formula: '"A secret [X] hiding in [neighborhood]"', avgLikes: '22.1K', proof: '@thriftgods "secret warehouse nobody knows about" — 38K likes', bestFor: 'Hidden gems, unmarked stores', tier: 'S' as const },
            { rank: 3, name: 'Scale Superlative', formula: '"The BIGGEST/LARGEST [X] in [region]"', avgLikes: '19.8K', proof: '@codey___ bulk warehouse — 71.9K likes', bestFor: 'Warehouses, multi-floor stores', tier: 'S' as const },
            { rank: 4, name: 'Price Disruption / Extreme Value', formula: '"Everything is $[X]" / "Fill a bag for $[X]"', avgLikes: '16.4K', proof: '@codey___ fill-a-bag $10 — 14.8K likes', bestFor: 'Sales events, gamified pricing', tier: 'A' as const },
            { rank: 5, name: 'Authority Transfer', formula: '"Where [celebrity/brand] shops for vintage"', avgLikes: '14.7K', proof: '@thriftsandfinds "where Bella Hadid thrifts" — 31K likes', bestFor: 'Celebrity-adjacent locations', tier: 'A' as const },
            { rank: 6, name: 'Geographic Pilgrimage', formula: '"I drove [X] hours for this store"', avgLikes: '13.2K', proof: '@codey___ day-trip content 3.5x multiplier', bestFor: 'Out-of-city content, road trips', tier: 'A' as const },
            { rank: 7, name: 'Inventory Superlative', formula: '"[X,000] pieces of [brand] under one roof"', avgLikes: '11.5K', proof: '@codey___ Ralph Lauren archive — 36.9K likes', bestFor: 'Brand archives, specialty stores', tier: 'A' as const },
            { rank: 8, name: 'Personal Superlative', formula: '"The best haul of my LIFE"', avgLikes: '8.9K', proof: 'Multiple creators — emotional hook + reveal', bestFor: 'Haul content, big finds', tier: 'B' as const },
          ].map(h => (
            <div key={h.rank} className="bg-zinc-50 border border-zinc-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-violet-600">#{h.rank}</span>
                <span className="text-xs font-bold text-zinc-800">{h.name}</span>
                <TierBadge tier={h.tier} />
                <span className="ml-auto text-xs font-semibold text-emerald-600">{h.avgLikes} avg</span>
              </div>
              <p className="text-xs text-zinc-700 font-mono bg-white border border-zinc-100 rounded px-2 py-1 mb-1">{h.formula}</p>
              <p className="text-[10px] text-zinc-500">{h.proof}</p>
              <p className="text-[10px] text-violet-600">Best for: {h.bestFor}</p>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Viral Anchor Pieces — What Drives Comments" icon={Target}>
        <p className="text-xs text-zinc-500 mb-3">Every video needs ONE &ldquo;viral anchor piece&rdquo; — the single item the audience talks about. Ranked by comment volume.</p>
        <div className="space-y-2">
          {[
            { rank: 1, type: 'Statement Outerwear', desc: 'Leather jackets, fur coats, vintage varsity — highest engagement across ALL vintage creators', engagement: 'Highest', color: 'bg-violet-100 border-violet-300' },
            { rank: 2, type: 'Designer at Absurd Price', desc: '"Gucci bag for $45" — Value Disconnect trigger, drives saves and shares', engagement: 'Very High', color: 'bg-emerald-100 border-emerald-300' },
            { rank: 3, type: 'Pop Culture Reference', desc: '"This looks like Meg from Hercules" — triggers nostalgic comments and debates', engagement: 'High', color: 'bg-amber-100 border-amber-300' },
            { rank: 4, type: 'Rare/Grail Item', desc: 'Deadstock vintage, unreleased samples, one-of-one pieces — drives "where is this?" comments', engagement: 'High', color: 'bg-amber-100 border-amber-300' },
            { rank: 5, type: 'Controversial Price', desc: '"Is this overpriced?" — pricing debate drives algorithm reach through comment volume', engagement: 'Moderate', color: 'bg-zinc-100 border-zinc-300' },
          ].map(a => (
            <div key={a.rank} className={`${a.color} border rounded-lg p-3`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-zinc-700">#{a.rank}</span>
                <span className="text-xs font-bold text-zinc-800">{a.type}</span>
                <span className="ml-auto text-[10px] font-semibold text-zinc-600">{a.engagement}</span>
              </div>
              <p className="text-xs text-zinc-600">{a.desc}</p>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Save & Comment Driving Formats" icon={MessageSquare}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Top Save-Driving Formats</h3>
            <div className="space-y-2">
              {[
                { format: 'Definitive List + Addresses', desc: '"Top 10 thrift stores in NYC" with full addresses in caption', impact: '#1 save driver' },
                { format: 'Price Comparison Grid', desc: 'Side-by-side retail vs thrift prices on same items', impact: 'High saves' },
                { format: 'Neighborhood Guide', desc: '"Complete thrift guide to [area]" — reference bookmark', impact: 'High saves' },
                { format: 'Seasonal/Event Calendar', desc: '"Every flea market this month" — time-sensitive utility', impact: 'Moderate saves' },
              ].map(f => (
                <div key={f.format} className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-semibold text-zinc-800">{f.format}</p>
                    <span className="ml-auto text-[10px] font-semibold text-blue-600">{f.impact}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Top Comment-Driving Formats</h3>
            <div className="space-y-2">
              {[
                { format: 'Location Withholding', desc: 'Show store but don\'t name it until caption/comments — drives "WHERE IS THIS?"', impact: '#1 comment driver' },
                { format: 'Pricing Controversy', desc: '"This store is overpriced" — debate in comments drives reach', impact: 'High comments' },
                { format: '"Which One?" Close', desc: 'Show 2-3 items, ask audience to pick — simple engagement', impact: 'Moderate comments' },
              ].map(f => (
                <div key={f.format} className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-semibold text-zinc-800">{f.format}</p>
                    <span className="ml-auto text-[10px] font-semibold text-orange-600">{f.impact}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Competitor Script Templates" icon={FileText}>
        <p className="text-xs text-zinc-500 mb-3">5 proven templates adapted from top-performing competitor videos for @codey___&apos;s voice.</p>
        <div className="space-y-3">
          {[
            { id: 'A', name: 'Hidden Treasure Discovery', trigger: 'Secret/unmarked store, unique inventory', hook: '"A SECRET [type] HIDING IN [neighborhood]"', structure: 'Mystery approach → door reveal → inventory explosion → hero item → location withhold', avgPerf: '22K+ likes' },
            { id: 'B', name: 'Road Trip Superlative', trigger: 'Out-of-city location, massive scale', hook: '"THE [superlative] [type] IN [region]"', structure: 'Bold claim → journey/arrival → scale proof → rapid inventory → pilgrimage close', avgPerf: '25K+ likes' },
            { id: 'C', name: 'Definitive NYC List', trigger: 'Multiple locations, guide format', hook: '"THE [number] BEST [type] IN NYC"', structure: 'Promise count → rapid location montage → best item per spot → "save this" CTA', avgPerf: '15K+ likes' },
            { id: 'D', name: 'Authority Transfer', trigger: 'Celebrity/brand connection to a store', hook: '"WHERE [celebrity] SHOPS FOR VINTAGE"', structure: 'Celebrity name drop → store reveal → inventory proof → price shock → credibility close', avgPerf: '14K+ likes' },
            { id: 'E', name: 'Personal Superlative Haul', trigger: 'Exceptional finds, emotional stakes', hook: '"THE BEST HAUL OF MY LIFE"', structure: 'Emotional claim → location context → rapid item reveals → crown jewel → cost reveal', avgPerf: '9K+ likes' },
          ].map(t => (
            <div key={t.id} className="bg-zinc-50 border border-zinc-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded">Template {t.id}</span>
                <span className="text-xs font-bold text-zinc-800">{t.name}</span>
                <span className="ml-auto text-xs font-semibold text-emerald-600">{t.avgPerf}</span>
              </div>
              <p className="text-[10px] text-zinc-500 mb-1"><span className="font-semibold">Trigger:</span> {t.trigger}</p>
              <p className="text-xs text-zinc-700 font-mono bg-white border border-zinc-100 rounded px-2 py-1 mb-1">{t.hook}</p>
              <p className="text-[10px] text-zinc-500"><span className="font-semibold">Structure:</span> {t.structure}</p>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Audio & Hashtag Strategy" icon={Mic}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Audio Strategy by Content Type</h3>
            <div className="space-y-2">
              {[
                { type: 'Hidden Gem / Gatekept', audio: 'Lo-fi hip-hop, mysterious downtempo', energy: 'Low-medium', reason: 'Matches discovery/secret mood' },
                { type: 'Epic Haul / Warehouse', audio: 'Uptempo hip-hop, triumphant beats', energy: 'High', reason: 'Matches scale and excitement' },
                { type: 'Curated List / Tour', audio: 'Jazzy, walking-pace rhythm', energy: 'Medium', reason: 'Guides viewer through locations' },
                { type: 'Price Disruption / Deal', audio: 'Energetic, percussive beats', energy: 'High', reason: 'Urgency and excitement' },
              ].map(a => (
                <div key={a.type} className="bg-zinc-50 border border-zinc-200 rounded-lg p-2">
                  <p className="text-xs font-semibold text-zinc-800">{a.type}</p>
                  <p className="text-[10px] text-zinc-600">{a.audio}</p>
                  <p className="text-[10px] text-violet-600">Energy: {a.energy} — {a.reason}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Hashtag Strategy</h3>
            <div className="space-y-2">
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-2">
                <p className="text-xs font-semibold text-zinc-800">Target: 15-25 per post</p>
                <p className="text-[10px] text-zinc-500">Mix of niche + broad for discovery</p>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-2">
                <p className="text-xs font-semibold text-zinc-800">Tier 1 — Core Niche (5-8)</p>
                <p className="text-[10px] text-zinc-500">#vintagefashion #thrifting #vintageclothing #secondhand #thriftfinds</p>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-2">
                <p className="text-xs font-semibold text-zinc-800">Tier 2 — Location (3-5)</p>
                <p className="text-[10px] text-zinc-500">#nycvintage #nycthrift #brooklynthrift #[neighborhood] #[storename]</p>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-2">
                <p className="text-xs font-semibold text-zinc-800">Tier 3 — Broad Discovery (5-8)</p>
                <p className="text-[10px] text-zinc-500">#mensfashion #ootd #streetstyle #sustainablefashion #fashiontiktok</p>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-2">
                <p className="text-xs font-semibold text-zinc-800">Tier 4 — Trending/Seasonal (2-4)</p>
                <p className="text-[10px] text-zinc-500">#springfashion #fleamarket #weekendfinds — rotate based on timing</p>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Competitive Advantages & Untapped Markets" icon={TrendingUp}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Your Competitive Edge</h3>
            <div className="space-y-2">
              {[
                { edge: 'Scale Content Access', desc: 'Warehouses and large events that smaller creators can\'t access or travel to' },
                { edge: 'Data-Backed Hook Formula', desc: 'Superlatives backed by real performance data — not guessing' },
                { edge: 'NYC Insider Authority', desc: 'Deep specific store knowledge that tourists and new creators lack' },
                { edge: 'Production Quality', desc: 'Higher production value than most vintage competitors' },
                { edge: 'Male Vintage Fashion', desc: 'Fewer male vintage creators = differentiation opportunity in a growing space' },
              ].map(e => (
                <div key={e.edge} className="bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                  <p className="text-xs font-semibold text-zinc-800">{e.edge}</p>
                  <p className="text-[10px] text-zinc-500">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Untapped Geographic Markets</h3>
            <p className="text-[10px] text-zinc-500 mb-2">First-mover advantage: being first to cover a region creates instant authority.</p>
            <div className="space-y-2">
              {[
                { region: 'New Jersey', note: 'Multiple warehouses and bulk spots, 30-60 min from NYC' },
                { region: 'Connecticut', note: 'Estate sale goldmine, wealthy suburbs = designer finds' },
                { region: 'Upstate New York', note: 'Day-trip narrative (3.5x engagement), barn sales, archives' },
                { region: 'Long Island', note: 'Consignment shops, estate sales, untapped by NYC creators' },
                { region: 'Philadelphia', note: 'Growing vintage scene, 90 min from NYC, bulk warehouses' },
              ].map(r => (
                <div key={r.region} className="bg-violet-50 border border-violet-200 rounded-lg p-2">
                  <p className="text-xs font-semibold text-zinc-800">{r.region}</p>
                  <p className="text-[10px] text-zinc-500">{r.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}
