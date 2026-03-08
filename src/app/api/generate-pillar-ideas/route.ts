import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { apiKey, pillarName, pillarDescription, niche, creatorBio } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is required' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const prompt = `You are a social media content strategist. Generate 5 content ideas specifically scoped to the following content pillar.

Content Pillar: "${pillarName}"
${pillarDescription ? `Pillar Description: "${pillarDescription}"` : ''}
Creator niche: ${niche || 'general'}
${creatorBio ? `Creator bio: ${creatorBio}` : ''}

Generate 5 unique, specific, and actionable content ideas that fit perfectly within this content pillar. Each idea should be distinct in format/angle.

For each idea, respond with a JSON array of exactly 5 objects, each with:
- "title": catchy, concise title (under 60 chars)
- "description": 2-3 sentence description of the content concept, hook, and format
- "platform": best platform for this ("instagram", "tiktok", "youtube", "facebook", or "all")
- "category": one of "trending", "evergreen", or "series"
- "tags": array of 2-4 relevant tags (no # symbol)

Respond ONLY with the JSON array, no other text.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    const ideas = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ ideas });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate ideas';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
