import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSettings, getProducts } from '@/lib/supabase';
import { getServiceRegions } from '@/lib/getServiceRegions';
import { buildNexiaSystemPrompt } from './nexiaPrompt';
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

// Which OpenRouter model answers. Set OPENROUTER_MODEL (e.g. a specific
// instruction-following model id from openrouter.ai/models) in production:
// 'openrouter/free' is only a last-resort fallback — it routes each request to
// a random free model, so answer quality and language handling vary per call.
const DEFAULT_MODEL = 'openrouter/free';

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

    // Built per request (all request-cached): the catalog, regions and admin
    // instructions are all editable from the admin panel. The admin prompt is
    // APPENDED to the grounded facts — it used to replace them, which left
    // Nexia with one generic sentence and nothing true to say (DEF-018).
    const [settings, regions, printers, equipment] = await Promise.all([
      getSettings(),
      getServiceRegions(),
      getProducts('printer'),
      getProducts('equipment'),
    ]);
    const systemPrompt = buildNexiaSystemPrompt({
      printers: printers.products,
      equipment: equipment.products,
      regions,
      adminInstructions: settings.ai_settings?.system_prompt,
      contact: settings.contact,
    });

    const payload = {
      model: process.env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL,
      // Low temperature: this is a factual sales assistant, not a creative one.
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
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
