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

You are a content performance auditor for this creator. Audit the following script against their data-backed performance rules. Be strict — this creator's audience leaves at 4-5 seconds if the payload isn't delivered.

Script:
"""
${scriptText}
"""
${estimatedLengthSeconds ? `Estimated length: ${estimatedLengthSeconds} seconds` : ''}

CHECK FOR THESE FAILURES:
- Spoken logistics: addresses, hours, dates, appointment rules in voiceover
- History/backstory: owner biography, store founding story
- Missing hero item: no specific product called out in first 2 seconds
- Late payload: core value prop (price, secret, scale) not delivered by 0:04
- Overtime: estimated runtime over 18 seconds
- Weak opening: starts with greeting, slow intro, or static scene description
- Dead b-roll: generic rack descriptions without specific items
- Missing close: no question, directive, countdown, or strong visual ending
- Overcrowded text: 10+ item list described while camera would be moving
- Filler language: "um", "like", "so basically", "the vibes"

CHECK FOR THESE PASSES:
- Superlative hook present
- Payload delivered by 0:04
- Hero item named in first 2 seconds
- Logistics in text overlay only (marked with [TEXT:] or similar)
- On-screen checklist present
- Number anchor used
- Mini narrative goal stated
- Strong close type identified

Score 0-100 based on how many rules pass vs fail, weighted by impact:
- Hook/payload timing: 30 points
- Hero item presence: 15 points
- No performance killers: 20 points
- Strong close: 10 points
- Correct format/length: 10 points
- Voice match: 15 points

Respond with a JSON object:
{
  "overallScore": 0-100,
  "verdict": "One sentence summary verdict",
  "passes": [{ "rule": "Rule name", "note": "What was done well" }],
  "failures": [{ "rule": "Rule name", "line": "The specific problematic text from the script", "fix": "How to fix it" }],
  "topPriorityFix": "The single most impactful fix to make",
  "revisedOpening": "Rewritten first 5 seconds only, following all performance rules"
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
    const msg = error instanceof Error ? error.message : 'Failed to audit script';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
