import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { apiKey, contentDescription, platform, tone, includeEmojis, includeCTA, niche } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is required' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const prompt = `You are a social media caption writer. Generate a compelling caption for the following content.

Content description: "${contentDescription}"
Platform: ${platform || 'All platforms'}
Tone: ${tone || 'casual'}
Include emojis: ${includeEmojis ? 'Yes' : 'No'}
Include call-to-action: ${includeCTA ? 'Yes' : 'No'}
Creator niche: ${niche || 'general'}

Write a platform-optimized caption that:
- Hooks the reader in the first line
- Tells a story or provides value
- ${includeEmojis ? 'Uses emojis strategically throughout' : 'Uses minimal or no emojis'}
- ${includeCTA ? 'Ends with a clear call-to-action (question, save prompt, share prompt, etc.)' : 'Ends naturally without a forced CTA'}
- Matches the ${tone || 'casual'} tone
- Is optimized for ${platform || 'social media'} engagement

Also generate:
- A short template name (3-5 words)
- A category label (e.g. "story time", "educational", "promotional", "behind the scenes")

Respond with a JSON object:
{
  "name": "template name",
  "category": "category label",
  "caption": "the full caption text"
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
    const message = error instanceof Error ? error.message : 'Failed to generate caption';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
