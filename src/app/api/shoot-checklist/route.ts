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

--- PERFORMANCE RULES ---
- Lead with quantifiable superlative by frame 0
- Deliver core payload (price, secret, hero item) by 0:04
- All logistics in on-screen text overlays ONLY, never spoken
- Show hero item in first 2 seconds
- B-roll cuts every 1-2 seconds
- Spot Reveal 3-2-1 countdown builds watch time
- Number anchors for scale
- On-screen checklists drive saves
- Never: spoken logistics, owner backstory, static architecture over 1.5s, generic rack scanning, slow intros

SCRIPT TEMPLATES:
1. HIDDEN GEM: Dynamic movement → fast item cuts → Spot Reveal countdown → Comment bait
2. EPIC HAUL: Travel shot → scale montage → hero find close-up → Tag-a-friend
3. CURATED LIST: Street corner shot → rapid-fire stops → Spot Reveal → Comment CTA

---

Generate a complete pre-shoot production checklist for this creator.

Store/Location: "${storeName}"
Content Type: ${contentType}
Hero Item: "${heroItem}"
Location: "${location}"
${pricePoint ? `Price Point: "${pricePoint}"` : ''}

Create a checklist tailored to the ${contentType} template and this specific location. Every instruction should be specific to this shoot — no generic advice.

Respond with a JSON object:
{
  "template": "${contentType}",
  "hookShot": {
    "description": "Exactly what to film in first 3 seconds",
    "cameraMove": "Specific camera movement (walk-toward, dramatic zoom, pan, etc.)",
    "textOverlay": "The bold text overlay to prep for frame 0"
  },
  "payloadShot": {
    "description": "What to show by 0:04 to deliver core value",
    "timing": "0:02-0:04"
  },
  "heroItemShot": {
    "description": "How to frame and reveal ${heroItem}"
  },
  "bRollList": [
    { "shot": "Specific shot description", "maxDuration": "1-2s" }
  ],
  "textOverlaysToPrep": ["All on-screen text to design before editing"],
  "closeShot": {
    "type": "comment_bait | spot_reveal | fast_directive | strong_visual | tag_a_friend",
    "description": "Exactly how to end the video"
  },
  "thingsToAvoid": ["Specific performance killers relevant to this shoot"],
  "targetRuntime": "12-18s"
}

Respond ONLY with the JSON object, no other text.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2500,
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
