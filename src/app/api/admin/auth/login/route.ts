import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createSessionToken, hashPassword, verifyPassword } from '@/lib/adminSession';
import { rateLimit, globalRateLimit, getClientIp, tooManyRequests } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    // Per-IP limit (useful when the client isn't spoofing headers) plus a
    // global cap that ignores the claimed IP entirely — there's only one
    // legitimate admin, so a generous global ceiling stops a brute-force
    // run even from an attacker sending a fresh X-Forwarded-For value on
    // every request, which would otherwise reset the per-IP bucket each time.
    const perIp = rateLimit(`login:${getClientIp(request)}`, 5, 5 * 60 * 1000);
    if (!perIp.allowed) return tooManyRequests(perIp.retryAfterSeconds);

    const global = globalRateLimit('login', 20, 15 * 60 * 1000);
    if (!global.allowed) return tooManyRequests(global.retryAfterSeconds);

    const body = await request.json();
    const { password } = body;

    // Fetch dynamic password from Supabase, fallback to env var. No hardcoded default.
    const { data: passData } = await supabaseAdmin
      .from('settings')
      .select('value')
      .eq('key', 'admin_password')
      .single();

    const storedPassword: string | undefined = passData?.value || process.env.ADMIN_PASSWORD;

    if (!storedPassword) {
      console.error('Admin login attempted with no admin_password configured (DB or ADMIN_PASSWORD env)');
      return NextResponse.json({ error: 'Admin login is not configured' }, { status: 500 });
    }

    const { valid, isLegacyPlaintext } = await verifyPassword(password, storedPassword);

    if (!valid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Transparently upgrade a legacy plaintext password to a hash on next successful login.
    if (isLegacyPlaintext && passData) {
      const hashed = await hashPassword(password);
      await supabaseAdmin.from('settings').upsert({ key: 'admin_password', value: hashed });
    }

    const response = NextResponse.json({ success: true });
    const isProduction = process.env.NODE_ENV === 'production';

    response.cookies.set('fng_session', await createSessionToken(), {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
