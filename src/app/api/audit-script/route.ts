import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { CREATOR_VOICE_PROFILE } from '@/lib/creator-context';

export async function POST(req: NextRequest) {
  const { apiKey, scriptText, estimatedLengthSeconds } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is required' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const prompt = `${CREATOR_VOICE_PROFILE}

You are a content performance auditor for this creator. Audit the following script against their COMPLETE data-backed performance system. Be strict — this creator's audience leaves at 4-5 seconds if the payload isn't delivered.

Script:
"""
${scriptText}
"""
${estimatedLengthSeconds ? `Estimated length: ${estimatedLengthSeconds} seconds` : ''}

--- VIRALITY CHECKLIST (must pass 4/5 to publish) ---
□ Hook delivers payload within first 4 seconds
□ At least one extreme value claim (price, scale, or geography)
□ Voiceover is 60-85 words max
□ No logistics spoken in voiceover (all in text overlays)
□ Close uses one of the 6 approved close types (comment bait, spot reveal, fast directive, strong visual, save prompt, tag a friend)

--- 4-PHASE STRUCTURE CHECK ---
Phase 1 — HOOK (0:00-0:04): Bold text overlay + dynamic movement + payload delivered?
Phase 2 — LOCATION DROP (0:04-0:09): Space established, scale shown, store name overlay?
Phase 3 — INVENTORY MEAT (0:09-0:25): Rapid 1-2s cuts? "The List" technique used? Specific items/brands/prices?
Phase 4 — INSIDER TIP (0:25-0:30+): Save-worthy tip, comment bait, or Spot Reveal?

--- FAILURE CHECKS (each costs points) ---
- Spoken logistics: addresses, hours, dates, directions in voiceover (-15 pts)
- History/backstory: owner biography, store founding story (-10 pts)
- Missing hero item: no specific product in first 2 seconds (-10 pts)
- Late payload: core value prop not delivered by 0:04 (-15 pts)
- Overtime: voiceover over 85 words (-10 pts)
- Weak opening: starts with greeting, slow intro, static scene (-15 pts)
- Dead b-roll: generic rack descriptions without specific items (-5 pts)
- Missing close: no approved close type at end (-10 pts)
- Overcrowded text: 10+ items listed while camera moves (-5 pts)
- Banned vocabulary: "Hey guys", "Vibes", "Aesthetic", "Cute", "Come with me" as opener (-10 pts)
- No specificity: sentence without a brand name, price, number, or location (-5 pts per instance)
- Missing "The List" technique in inventory section (-5 pts)

--- PASS CHECKS (each earns points) ---
- Superlative hook present (+15 pts)
- Payload delivered by 0:04 (+15 pts)
- Hero item named in first 2 seconds (+10 pts)
- Logistics in text overlay only (+10 pts)
- On-screen checklist present (+5 pts)
- Number anchor used (+5 pts)
- "The List" technique (stacking items without "and" until final) (+5 pts)
- Strong approved close type identified (+10 pts)
- Psychological trigger activated (Anti-Gatekeeper, Pilgrimage, Value Disconnect, Calm Guide) (+10 pts)
- Voiceover 60-85 words (+10 pts)
- Uses approved vocabulary (+5 pts)

--- SCORING ---
Start at 0, add pass points, subtract failure points. Cap at 100.
90-100: Ship it. Ready to film.
70-89: Strong but needs polish. Fix top priority.
50-69: Major issues. Rewrite required.
Below 50: Start over with a worked example as template.

COUNT THE VOICEOVER WORDS. Include the exact count.

Respond with a JSON object:
{
  "overallScore": 0-100,
  "verdict": "Ship it / Needs polish / Rewrite required / Start over",
  "voiceoverWordCount": exact_number,
  "viralityChecklist": {
    "hookPayloadBy4s": true/false,
    "extremeValueClaim": true/false,
    "voiceoverUnder85Words": true/false,
    "noLogisticsInVO": true/false,
    "approvedCloseType": true/false,
    "passCount": "X/5"
  },
  "phaseCheck": {
    "phase1Hook": { "present": true/false, "note": "What works or what's missing" },
    "phase2LocationDrop": { "present": true/false, "note": "What works or what's missing" },
    "phase3InventoryMeat": { "present": true/false, "note": "What works or what's missing" },
    "phase4InsiderTip": { "present": true/false, "note": "What works or what's missing" }
  },
  "psychologicalTriggers": ["Which triggers are activated"],
  "passes": [{ "rule": "Rule name", "points": number, "note": "What was done well" }],
  "failures": [{ "rule": "Rule name", "points": number, "line": "The specific problematic text", "fix": "Specific rewrite" }],
  "topPriorityFix": "The single most impactful fix to make right now",
  "revisedOpening": "Rewritten Phase 1 (first 4 seconds) following all performance rules, using a proven hook formula"
}

Respond ONLY with the JSON object, no other text.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3500,
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
    const msg = error instanceof Error ? error.message : 'Failed to audit script';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
