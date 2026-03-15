import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { CREATOR_VOICE_PROFILE } from '@/lib/creator-context';

export async function POST(req: NextRequest) {
  const { apiKey, brandProposal, brandResponse } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is required' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const prompt = `${CREATOR_VOICE_PROFILE}

You are a professional talent manager/agent for this creator. A brand deal negotiation is in progress. Analyze the situation and craft a counter-offer strategy.

## Original Brand Proposal
${brandProposal}

## Brand's Latest Response
${brandResponse}

Provide:
1. **Analysis**: What the brand is really saying, their leverage points, and yours
2. **Strategy**: Your recommended negotiation approach (hold firm, compromise, walk away, etc.)
3. **Counter-Offer Email**: A professional manager-toned response that:
   - References the creator's value proposition (reach, engagement, audience quality)
   - Proposes specific counter-terms based on the rate card
   - Offers creative alternatives if budget is truly limited (e.g., usage rights trade-off, reduced deliverables, performance bonuses)
   - Maintains leverage without burning the relationship
   - Uses "we" language (speaking as the creator's management)

Respond with a JSON object:
{
  "analysis": "Analysis of the brand's position and leverage",
  "strategy": "Recommended negotiation strategy",
  "counterEmail": "The full counter-offer email text",
  "keyPoints": ["bullet point 1", "bullet point 2", "bullet point 3"]
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
    const msg = error instanceof Error ? error.message : 'Failed to generate counter-offer';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
