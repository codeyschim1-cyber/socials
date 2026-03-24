import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { CREATOR_VOICE_PROFILE } from '@/lib/creator-context';

export async function POST(req: NextRequest) {
  const { apiKey, hookText, contentType } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is required' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const prompt = `${CREATOR_VOICE_PROFILE}

You are a content performance analyst for this creator. Score the following hook against their data-backed hook ranking system.

Hook text: "${hookText}"
${contentType ? `Content type: ${contentType}` : ''}

HOOK RANKING SYSTEM (from creator's performance data):
1. Authority/Fight Me: "The best vintage store in the country" — highest reach/shares (S-tier)
2. Secret/Gatekept: "Behind me" / "Secret designer showroom" — highest saves (S-tier)
3. Price Disruption: "Everything is $25" — highest retention, 105% on top videos (A-tier)
4. Scale/Quantity: "5 floors of furniture" — strong utility, builds local audience (A-tier)
5. Other: Anything that doesn't fit the above categories (B or C tier)

PERFORMANCE RULES FOR HOOKS:
- Must lead with a quantifiable superlative
- Must deliver core payload (price, secret, hero item) by 0:04
- Must start mid-action, never static
- Should include number anchors when possible
- Should never include spoken logistics
- No filler words, no generic statements
- No flowery slow introductions

Analyze this hook and respond with a JSON object:
{
  "hookType": "authority | gatekept | price_disruption | scale | other",
  "tier": "S | A | B | C",
  "tierReason": "One sentence explaining the tier assignment based on performance data",
  "weaknesses": ["specific weakness 1", "specific weakness 2"],
  "rewrite": "One specific rewrite that upgrades this hook to the next tier",
  "rewriteExplanation": "Why the rewrite would perform better based on the data"
}

Respond ONLY with the JSON object, no other text.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
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
    const msg = error instanceof Error ? error.message : 'Failed to score hook';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
