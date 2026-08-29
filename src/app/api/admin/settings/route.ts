import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { hashPassword } from '@/lib/adminSession';
import { revalidatePublicSite } from '@/lib/revalidate';

export async function GET() {
  try {
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

    return NextResponse.json(result);
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const settings = await request.json();
    
    // Filter out an empty/whitespace-only password ("leave blank to keep
    // current"). Only a real, non-blank value replaces the credential.
    if (typeof settings.admin_password === 'string' && settings.admin_password.trim() === '') {
      delete settings.admin_password;
    } else if (typeof settings.admin_password === 'string') {
      settings.admin_password = await hashPassword(settings.admin_password);
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
