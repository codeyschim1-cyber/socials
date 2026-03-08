import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { apiKey, notes, contentContext, platforms, niche, inspirationCreators, creatorBio } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is required' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const contextSection = contentContext && contentContext.length > 0
    ? `\n\nHere is context about the creator's existing content:\n${contentContext.map((c: { title: string; platform: string; notes: string; url?: string }) => `- [${c.platform}] "${c.title}"${c.notes ? ` — ${c.notes}` : ''}${c.url ? ` (${c.url})` : ''}`).join('\n')}`
    : '';

  const inspirationSection = inspirationCreators && inspirationCreators.length > 0
    ? `\n\nCreators to draw inspiration from (study their content style, formats, and what works for them):\n${inspirationCreators.map((c: { handle: string; platform: string; note: string }) => `- ${c.handle} (${c.platform}) — ${c.note}`).join('\n')}`
    : '';

  const bioSection = creatorBio ? `\n- Bio: ${creatorBio}` : '';

  const prompt = `You are a social media content strategist specializing in the vintage fashion, thrifting, and menswear niche. Generate 5 creative content ideas for a creator.

Creator info:
- Platforms: ${platforms || 'Instagram, TikTok, YouTube, Facebook'}
- Niche/topics: ${niche || 'general'}${bioSection}
${contextSection}${inspirationSection}

The creator's notes/request: "${notes}"

Important: Draw inspiration from the listed creators' content styles and formats. Suggest ideas that are specific, actionable, and tailored to the creator's niche and audience. Think about hooks, formats (reels, carousels, stories, long-form), and trending content patterns in the thrift/vintage space.

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

    // Parse the JSON from the response
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
