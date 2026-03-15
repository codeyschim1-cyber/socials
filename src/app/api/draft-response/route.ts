import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { CREATOR_VOICE_PROFILE } from '@/lib/creator-context';

export async function POST(req: NextRequest) {
  const { apiKey, email, creatorProfile } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is required' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const ratesSection = creatorProfile.rates
    ? `\nRate card:\n${Object.entries(creatorProfile.rates).filter(([, v]) => v && Number(v) > 0).map(([k, v]) => `- ${k.replace(/([A-Z])/g, ' $1').trim()}: $${v}`).join('\n')}`
    : '';

  const prompt = `${CREATOR_VOICE_PROFILE}

You are a professional talent manager/agent for this creator. Draft a polished, professional response email to this inbound brand inquiry. Use the rates from the creator profile above.

Creator profile:
- Name: ${creatorProfile.displayName || 'Creator'}
- Bio: ${creatorProfile.bio || 'Content creator'}
- Niche: ${creatorProfile.niche || 'General'}
- Platforms: Instagram (${creatorProfile.instagramHandle || 'N/A'}), TikTok (${creatorProfile.tiktokHandle || 'N/A'}), YouTube (${creatorProfile.youtubeHandle || 'N/A'})
- Instagram followers: ${creatorProfile.instagramFollowers?.toLocaleString() || '0'}
- TikTok followers: ${creatorProfile.tiktokFollowers?.toLocaleString() || '0'}
- YouTube subscribers: ${creatorProfile.youtubeSubscribers?.toLocaleString() || '0'}${ratesSection}

The inbound brand email:
"""
${email}
"""

Write a professional manager-toned response that:
1. Acknowledges the opportunity and expresses interest
2. References the creator's relevant platforms and audience
3. Outlines what deliverables would look like based on the brand's needs
4. Includes suggested rates if applicable (reference the rate card)
5. Closes with clear next steps (scheduling a call, sending a media kit, etc.)

Keep the tone professional but warm. Write as if you are the creator's manager/agent speaking on their behalf. Use "we" language. Be concise but thorough.

Return ONLY the email text, no subject line or metadata.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    return NextResponse.json({ response: text });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to draft response';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
