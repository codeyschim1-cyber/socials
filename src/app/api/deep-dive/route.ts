import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { CREATOR_VOICE_PROFILE } from '@/lib/creator-context';

export async function POST(req: NextRequest) {
  const { apiKey, title, description, platform, category, niche, creatorBio } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is required' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const prompt = `${CREATOR_VOICE_PROFILE}

You are a social media content production planner for this creator. Match their voice and style in all scripts and hooks. Create a complete production plan for the following content idea.

Content Idea: "${title}"
Description: "${description}"
Platform: ${platform || 'All platforms'}
Category: ${category || 'evergreen'}
Creator niche: ${niche || 'general'}
${creatorBio ? `Creator bio: ${creatorBio}` : ''}

Create a detailed production plan with three sections:

1. SHOT LIST: 5-8 shots with specific descriptions and durations. Think about camera angles, b-roll, transitions.

2. HOOKS: 5 different hook options:
   - "question" — opens with a compelling question
   - "bold_statement" — opens with a bold/controversial claim
   - "story" — opens with a mini story/anecdote
   - "relatable" — opens with a relatable situation
   - "pattern_interrupt" — opens with something unexpected to stop the scroll

3. SCRIPT: A full script (200-400 words) that could be used as a voiceover or on-camera script. Include natural pauses, emphasis cues, and a strong close.

Respond with a JSON object:
{
  "shotList": [
    { "shot": "Shot 1 name", "description": "What to film", "duration": "3-5s" }
  ],
  "hooks": [
    { "type": "question", "text": "the hook text" },
    { "type": "bold_statement", "text": "the hook text" },
    { "type": "story", "text": "the hook text" },
    { "type": "relatable", "text": "the hook text" },
    { "type": "pattern_interrupt", "text": "the hook text" }
  ],
  "script": "The full script text here..."
}

Respond ONLY with the JSON object, no other text.`;

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
    const message = error instanceof Error ? error.message : 'Failed to generate deep dive';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
