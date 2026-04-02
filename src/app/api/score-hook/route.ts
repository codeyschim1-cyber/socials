import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { CREATOR_VOICE_PROFILE } from '@/lib/creator-context';
import { COMPETITOR_HOOK_LIBRARY } from '@/lib/competitor-intelligence';

export async function POST(req: NextRequest) {
  const { apiKey, hookText, contentType } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is required' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const prompt = `${CREATOR_VOICE_PROFILE}

${COMPETITOR_HOOK_LIBRARY}

You are a content performance analyst for this creator. Score the following hook using the data-backed Virality Matrix, Hook Ranking System, AND the competitor-proven hook library above.

Hook text: "${hookText}"
${contentType ? `Content type: ${contentType}` : ''}

--- HOOK RANKING SYSTEM (from performance data) ---

S-TIER (20K-75K+ likes potential):
1. Authority / "Fight Me": "The best vintage store in the country" — Highest reach and shares. Triggers debate and FOMO.
   Proof: "GIANT bulk thrift" — 1.7M views, 63K shares, 4,083 follows
2. Secret / Gatekept: "Behind me..." / "Secret designer showroom" — Highest saves. Anti-gatekeeper psychology.
   Proof: "The BEST designer bags" — 542K views, 7.3K saves, 33% skip rate

A-TIER (10K-19K likes potential):
3. Price Disruption: "Everything is $25" / "Fill a bag for $10" — Highest retention. 105% on top videos.
   Proof: "BUY BY THE POUND" — 2.8M views (all-time #1)
4. Scale / Quantity: "5 floors of furniture" / "160 vendors" — Strong utility, builds local audience.
   Proof: "FIVE STORY VINTAGE FURNITURE" — 235K views, 4.6K shares

B-TIER (5K-9K likes):
5. Pattern Interrupt / Bold Statement / Question — Works but lower ceiling without S/A-tier elements.

C-TIER (under 5K):
6. Story / Relatable / Location Reveal without superlative — Low hook strength, needs upgrade.

--- VIRALITY MATRIX SCORING ---

When scoring, also evaluate the IMPLIED content behind the hook on 3 axes:
1. SCALE (1-5): Does the hook imply a massive location? Warehouse=5, boutique=1
2. GEOGRAPHY (1-5): Does it suggest a "pilgrimage"? Out-of-city=5, common NYC spot=1
3. VALUE DISCONNECT (1-5): Does it have extreme pricing? Pay-by-pound=5, standard retail=1

CONTENT PERFORMANCE TIERS:
- Tier 1 MEGA-VIRAL (20K-75K+): Bulk Warehouse, Single-Brand Archive, Legendary Institution
- Tier 2 HIGH-ENGAGEMENT (10K-19K): Gamified Thrift, Definitive Claim
- Tier 3 BASELINE (1K-9K): High-End Designer, Furniture Focus, Ticketed Pop-Ups

--- VOCABULARY CHECK ---
APPROVED: "Massive", "Insane", "Unbelievable", "Hidden gem", "Literal dream", "The best [X] in [city]"
BANNED: "Hey guys", "Come with me", "Check this out", "Vibes", "Aesthetic", "Cute", "Obsessed"

Analyze this hook and respond with a JSON object:
{
  "hookType": "authority | gatekept | price_disruption | scale | pattern_interrupt | bold_statement | question | story | relatable | location_reveal",
  "tier": "S | A | B | C",
  "tierReason": "One sentence explaining the tier assignment with specific performance data reference",
  "viralityMatrix": {
    "scale": 1-5,
    "geography": 1-5,
    "valueDisconnect": 1-5,
    "total": 3-15,
    "predictedTier": "Tier 1 / Tier 2 / Tier 3"
  },
  "psychologicalTriggers": ["Which triggers this hook activates: Anti-Gatekeeper, Pilgrimage, Value Disconnect, Calm Guide"],
  "vocabularyCheck": {
    "usesApproved": true/false,
    "usesBanned": true/false,
    "bannedWordsFound": ["list any banned words found"]
  },
  "weaknesses": ["specific weakness 1", "specific weakness 2"],
  "rewrite": "One specific rewrite that upgrades this hook to S-tier, using the creator's proven formula",
  "rewriteExplanation": "Why the rewrite would perform better, referencing specific performance data"
}

Respond ONLY with the JSON object, no other text.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = text.replace(/```(?:json)?\s*/gi, '').replace(/```\s*/g, '');
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    let jsonStr = jsonMatch[0].replace(/,\s*([}\]])/g, '$1');
    let result;
    try { result = JSON.parse(jsonStr); } catch {
      jsonStr = jsonStr.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
      result = JSON.parse(jsonStr);
    }
    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to score hook';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
