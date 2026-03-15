import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { CREATOR_VOICE_PROFILE } from '@/lib/creator-context';

export async function POST(req: NextRequest) {
  const { apiKey, dealDescription } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is required' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const prompt = `${CREATOR_VOICE_PROFILE}

You are a talent manager reviewing a potential brand deal for this creator. Assess the deal and provide a rate check analysis.

## Deal Description
${dealDescription}

Provide a thorough analysis:

1. **Assessment**: Is this a good deal, fair deal, or undervalued? Compare to the creator's rate card.
2. **Fair Value**: What this deal should be worth based on the creator's metrics, audience, and deliverables requested.
3. **Hidden Costs**: Time investment, exclusivity implications, content restrictions, usage rights concerns, opportunity cost.
4. **Red Flags**: Any concerning terms, unreasonable expectations, or missing details.
5. **Recommended Counter**: If the deal is below market, what should the counter-offer look like?

Respond with a JSON object:
{
  "verdict": "good_deal" | "fair_deal" | "undervalued" | "red_flag",
  "assessment": "Detailed assessment text",
  "fairValue": "Estimated fair value range (e.g. $5,000-$7,000)",
  "hiddenCosts": ["hidden cost 1", "hidden cost 2"],
  "redFlags": ["red flag 1", "red flag 2"],
  "recommendedCounter": "Specific recommended counter-offer with reasoning",
  "summary": "One-sentence summary verdict"
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
    const msg = error instanceof Error ? error.message : 'Failed to check rate';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
