import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePublicSite } from '@/lib/revalidate';

export async function GET() {
  try {
    const { data: enData } = await supabaseAdmin.from('settings').select('value').eq('key', 'content_en').single();
    const { data: arData } = await supabaseAdmin.from('settings').select('value').eq('key', 'content_ar').single();
    
    return NextResponse.json({
      en: enData?.value || {},
      ar: arData?.value || {}
    });
  } catch (error) {
    console.error('Failed to read translations from DB:', error);
    return NextResponse.json({ error: 'Failed to read translations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { en, ar } = await request.json();
    
    if (en) {
      await supabaseAdmin.from('settings').upsert({
        key: 'content_en',
        value: en
      });
    }
    
    if (ar) {
      await supabaseAdmin.from('settings').upsert({
        key: 'content_ar',
        value: ar
      });
    }

    // Content lives in the static prerendered pages' translations, so refresh
    // them (and the layout) or edits would only show after a redeploy.
    revalidatePublicSite();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update translations to DB:', error);
    return NextResponse.json({ error: 'Failed to update translations' }, { status: 500 });
  }
}
