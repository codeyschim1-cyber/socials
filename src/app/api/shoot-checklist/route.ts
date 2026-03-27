import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { CREATOR_VOICE_PROFILE } from '@/lib/creator-context';

export async function POST(req: NextRequest) {
  const { apiKey, storeName, contentType, heroItem, location, pricePoint } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is required' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const prompt = `${CREATOR_VOICE_PROFILE}

--- PRODUCTION BIBLE RULES ---

4-PHASE FRAMEWORK (every video follows this):
Phase 1 — HOOK (0:00-0:04): Bold text overlay at frame 0 + dynamic movement + core payload delivered
Phase 2 — LOCATION DROP (0:04-0:09): Establish the space, show scale, on-screen store name/neighborhood
Phase 3 — INVENTORY MEAT (0:09-0:25): Rapid 1-2 second cuts of hero items, brands, price tags. Stack with "The List" technique.
Phase 4 — INSIDER TIP (0:25-0:30+): Close with save-worthy tip, comment bait, or Spot Reveal countdown

VOICEOVER RULES:
- 60-85 words total. Moderate steady pace.
- Voiceover sells the vibe. Text overlays handle ALL logistics.
- Every sentence must contain a specific: item, price, brand, or number.
- Use "The List" technique: stack items without "and" until the final item.

TEXT OVERLAY STRATEGY:
- Frame 0: Hook claim in bold caps
- Location/address: On-screen only, never spoken
- Checklist format: "Best for: X, Y, Z" drives saves
- Price tags: Show prices on hero items
- CTA: Final frame text matches close type

MUSIC DIRECTION:
- Hidden Gem / Gatekept: Lo-fi or downtempo hip-hop, mysterious vibe
- Epic Haul / Warehouse: Uptempo hip-hop, triumphant energy
- Curated List / Tour: Jazzy, walking-pace rhythm

VIRALITY CHECKLIST (aim for 5/5):
□ Hook delivers payload within first 4 seconds
□ At least one extreme value claim (price, scale, or geography)
□ Voiceover is 60-85 words max
□ No logistics spoken in voiceover (all in text overlays)
□ Close uses an approved close type

TEMPLATE STRUCTURES:
1. HIDDEN GEM: Dynamic approach → fast item cuts + checklist → Spot Reveal 3-2-1 → Comment bait
2. EPIC HAUL: Travel/scale shot → bins/bulk montage → hero find close-up → Tag-a-friend
3. CURATED LIST: Street corner → rapid-fire stops with map pins → Spot Reveal → Comment CTA

---

Generate a complete pre-shoot production checklist for this creator. Every instruction must be SPECIFIC to this shoot — no generic advice.

Store/Location: "${storeName}"
Content Type: ${contentType}
Hero Item: "${heroItem}"
Location: "${location}"
${pricePoint ? `Price Point: "${pricePoint}"` : ''}

Respond with a JSON object:
{
  "template": "${contentType}",
  "viralityScore": {
    "scale": 1-5,
    "geography": 1-5,
    "valueDisconnect": 1-5,
    "total": 3-15,
    "prediction": "Tier 1 / Tier 2 / Tier 3"
  },
  "hookShot": {
    "phase": "Phase 1 — HOOK (0:00-0:04)",
    "description": "Exactly what to film in first 4 seconds",
    "cameraMove": "Specific camera movement (walk-toward, dramatic zoom, pan, etc.)",
    "textOverlay": "The bold text overlay to prep for frame 0 — IN CAPS",
    "voiceoverLine": "The exact opening line to deliver"
  },
  "locationDrop": {
    "phase": "Phase 2 — LOCATION DROP (0:04-0:09)",
    "description": "How to establish the space and show scale",
    "textOverlay": "Store name / neighborhood overlay text",
    "voiceoverLine": "The location context line"
  },
  "inventoryMeat": {
    "phase": "Phase 3 — INVENTORY MEAT (0:09-0:25)",
    "shots": [
      { "shot": "Specific item/area to film", "maxDuration": "1-2s", "textOverlay": "Brand/price overlay or null" }
    ],
    "voiceoverLine": "The inventory stacking line using The List technique"
  },
  "heroItemShot": {
    "description": "How to frame and reveal ${heroItem}",
    "timing": "When in the video this appears",
    "textOverlay": "Price/brand overlay for hero item"
  },
  "closeShot": {
    "phase": "Phase 4 — INSIDER TIP (0:25-0:30+)",
    "type": "comment_bait | spot_reveal | fast_directive | strong_visual | tag_a_friend | save_prompt",
    "description": "Exactly how to end the video",
    "voiceoverLine": "The exact close line",
    "textOverlay": "📍 address or CTA text"
  },
  "textOverlaysToPrep": ["All on-screen text to design before editing — list each one"],
  "audioVibe": "Specific music direction for this content type",
  "thingsToAvoid": ["Specific performance killers relevant to THIS shoot"],
  "viralityChecklist": ["5 items to check before publishing"],
  "targetRuntime": "Xs",
  "targetWordCount": "60-85 words"
}

Respond ONLY with the JSON object, no other text.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to generate checklist';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
