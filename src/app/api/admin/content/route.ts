import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePublicSite } from '@/lib/revalidate';
import { deepMerge, isPlainObject } from '@/lib/deepMerge';
import enMessages from '../../../../../messages/en.json';
import arMessages from '../../../../../messages/ar.json';

export async function GET() {
  try {
    const { data: enData } = await supabaseAdmin.from('settings').select('value').eq('key', 'content_en').single();
    const { data: arData } = await supabaseAdmin.from('settings').select('value').eq('key', 'content_ar').single();

    // The editor shows the same thing the site renders: the shipped
    // messages/*.json with any saved edits layered on top. Before this, a
    // fresh database (no content_* rows) produced an empty editor.
    const en = deepMerge(enMessages as Record<string, unknown>, isPlainObject(enData?.value) ? enData.value : {});
    const ar = deepMerge(arMessages as Record<string, unknown>, isPlainObject(arData?.value) ? arData.value : {});
    return NextResponse.json({ en, ar });
  } catch (error) {
    console.error('Failed to read translations from DB:', error);
    return NextResponse.json({ error: 'Failed to read translations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { en, ar } = await request.json();

    if (!isPlainObject(en) && !isPlainObject(ar)) {
      return NextResponse.json({ error: 'Expected { en, ar } translation objects' }, { status: 400 });
    }

    if (isPlainObject(en)) {
      await supabaseAdmin.from('settings').upsert({
        key: 'content_en',
        value: en
      });
    }
    
    if (isPlainObject(ar)) {
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
