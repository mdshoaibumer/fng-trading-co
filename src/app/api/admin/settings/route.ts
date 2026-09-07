import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import { hashPassword, verifySessionToken } from '@/lib/adminSession';
import { revalidatePublicSite } from '@/lib/revalidate';

// Only http(s) URLs, site-relative paths, or blank are accepted for anything
// rendered as a link or media source — never javascript:/data: schemes.
//
// Site-relative paths have to be allowed because the divider videos are
// self-hosted and stored that way ("/videos/forest-animation.mp4"). Rejecting
// them made the Settings page unsaveable in a way that looked unrelated to
// whatever was being edited: it loads every value with a GET and posts them
// all back, so the stored video paths failed validation on every save and the
// error surfaced against whichever field the admin had just changed.
//
// "/" but not "//": a protocol-relative "//evil.com" is an external URL
// wearing a relative path's clothes, and stays rejected along with the
// javascript:/data: schemes this guards against.
const httpUrl = z.string().trim().max(2048).refine(
  (v) => v === '' || /^https?:\/\//i.test(v) || /^\/(?!\/)/.test(v),
  { message: 'Must be an http(s) URL or a site-relative path' }
).optional();
const shortText = z.string().trim().max(200).optional();

// Exactly the top-level keys the Settings UI edits. `.strict()` at the top
// level rejects anything else, so this endpoint can never be used to
// overwrite content_en/content_ar or stash an unhashed admin_password.
// Nested objects use zod's default behaviour (unknown keys are dropped), so
// an older stored shape with an extra field still saves.
const settingsSchema = z.object({
  contact: z.object({ whatsapp: shortText, phone: shortText, email: z.string().trim().max(254).optional() }).optional(),
  ai_settings: z.object({ welcome_message: z.string().trim().max(2000).optional(), system_prompt: z.string().trim().max(8000).optional() }).optional(),
  social_media: z.object({ facebook: httpUrl, instagram: httpUrl, linkedin: httpUrl, twitter: httpUrl }).optional(),
  videos: z.object({ divider1: httpUrl, divider2: httpUrl }).optional(),
  seo: z.object({ title: shortText, description: z.string().trim().max(1000).optional() }).optional(),
  admin_password: z.string().max(200).optional(),
}).strict();

async function isAdminRequest(): Promise<boolean> {
  const token = (await cookies()).get('fng_session')?.value;
  return verifySessionToken(token);
}

export async function GET() {
  try {
    const isAdmin = await isAdminRequest();
    const { data, error } = await supabaseAdmin
      .from('settings')
      .select('*');

    if (error) throw error;

    // Allowlist (not denylist) the keys this endpoint returns. It's reachable
    // unauthenticated (PUBLIC_GET_ROUTES in proxy.ts) and is what the admin
    // Settings UI loads to edit, so it must expose exactly the editable config
    // keys and nothing else — this way any future secret ever stored in
    // `settings` (e.g. a third-party API key) can never auto-leak.
    const PUBLIC_KEYS = new Set(['contact', 'ai_settings', 'social_media', 'videos', 'seo']);
    const result: Record<string, unknown> = {};
    data.forEach(item => {
      if (PUBLIC_KEYS.has(item.key)) {
        result[item.key] = item.value;
      }
    });

    // The AI system prompt is business logic for the assistant, not public
    // site content — only a signed-in admin (the Settings UI) gets it.
    if (!isAdmin && result.ai_settings && typeof result.ai_settings === 'object') {
      const { system_prompt: _omit, ...rest } = result.ai_settings as Record<string, unknown>;
      void _omit;
      result.ai_settings = rest;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const parsed = settingsSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid settings payload', issues: parsed.error.issues.map((i) => i.path.join('.')) }, { status: 400 });
    }
    const settings: Record<string, unknown> = { ...parsed.data };

    // Filter out an empty/whitespace-only password ("leave blank to keep
    // current"). Only a real, non-blank value replaces the credential.
    if (typeof settings.admin_password === 'string' && settings.admin_password.trim() === '') {
      delete settings.admin_password;
    } else if (typeof settings.admin_password === 'string') {
      if (settings.admin_password.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
      }
      settings.admin_password = await hashPassword(settings.admin_password);
    }

    if (Object.keys(settings).length === 0) {
      return NextResponse.json({ success: true, skipped: 'nothing to save' });
    }

    const formatted = Object.entries(settings).map(([key, value]) => ({
      key,
      value
    }));

    const { error } = await supabaseAdmin
      .from('settings')
      .upsert(formatted);

    if (error) throw error;

    // Contact email/phone/whatsapp, social links, videos and AI copy all feed
    // the layout + static pages — refresh them so changes show without redeploy.
    revalidatePublicSite();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings POST error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
