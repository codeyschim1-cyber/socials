import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { CREATOR_VOICE_PROFILE } from '@/lib/creator-context';

export async function POST(req: NextRequest) {
  const { apiKey, title, description, platform, category, niche, creatorBio } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is required' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const prompt = `${CREATOR_VOICE_PROFILE}

--- PERFORMANCE RULES (DATA-BACKED) ---

WHAT ALWAYS WORKS — must incorporate all relevant ones:
- Lead with a quantifiable superlative by frame 0 (triggers FOMO and debate)
- Deliver core payload (price, secret, hero item) by 0:04
- All logistics (address, hours, dates) go in on-screen text overlays ONLY, never spoken in voiceover — voiceover sells the vibe, text handles the map
- Show a hero item in first 2 seconds to immediately prove the hook claim
- Use on-screen checklists ("Best for: X, Y, Z") to drive saves
- Number anchors for scale ("3 floors", "160 vendors", "pay by the pound")
- Level-based milestones for large locations (gamifies watch time)
- "True vs Aesthetic" framing to build trust against overpriced boutiques
- Comment-bait close ("Which one would you pick?") to spike comments
- Out-of-city gatekeeping paradoxically increases shares (feels like a secret)
- "Free to unlock luxury" framing for high-end or intimidating venues
- Mini narrative goal stated in first 5 seconds ("I'm hunting for a 70s leather jacket — let's see if this spot has it")
- B-roll cuts every 1-2 seconds during rack/item sections
- Spot Reveal 3-2-1 countdown builds watch time via anticipation

WHAT KILLS PERFORMANCE — never include:
- Spoken logistics or addresses in voiceover
- Owner biography or store history backstory
- Static architecture, ceilings, flags, or building exteriors over 1.5 seconds
- Generic rack scanning without a specific hero item visible
- Text lists of 10+ items while camera is rapidly moving
- Any opening that isn't mid-action
- Lingering on a single item unless it's a confirmed grail piece
- Pacing lulls in b-roll sections

OPTIMAL FORMAT:
- Length: 12-18 seconds (flag if script would run longer)
- Structure: Hook (0-3s) → Build/Value (3-10s) → Reveal/Climax (10-15s) → CTA
- Average viewer leaves at 4-5 seconds if payload hasn't been delivered

HOOK RANKING (use highest tier possible):
1. Authority/Fight Me: "The best vintage store in the country" — highest reach/shares
2. Secret/Gatekept: "Behind me" / "Secret designer showroom" — highest saves
3. Price Disruption: "Everything is $25" — highest retention (105% on top videos)
4. Scale/Quantity: "5 floors of furniture" — strong utility, builds local audience

SCRIPT TEMPLATES — pick the most relevant one and label it in the response:

TEMPLATE 1 — HIDDEN GEM (for unique stores, secret spots, lesser-known markets):
Hook: Dynamic movement toward camera + bold secret/gatekept text overlay
Build: Fast cuts of best items + on-screen checklist of what store is known for
Climax: Spot Reveal 3-2-1 countdown into store name and location text
Close: Comment bait question or abrupt strong visual

TEMPLATE 2 — EPIC HAUL / JOURNEY (for wholesale, warehouses, out-of-city trips):
Hook: Travel shot (train, walking out of station) + superlative scale claim
Build: Scale montage — bins, piles, bulk stats, pay-by-pound text overlay
Climax: Hero find close-up with price reveal
Close: Tag-a-friend CTA ("Who are you bringing here?")

TEMPLATE 3 — CURATED LIST / TOUR (for neighborhood roundups, best-of lists):
Hook: Street corner shot with neighborhood name + "come with me" invite
Build: Rapid-fire stops with map pin text overlays ("Best for: X")
Climax: Spot Reveal countdown on the final stop
Close: "Drop your favorite spot in the comments" CTA

---

You are a content production planner for this creator. Create a complete production plan for the following content idea. Apply ALL relevant performance rules above.

Content Idea: "${title}"
Description: "${description}"
Platform: ${platform || 'All platforms'}
Category: ${category || 'evergreen'}
Creator niche: ${niche || 'vintage fashion, thrifting, menswear'}
${creatorBio ? `Creator bio: ${creatorBio}` : ''}

Create a detailed production plan with these sections:

1. TEMPLATE SELECTED: Which of the 3 templates fits best and why

2. SHOT LIST: 5-8 shots with specific descriptions and durations (max 2s each for b-roll). Include camera movements and text overlay notes. Flag any shot that risks a performance killer.

3. HOOKS: 5 different hook options ranked by tier (S/A/B/C):
   - "authority" — bold superlative claim
   - "gatekept" — secret/hidden location reveal
   - "price_disruption" — shocking price point
   - "scale" — impressive numbers/size
   - "pattern_interrupt" — unexpected visual or statement

4. SCRIPT: A full script (12-18 seconds target) following the selected template structure. Include:
   - Timing cues for each section
   - Text overlay instructions (separate from voiceover)
   - Camera movement notes
   - The close type used

Respond with a JSON object:
{
  "templateSelected": "hidden_gem | epic_haul | curated_list",
  "templateReason": "Why this template fits",
  "shotList": [
    { "shot": "Shot name", "description": "What to film", "duration": "1-2s", "cameraMove": "pan/zoom/walk", "textOverlay": "text to show or null" }
  ],
  "hooks": [
    { "type": "authority | gatekept | price_disruption | scale | pattern_interrupt", "tier": "S | A | B | C", "text": "the hook text" }
  ],
  "script": "The full script with timing cues, text overlay markers [TEXT: ...], and camera notes [CAM: ...]",
  "closeType": "comment_bait | spot_reveal | fast_directive | strong_visual | tag_a_friend",
  "estimatedLength": "Xs",
  "performanceNotes": ["Note about which rules were applied"]
}

Respond ONLY with the JSON object, no other text.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
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
    const message = error instanceof Error ? error.message : 'Failed to generate deep dive';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
