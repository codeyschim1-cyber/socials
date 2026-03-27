import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { apiKey, query, location } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is required' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const searchQuery = location
    ? `${query} near ${location}`
    : query;

  const prompt = `Search for upcoming vintage, antique, thrift, and flea market events matching this query: "${searchQuery}"

Find real, specific events with dates, locations, and details. Focus on events happening in the next 2-4 weeks.

You MUST respond with valid JSON only. No other text.

Respond with this JSON structure:
{
  "events": [
    {
      "name": "Event Name",
      "date": "YYYY-MM-DD",
      "location": "Venue, City",
      "state": "State abbreviation",
      "description": "Brief description of the event",
      "time": "10am - 4pm"
    }
  ]
}

If you cannot find specific events, return {"events": []} with no other text. Only include events you are confident about with real dates and locations.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      tools: [
        {
          type: 'web_search_20250305' as const,
          name: 'web_search',
          max_uses: 3,
        } as Anthropic.Messages.WebSearchTool20250305,
      ],
      messages: [{ role: 'user', content: prompt }],
    });

    // Extract text from response (may have multiple content blocks with web search)
    let text = '';
    for (const block of message.content) {
      if (block.type === 'text') {
        text += block.text;
      }
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json({ events: parsed.events || [] });
    }
    return NextResponse.json({ events: [] });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to search for events';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
