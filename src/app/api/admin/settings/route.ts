import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { hashPassword } from '@/lib/adminSession';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('settings')
      .select('*');

    if (error) throw error;

    // Convert array back to object
    const result: Record<string, any> = {};
    data.forEach(item => {
      // Don't send the password back to the frontend for security!
      if (item.key !== 'admin_password') {
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
    
    // Filter out empty password
    if (settings.admin_password === '') {
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
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings POST error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
