import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { CREATOR_VOICE_PROFILE, WORKED_SCRIPT_EXAMPLES } from '@/lib/creator-context';
import { COMPETITOR_HOOK_LIBRARY, COMPETITOR_SCRIPT_TEMPLATES } from '@/lib/competitor-intelligence';

async function fetchLinkContent(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CreatorHub/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    clearTimeout(timeout);
    if (!res.ok) return `[Failed to fetch ${url}: ${res.status}]`;
    const html = await res.text();
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#\d+;/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    return text.slice(0, 3000);
  } catch {
    return `[Failed to fetch ${url}: request timed out or blocked]`;
  }
}

export async function POST(req: NextRequest) {
  const { apiKey, title, description, platform, category, niche, creatorBio, referenceLinks } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is required' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  // Fetch reference links if provided
  let referenceLinkContext = '';
  if (referenceLinks && Array.isArray(referenceLinks) && referenceLinks.length > 0) {
    const linkResults = await Promise.all(
      referenceLinks.slice(0, 5).map(async (url: string) => {
        const content = await fetchLinkContent(url);
        return { url, content };
      })
    );
    referenceLinkContext = `--- STORE / LOCATION RESEARCH (from reference links) ---
CRITICAL: Use ONLY this information for factual details about this location. Do NOT fabricate details like number of floors, neighborhood, address, or what they sell. If info is not here, omit it.

${linkResults.map((r, i) => `[Source ${i + 1}: ${r.url}]\n${r.content}`).join('\n\n')}
--- END STORE RESEARCH ---`;
  }

  const prompt = `${CREATOR_VOICE_PROFILE}

--- MASTER SCRIPT GENERATOR ---

You are a viral content script generator for this creator. You generate production-ready scripts following a strict 4-phase framework proven by data.

${WORKED_SCRIPT_EXAMPLES}

${COMPETITOR_HOOK_LIBRARY}

${COMPETITOR_SCRIPT_TEMPLATES}

--- STRICT CONSTRAINTS ---

1. VOICEOVER WORD COUNT: 60-85 words. NO EXCEPTIONS. Count every word. If over 85, cut. If under 60, add specifics.
2. VOICEOVER PACE: Moderate and steady. NOT rushed breathless delivery. Confident authority.
3. NO LOGISTICS IN VOICEOVER: Addresses, hours, dates, parking info = TEXT OVERLAY ONLY. Never spoken.
4. SPECIFICITY RULE: Every single sentence must contain at least one specific: a brand name, a price, a number, or a location name. Zero generic sentences allowed.
5. "THE LIST" TECHNIQUE: When listing items, stack WITHOUT "and" until the final item. Example: "Ralph Lauren, Burberry, Versace, and vintage Levi's"
6. VOCABULARY — APPROVED: "Massive", "Insane", "Unbelievable", "Hidden gem", "Literal dream", "True thrifting", "The best [X] in [city]"
7. VOCABULARY — BANNED: "Hey guys", "Come with me", "Check this out" (as opener), "Vibes", "Aesthetic", "Cute", "Obsessed", "Make sure to like"
8. 4-PHASE STRUCTURE (mandatory):
   Phase 1 — HOOK (0:00-0:04): Bold text overlay + dynamic movement + core payload
   Phase 2 — LOCATION DROP (0:04-0:09): Establish space, show scale, store name overlay
   Phase 3 — INVENTORY MEAT (0:09-0:25): Rapid 1-2s cuts of items, brands, prices. "The List" technique. Prove the hook.
   Phase 4 — INSIDER TIP (0:25-0:30+): Save-worthy tip, comment bait, or Spot Reveal

--- VIRALITY MATRIX (score before writing) ---
Evaluate the content idea on 3 variables (1-5 each):
1. SCALE: How visually massive is the location? (5=warehouse, 1=small boutique)
2. GEOGRAPHY: Is it a "day trip" / pilgrimage? (5=hours away, 1=common NYC spot)
3. VALUE DISCONNECT: How extreme is the price gap? (5=pay by pound, 1=standard retail)
Total 12+ = high viral potential. Below 8 = needs a stronger angle.

--- CONTENT PERFORMANCE TIERS ---
Tier 1 MEGA-VIRAL (20K-75K+ likes): Bulk Warehouse, Single-Brand Archive, Legendary Institution
Tier 2 HIGH-ENGAGEMENT (10K-19K likes): Gamified Thrift, Definitive Claim
Tier 3 BASELINE (1K-9K likes): High-End Designer, Furniture Focus, Ticketed Pop-Ups
→ Always aim for Tier 1 framing. If naturally Tier 3, find a Tier 1 angle.

---

Content Idea: "${title}"
Description: "${description}"
Platform: ${platform || 'Instagram Reels'}
Category: ${category || 'evergreen'}
Creator niche: ${niche || 'vintage fashion, thrifting, menswear'}
${creatorBio ? `Creator bio: ${creatorBio}` : ''}
${referenceLinkContext}

Generate a COMPLETE production-ready script package. Follow the worked examples above for style and format.

REQUIRED OUTPUT (JSON):
{
  "viralityScore": {
    "scale": 1-5,
    "geography": 1-5,
    "valueDisconnect": 1-5,
    "total": 3-15,
    "prediction": "Tier 1 / Tier 2 / Tier 3",
    "angleAdvice": "How to push this toward Tier 1 if it isn't already"
  },
  "templateSelected": "hidden_gem | epic_haul | curated_list",
  "templateReason": "Why this template fits",
  "hookOptions": [
    { "type": "scale_superlative", "text": "THE HOOK TEXT IN CAPS", "tier": "S | A | B" },
    { "type": "value_price", "text": "THE HOOK TEXT IN CAPS", "tier": "S | A | B" },
    { "type": "secret_hidden", "text": "THE HOOK TEXT IN CAPS", "tier": "S | A | B" }
  ],
  "masterScript": [
    {
      "phase": "Phase 1 — HOOK",
      "time": "0:00-0:04",
      "visualDirection": "Exactly what to film",
      "textOverlay": "BOLD TEXT FOR SCREEN",
      "voiceover": "Word-for-word voiceover line"
    },
    {
      "phase": "Phase 2 — LOCATION DROP",
      "time": "0:04-0:09",
      "visualDirection": "Exactly what to film",
      "textOverlay": "TEXT FOR SCREEN",
      "voiceover": "Word-for-word voiceover line"
    },
    {
      "phase": "Phase 3 — INVENTORY MEAT",
      "time": "0:09-0:25",
      "visualDirection": "Exactly what to film (rapid cuts)",
      "textOverlay": "BRAND/PRICE OVERLAYS",
      "voiceover": "Word-for-word voiceover using The List technique"
    },
    {
      "phase": "Phase 4 — INSIDER TIP",
      "time": "0:25-0:30+",
      "visualDirection": "Final shots",
      "textOverlay": "📍 [ADDRESS IN TEXT ONLY]",
      "voiceover": "Close line"
    }
  ],
  "voiceoverWordCount": 60-85,
  "closeType": "comment_bait | spot_reveal | fast_directive | strong_visual | tag_a_friend | save_prompt",
  "audioVibe": "Genre and energy description for music selection",
  "instagramCaption": "Hook line.\\n\\nLocation + inventory tease.\\n\\nInsider tip or detail.\\n\\n·\\n·\\n·\\n\\n#hashtag1 #hashtag2 ... (15-25 relevant hashtags)",
  "estimatedLength": "Xs",
  "viralityChecklist": {
    "hookPayloadBy4s": true/false,
    "extremeValueClaim": true/false,
    "voiceoverUnder85Words": true/false,
    "noLogisticsInVO": true/false,
    "approvedCloseType": true/false,
    "passCount": "X/5"
  },
  "performanceNotes": ["Specific notes about which rules and triggers were applied"]
}

Respond ONLY with the JSON object, no other text.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    // Attempt to fix common JSON issues before parsing
    let jsonStr = jsonMatch[0];
    // Fix unquoted property values like true/false that might be malformed
    jsonStr = jsonStr.replace(/:\s*'([^']*)'/g, ': "$1"');
    // Fix trailing commas before } or ]
    jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1');

    let raw;
    try {
      raw = JSON.parse(jsonStr);
    } catch {
      // If still fails, try more aggressive cleanup
      jsonStr = jsonStr.replace(/[\x00-\x1F\x7F]/g, (ch) =>
        ch === '\n' ? '\\n' : ch === '\t' ? '\\t' : ch === '\r' ? '\\r' : ''
      );
      raw = JSON.parse(jsonStr);
    }

    // Transform the Master Script Generator output into the IdeaDeepDive shape
    const shotList = Array.isArray(raw.masterScript)
      ? raw.masterScript.map((phase: { phase?: string; time?: string; visualDirection?: string; textOverlay?: string; voiceover?: string }) => ({
          shot: phase.phase || 'Shot',
          description: [
            phase.visualDirection,
            phase.textOverlay ? `Text overlay: ${phase.textOverlay}` : '',
            phase.voiceover ? `VO: "${phase.voiceover}"` : '',
          ].filter(Boolean).join('\n'),
          duration: phase.time || '',
        }))
      : raw.shotList || [];

    const hooks = Array.isArray(raw.hookOptions)
      ? raw.hookOptions.map((h: { type?: string; text?: string; tier?: string }) => ({
          type: h.type || 'hook',
          text: h.text || '',
          tier: h.tier,
        }))
      : raw.hooks || [];

    const script = typeof raw.script === 'string'
      ? raw.script
      : Array.isArray(raw.masterScript)
        ? raw.masterScript.map((p: { phase?: string; time?: string; voiceover?: string }) =>
            `[${p.time || ''}] ${p.voiceover || ''}`
          ).join('\n\n')
        : '';

    const result = {
      shotList,
      hooks,
      script,
      viralityScore: raw.viralityScore,
      templateSelected: raw.templateSelected,
      templateReason: raw.templateReason,
      voiceoverWordCount: raw.voiceoverWordCount,
      closeType: raw.closeType,
      audioVibe: raw.audioVibe,
      instagramCaption: raw.instagramCaption,
      estimatedLength: raw.estimatedLength,
      viralityChecklist: raw.viralityChecklist,
      performanceNotes: raw.performanceNotes,
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate deep dive';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
