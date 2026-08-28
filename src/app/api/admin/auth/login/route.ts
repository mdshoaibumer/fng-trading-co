import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    // Fetch dynamic password from Supabase, fallback to env or default
    const { data: passData } = await supabaseAdmin
      .from('settings')
      .select('value')
      .eq('key', 'admin_password')
      .single();

    const validPassword = passData?.value || process.env.ADMIN_PASSWORD || 'admin123';

    if (password === validPassword) {
      const response = NextResponse.json({ success: true });
      
      // Set secure HTTP-only cookie
      // In production, secure should be true
      const isProduction = process.env.NODE_ENV === 'production';
      
      response.cookies.set('fng_session', 'authenticated', {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
