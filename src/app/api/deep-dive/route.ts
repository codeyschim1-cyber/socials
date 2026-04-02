import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { CREATOR_VOICE_PROFILE, WORKED_SCRIPT_EXAMPLES } from '@/lib/creator-context';
import { COMPETITOR_HOOK_LIBRARY } from '@/lib/competitor-intelligence';

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
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#\d+;/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    return text.slice(0, 3000);
  } catch {
    return `[Failed to fetch ${url}: request timed out or blocked]`;
  }
}

export async function POST(req: NextRequest) {
  const { apiKey, title, description, platform, category, niche, creatorBio, referenceLinks } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is required' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  // Fetch reference links if provided
  let referenceLinkContext = '';
  if (referenceLinks && Array.isArray(referenceLinks) && referenceLinks.length > 0) {
    const linkResults = await Promise.all(
      referenceLinks.slice(0, 5).map(async (url: string) => {
        const content = await fetchLinkContent(url);
        return { url, content };
      })
    );
    referenceLinkContext = `\n--- STORE / LOCATION RESEARCH ---
CRITICAL: Use ONLY this information for factual details. Do NOT fabricate details not found here.

${linkResults.map((r, i) => `[Source ${i + 1}: ${r.url}]\n${r.content}`).join('\n\n')}
--- END STORE RESEARCH ---`;
  }

  // System message with creator context (keeps user message shorter)
  const systemPrompt = `${CREATOR_VOICE_PROFILE}

${WORKED_SCRIPT_EXAMPLES}

${COMPETITOR_HOOK_LIBRARY}

You are a viral content script generator for this creator. Generate production-ready scripts following the strict 4-phase framework. Always respond with valid JSON only — no markdown, no code fences, no extra text.`;

  const userPrompt = `Generate a COMPLETE production-ready script package for:

Content Idea: "${title}"
Description: "${description}"
Platform: ${platform || 'Instagram Reels'}
Category: ${category || 'evergreen'}
Creator niche: ${niche || 'vintage fashion, thrifting, menswear'}
${creatorBio ? `Creator bio: ${creatorBio}` : ''}${referenceLinkContext}

CONSTRAINTS:
- Voiceover: 60-85 words, moderate pace, no logistics spoken
- Every sentence must have a specific (brand, price, number, location)
- Use "The List" technique for stacking items
- 4-phase structure: HOOK (0-4s), LOCATION DROP (4-9s), INVENTORY MEAT (9-25s), INSIDER TIP (25-30s+)

Return a JSON object with these exact keys:
- "viralityScore": {"scale": number 1-5, "geography": number 1-5, "valueDisconnect": number 1-5, "total": number 3-15, "prediction": string, "angleAdvice": string}
- "templateSelected": string (hidden_gem, epic_haul, or curated_list)
- "templateReason": string
- "hookOptions": array of 3 objects with {"type": string, "text": string, "tier": string}
- "masterScript": array of 4 phase objects with {"phase": string, "time": string, "visualDirection": string, "textOverlay": string, "voiceover": string}
- "voiceoverWordCount": number
- "closeType": string
- "audioVibe": string
- "instagramCaption": string with hashtags
- "estimatedLength": string like "28s"
- "viralityChecklist": {"hookPayloadBy4s": boolean, "extremeValueClaim": boolean, "voiceoverUnder85Words": boolean, "noLogisticsInVO": boolean, "approvedCloseType": boolean, "passCount": string}
- "performanceNotes": array of strings`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt },
        { role: 'assistant', content: '{' },
      ],
    });

    const text = '{' + (message.content[0].type === 'text' ? message.content[0].text : '');

    // Strip any trailing text after the JSON object
    let cleaned = text.replace(/```(?:json)?\s*/gi, '').replace(/```\s*/g, '');
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    let jsonStr = jsonMatch[0];
    // Fix trailing commas
    jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1');

    let raw;
    try {
      raw = JSON.parse(jsonStr);
    } catch {
      // Strip control characters and retry
      jsonStr = jsonStr.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
      try {
        raw = JSON.parse(jsonStr);
      } catch (e) {
        const parseErr = e instanceof Error ? e.message : 'unknown';
        return NextResponse.json({ error: `JSON parse failed: ${parseErr}` }, { status: 500 });
      }
    }

    // Transform the Master Script Generator output into the IdeaDeepDive shape
    const shotList = Array.isArray(raw.masterScript)
      ? raw.masterScript.map((phase: { phase?: string; time?: string; visualDirection?: string; textOverlay?: string; voiceover?: string }) => ({
          shot: phase.phase || 'Shot',
          description: [
            phase.visualDirection,
            phase.textOverlay ? `Text overlay: ${phase.textOverlay}` : '',
            phase.voiceover ? `VO: "${phase.voiceover}"` : '',
          ].filter(Boolean).join('\n'),
          duration: phase.time || '',
        }))
      : raw.shotList || [];

    const hooks = Array.isArray(raw.hookOptions)
      ? raw.hookOptions.map((h: { type?: string; text?: string; tier?: string }) => ({
          type: h.type || 'hook',
          text: h.text || '',
          tier: h.tier,
        }))
      : raw.hooks || [];

    const script = typeof raw.script === 'string'
      ? raw.script
      : Array.isArray(raw.masterScript)
        ? raw.masterScript.map((p: { phase?: string; time?: string; voiceover?: string }) =>
            `[${p.time || ''}] ${p.voiceover || ''}`
          ).join('\n\n')
        : '';

    const result = {
      shotList,
      hooks,
      script,
      viralityScore: raw.viralityScore,
      templateSelected: raw.templateSelected,
      templateReason: raw.templateReason,
      voiceoverWordCount: raw.voiceoverWordCount,
      closeType: raw.closeType,
      audioVibe: raw.audioVibe,
      instagramCaption: raw.instagramCaption,
      estimatedLength: raw.estimatedLength,
      viralityChecklist: raw.viralityChecklist,
      performanceNotes: raw.performanceNotes,
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to generate deep dive';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
