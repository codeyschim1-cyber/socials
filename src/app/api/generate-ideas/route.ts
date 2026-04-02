import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { CREATOR_VOICE_PROFILE } from '@/lib/creator-context';
import { COMPETITOR_HOOK_LIBRARY, COMPETITOR_CONTENT_PATTERNS } from '@/lib/competitor-intelligence';

async function fetchLinkContent(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CreatorHub/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    clearTimeout(timeout);
    if (!res.ok) return `[Failed to fetch ${url}: ${res.status}]`;
    const html = await res.text();
    // Strip HTML tags, scripts, styles, and collapse whitespace
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#\d+;/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    // Truncate to ~3000 chars to avoid bloating the prompt
    return text.slice(0, 3000);
  } catch {
    return `[Failed to fetch ${url}: request timed out or blocked]`;
  }
}

export async function POST(req: NextRequest) {
  const { apiKey, notes, contentContext, platforms, niche, inspirationCreators, creatorBio, performanceData, screenshotBase64, referenceLinks } = await req.json();

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

  const performanceSection = performanceData
    ? `\n\nPerformance data: The creator's best performing platform is ${performanceData.topPlatform} with ${performanceData.engagementRate}% engagement rate. Weight your suggestions toward this platform and similar content styles that have historically performed well.`
    : '';

  const screenshotSection = screenshotBase64
    ? `\n\nIMPORTANT: An analytics screenshot has been provided. Carefully read and analyze the data in the image — follower counts, engagement rates, top posts, reach, impressions, etc. Use this real data to inform your content ideas. Prioritize content types and topics that align with what's performing well according to the screenshot.`
    : '';

  // Fetch reference links if provided
  let referenceLinkSection = '';
  if (referenceLinks && Array.isArray(referenceLinks) && referenceLinks.length > 0) {
    const linkResults = await Promise.all(
      referenceLinks.slice(0, 5).map(async (url: string) => {
        const content = await fetchLinkContent(url);
        return { url, content };
      })
    );
    referenceLinkSection = `\n\n--- STORE / LOCATION RESEARCH (from provided reference links) ---
CRITICAL: Use ONLY the information below for factual details about this location (address, neighborhood, number of floors, what they sell, prices, hours, etc.). Do NOT make up or assume any details that are not in these sources. If a detail is not available from the links, say so or leave it out — never fabricate location-specific facts.

${linkResults.map((r, i) => `[Source ${i + 1}: ${r.url}]\n${r.content}`).join('\n\n')}

--- END STORE RESEARCH ---`;
  }

  const prompt = `${CREATOR_VOICE_PROFILE}

${COMPETITOR_HOOK_LIBRARY}

${COMPETITOR_CONTENT_PATTERNS}

You are a social media content strategist for this creator. Generate 5 creative content ideas based on the creator profile and competitor intelligence above. Use the proven hook formulas and content formats — never suggest generic hooks.

Creator info:
- Platforms: ${platforms || 'Instagram, TikTok, YouTube, Facebook'}
- Niche/topics: ${niche || 'general'}${bioSection}
${contextSection}${inspirationSection}${performanceSection}${screenshotSection}${referenceLinkSection}

The creator's notes/request: "${notes}"

Important: Draw inspiration from the listed creators' content styles and formats. Suggest ideas that are specific, actionable, and tailored to the creator's niche and audience. Think about hooks, formats (reels, carousels, stories, long-form), and trending content patterns in the thrift/vintage space.

For each idea, respond with a JSON array of exactly 5 objects, each with:
- "title": catchy, concise title (under 60 chars)
- "description": 2-3 sentence description of the content concept, hook, and format
- "platform": best platform for this ("instagram", "tiktok", "youtube", "facebook", or "all")
- "category": one of "trending", "evergreen", or "series"
- "tags": array of 2-4 relevant tags (no # symbol)

Respond ONLY with the JSON array, no other text.`;

  // Build message content — text + optional image
  const messageContent: Anthropic.MessageParam['content'] = [];
  if (screenshotBase64) {
    // Extract media type and base64 data from data URL
    const match = screenshotBase64.match(/^data:(image\/(?:png|jpeg));base64,(.+)$/);
    if (match) {
      messageContent.push({
        type: 'image',
        source: { type: 'base64', media_type: match[1] as 'image/png' | 'image/jpeg', data: match[2] },
      });
    }
  }
  messageContent.push({ type: 'text', text: prompt });

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: messageContent }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';

    // Strip markdown code fences and extract JSON array
    const cleaned = text.replace(/```(?:json)?\s*/gi, '').replace(/```\s*/g, '');
    const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    let jsonStr = jsonMatch[0].replace(/,\s*([}\]])/g, '$1');
    let ideas;
    try { ideas = JSON.parse(jsonStr); } catch {
      jsonStr = jsonStr.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
      ideas = JSON.parse(jsonStr);
    }
    return NextResponse.json({ ideas });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate ideas';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
