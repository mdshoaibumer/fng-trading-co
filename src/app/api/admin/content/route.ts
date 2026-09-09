import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePublicSite } from '@/lib/revalidate';
import { deepMerge, isPlainObject } from '@/lib/deepMerge';
import enMessages from '../../../../../messages/en.json';
import arMessages from '../../../../../messages/ar.json';

export async function GET() {
  let enOverrides: Record<string, unknown> = {};
  let arOverrides: Record<string, unknown> = {};

  try {
    const { data: enData } = await supabaseAdmin.from('settings').select('value').eq('key', 'content_en').single();
    if (isPlainObject(enData?.value)) enOverrides = enData.value;
  } catch (err) {
    console.warn('Could not fetch content_en overrides from DB:', err);
  }

  try {
    const { data: arData } = await supabaseAdmin.from('settings').select('value').eq('key', 'content_ar').single();
    if (isPlainObject(arData?.value)) arOverrides = arData.value;
  } catch (err) {
    console.warn('Could not fetch content_ar overrides from DB:', err);
  }

  // The editor shows the same thing the site renders: the shipped
  // messages/*.json with any saved edits layered on top.
  const en = deepMerge(enMessages as Record<string, unknown>, enOverrides);
  const ar = deepMerge(arMessages as Record<string, unknown>, arOverrides);
  return NextResponse.json({ en, ar });
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
