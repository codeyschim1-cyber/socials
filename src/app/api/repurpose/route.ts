import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { CREATOR_VOICE_PROFILE } from '@/lib/creator-context';

export async function POST(req: NextRequest) {
  const { apiKey, title, description, originalPlatform } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is required' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const prompt = `${CREATOR_VOICE_PROFILE}

You are a content repurposing expert for this creator. Match their voice and style. Take the following content idea and create platform-optimized versions for all 4 platforms.

Original content:
- Title: "${title}"
- Description: "${description}"
- Original format: ${originalPlatform}

Create repurposed versions for each platform. Respond with a JSON object:

{
  "tiktok": {
    "title": "TikTok version title",
    "script": "A short-form script (30-60 seconds) with hook, body, CTA. Include timing cues.",
    "hashtags": ["relevant", "hashtags"],
    "tips": "Platform-specific tips for this content"
  },
  "instagram": {
    "title": "Instagram carousel title",
    "slides": ["Slide 1: Cover/Hook", "Slide 2: Key point", "Slide 3: ...", "Slide N: CTA"],
    "caption": "Full Instagram caption with line breaks",
    "hashtags": ["relevant", "hashtags"],
    "tips": "Platform-specific tips"
  },
  "youtube": {
    "title": "YouTube video title",
    "description": "Full YouTube description with timestamps and keywords",
    "chapters": ["0:00 - Intro", "0:30 - First point", "..."],
    "tags": ["relevant", "tags"],
    "tips": "Platform-specific tips"
  },
  "pinterest": {
    "title": "Pinterest pin title (keyword-rich)",
    "caption": "Pinterest description with keywords for search",
    "keywords": ["keyword1", "keyword2"],
    "boardSuggestion": "Suggested board name",
    "tips": "Platform-specific tips"
  }
}

Make each version unique and optimized for that platform's algorithm and audience behavior. Be specific to the vintage/thrift niche. Respond ONLY with the JSON object.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
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
    const msg = error instanceof Error ? error.message : 'Failed to repurpose content';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
