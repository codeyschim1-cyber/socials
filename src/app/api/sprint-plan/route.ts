import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { apiKey, milestones } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is required' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const milestoneList = milestones.map((m: { platform: string; current: number; goal: number; weeksAway: string }) =>
    `- ${m.platform}: ${m.current.toLocaleString()} → ${m.goal.toLocaleString()} (${m.weeksAway})`
  ).join('\n');

  const prompt = `You are a social media growth strategist for a vintage fashion and thrifting creator. Create a 2-week content sprint plan to accelerate follower growth.

Current milestone progress:
${milestoneList}

Create a specific, day-by-day 2-week plan with:
- Exact post types for each day (reel, carousel, story, TikTok, YouTube short, etc.)
- Content themes/topics for each post
- Cadence recommendations per platform
- Growth tactics (collaborations, hashtag strategy, engagement pods, trending sounds)
- Quick wins that could boost growth immediately

Format as markdown with clear day-by-day structure. Be specific to the vintage/thrift niche. Keep it actionable and realistic.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    return NextResponse.json({ plan: text });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to generate sprint plan';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
