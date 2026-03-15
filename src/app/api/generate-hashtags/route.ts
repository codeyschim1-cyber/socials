import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { CREATOR_VOICE_PROFILE } from '@/lib/creator-context';

export async function POST(req: NextRequest) {
  const { apiKey, contentDescription, platform, niche } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is required' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const prompt = `${CREATOR_VOICE_PROFILE}

You are a social media hashtag strategist for this creator. Generate a strategic hashtag set for the following content.

Content description: "${contentDescription}"
Platform: ${platform || 'All platforms'}
Creator niche: ${niche || 'general'}

Generate 20-30 hashtags that include a mix of:
- High-volume popular hashtags (5-8)
- Medium-volume niche hashtags (8-12)
- Low-volume specific/long-tail hashtags (5-8)
- 2-3 branded/unique hashtags

Also generate a short descriptive name for this hashtag set (3-5 words).

Respond with a JSON object:
{
  "name": "set name here",
  "hashtags": ["#hashtag1", "#hashtag2", ...]
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
    const message = error instanceof Error ? error.message : 'Failed to generate hashtags';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
