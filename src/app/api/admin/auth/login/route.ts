import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createSessionToken, hashPassword, verifyPassword } from '@/lib/adminSession';

export async function POST(request: Request) {
  try {
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
