import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSettings } from '@/lib/supabase';
import { officeRegions, type ServiceRegion } from '@/lib/serviceRegions';
import { getServiceRegions } from '@/lib/getServiceRegions';
import { rateLimit, globalRateLimit, getClientIp, tooManyRequests } from '@/lib/rateLimit';

// Bound the payload forwarded to the paid LLM: whitelist roles, cap message
// length and count so the endpoint can't be abused as a free LLM proxy on our
// key with arbitrary injected conversation turns.
// No 'system' role from the client: the only system prompt is the one the
// admin configured (or the default below) — a visitor must not be able to
// append their own persona/instructions to it.
const messagesSchema = z
  .array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().trim().min(1).max(2000),
    })
  )
  .min(1)
  .max(20)
  .refine((msgs) => msgs.reduce((n, m) => n + m.content.length, 0) <= 12000, { message: 'Conversation too long' });

const UPSTREAM_TIMEOUT_MS = 30_000;

// Built per request rather than once at module load: the footprint it recites
// is editable from Admin -> Regions, and a module constant would keep quoting
// whatever the list was when the server booted.
const buildSystemPrompt = (regions: readonly ServiceRegion[]) => `You are Nexia, the official AI assistant for Future Next Gen (FNG).
FNG specializes in providing premium refurbished HP enterprise printers, high-quality eco-friendly inks, and printer parts to businesses, plus verified electronics sourcing from China.
FNG is headquartered in Riyadh, Saudi Arabia, with offices in ${officeRegions(regions).map((r) => `${r.hubEn.replace(' (HQ)', '')}, ${r.nameEn}`).join('; ')}. FNG serves customers across ${regions.map((r) => r.nameEn).join(', ')}.
Your goal is to assist customers, answer questions about our products, and help them find the right office equipment.
Tone: Professional, helpful, concise, and futuristic.
Key Information:
- We offer enterprise-grade refurbished HP printers that save costs and reduce e-waste.
- We sell eco-friendly, high-yield ink cartridges.
- We offer comprehensive maintenance and repair services.
- If a customer wants to buy in bulk, encourage them to fill out the 'Request a Quote' form or contact sales via WhatsApp.
Keep your responses relatively brief and highly relevant. Do not hallucinate products we do not sell.`;

export async function POST(req: Request) {
  try {
    const { allowed, retryAfterSeconds } = rateLimit(`chat:${getClientIp(req)}`, 20, 5 * 60 * 1000);
    if (!allowed) return tooManyRequests(retryAfterSeconds);

    // Backstop against X-Forwarded-For spoofing — this endpoint calls a
    // paid AI API per request, so an attacker resetting the per-IP bucket
    // with a fresh header on every call is a real cost risk, not just spam.
    const global = globalRateLimit('chat', 100, 5 * 60 * 1000);
    if (!global.allowed) return tooManyRequests(global.retryAfterSeconds);

    const body = await req.json();
    const parsed = messagesSchema.safeParse(body?.messages);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 });
    }
    const messages = parsed.data;

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error('Missing OPENROUTER_API_KEY');
      return NextResponse.json({ error: 'AI service is not configured.' }, { status: 500 });
    }

    const settings = await getSettings();
    const configuredPrompt = settings.ai_settings?.system_prompt?.trim();

    const payload = {
      model: 'openrouter/free', // Dynamically selects the best available free model
      messages: [
        { role: 'system', content: configuredPrompt || buildSystemPrompt(await getServiceRegions()) },
        ...messages
      ]
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://fngtradingco.com',
        'X-Title': 'FNG Platform',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenRouter error:', errText);
      return NextResponse.json({ error: 'Failed to communicate with AI service' }, { status: 502 });
    }

    const data = await response.json();
    const content: unknown = data?.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || !content.trim()) {
      console.error('OpenRouter returned no content:', JSON.stringify(data).slice(0, 500));
      return NextResponse.json({ error: 'AI service returned an empty reply' }, { status: 502 });
    }
    // Only the reply text goes back to the browser — not the provider's
    // model/usage metadata.
    return NextResponse.json({ content });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
