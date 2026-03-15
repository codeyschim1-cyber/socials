import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { CREATOR_VOICE_PROFILE } from '@/lib/creator-context';

export async function POST(req: NextRequest) {
  const { apiKey, performanceData, storeData, pillars, recentPosts } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is required' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const performanceSection = performanceData && performanceData.length > 0
    ? `\n\nRecent Performance Log (use this to inform recommendations):\n${performanceData.slice(0, 10).map((p: { title: string; platform: string; views: number; likes: number; shares: number; saves: number; hookType: string; viral: boolean }) =>
        `- "${p.title}" (${p.platform}) — ${p.views.toLocaleString()} views, ${p.likes.toLocaleString()} likes, ${p.shares.toLocaleString()} shares, ${p.saves.toLocaleString()} saves | Hook: ${p.hookType} | Viral: ${p.viral ? 'Yes' : 'No'}`
      ).join('\n')}`
    : '';

  const storeSection = storeData && storeData.length > 0
    ? `\n\nStore Log (locations to reference for content):\n${storeData.slice(0, 15).map((s: { name: string; type: string; location: string; rating: number; knownFor: string }) =>
        `- ${s.name} (${s.type}, ${s.location}) — Rating: ${s.rating}/5, Known for: ${s.knownFor}`
      ).join('\n')}`
    : '';

  const pillarSection = pillars && pillars.length > 0
    ? `\n\nContent Pillars:\n${pillars.map((p: { name: string; description: string }) => `- ${p.name}: ${p.description}`).join('\n')}`
    : '';

  const recentPostsSection = recentPosts && recentPosts.length > 0
    ? `\n\nRecent scheduled/published posts (avoid repetition):\n${recentPosts.map((p: { title: string; platform: string; scheduledDate: string }) => `- "${p.title}" (${p.platform}, ${p.scheduledDate})`).join('\n')}`
    : '';

  const prompt = `${CREATOR_VOICE_PROFILE}

You are a content strategist for this creator. Create a 7-day content plan for the upcoming week. Each day should have one primary post recommendation.
${performanceSection}${storeSection}${pillarSection}${recentPostsSection}

Rules:
- Vary platforms across the week (mix of Instagram, TikTok, YouTube)
- Each recommendation should tie to a content pillar
- Use bold, superlative hooks that match the creator's voice
- Reference specific stores/locations from the Store Log when relevant
- Lean into formats and hook types that performed well in the Performance Log
- Avoid repeating concepts from recent posts
- Include a mix of formats (reels, carousels, TikToks, YouTube shorts)

For each day, respond with a JSON array of exactly 7 objects:
[
  {
    "day": "Monday",
    "platform": "instagram",
    "pillar": "Store Discovery",
    "format": "reel",
    "concept": "Brief concept description",
    "hook": "The exact opening line/hook for the video",
    "reasoning": "Why this will perform well based on analytics"
  }
]

Respond ONLY with the JSON array, no other text.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2500,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    const recommendations = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ recommendations });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to generate recommendations';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
