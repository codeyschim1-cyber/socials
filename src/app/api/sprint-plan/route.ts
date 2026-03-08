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

You MUST respond with valid JSON only. No other text before or after the JSON.

Respond with this exact JSON structure:
{
  "plan": "The full 2-week sprint plan in markdown format with day-by-day structure including exact post types, content themes, cadence recommendations, growth tactics, and quick wins. Be specific to the vintage/thrift niche.",
  "actionItems": [
    {
      "week": 1,
      "items": ["specific action item 1", "specific action item 2", "..."]
    },
    {
      "week": 2,
      "items": ["specific action item 1", "specific action item 2", "..."]
    }
  ]
}

For the plan, include:
- Exact post types for each day (reel, carousel, story, TikTok, YouTube short, etc.)
- Content themes/topics for each post
- Cadence recommendations per platform
- Growth tactics (collaborations, hashtag strategy, engagement pods, trending sounds)
- Quick wins that could boost growth immediately

For the actionItems, include 5-7 concrete, checkable tasks per week like:
- "Post 4 Instagram Reels featuring thrift hauls"
- "Film a thrift store walkthrough for YouTube"
- "Visit a local flea market and document finds"
- "Engage with 20 creators in the vintage niche daily"
- "Create 3 TikToks using trending sounds"

Be specific to the vintage/thrift niche. Keep it actionable and realistic.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json({ plan: parsed.plan, actionItems: parsed.actionItems || [] });
    }
    return NextResponse.json({ plan: text, actionItems: [] });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to generate sprint plan';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
