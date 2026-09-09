import { NextResponse } from 'next/server';
import { supabaseAdmin, type PartsData } from '@/lib/supabase';
import { revalidatePublicSite } from '@/lib/revalidate';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('parts')
      .select('*');

    if (error) throw error;

    // Reconstruct the category-based object
    const result: PartsData = {};
    data.forEach(item => {
      if (!result[item.category]) result[item.category] = [];
      result[item.category].push({
        nameEn: item.name_en,
        nameAr: item.name_ar,
        models: item.models
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    // Dev-only, never production (see the matching note in
    // src/lib/supabase.ts) — without a real Supabase project locally, this
    // route otherwise always 500s and the parts catalog only ever shows its
    // error state, making it impossible to visually QA.
    if (process.env.NODE_ENV === 'development') {
      const { DEV_FALLBACK_PARTS } = await import('@/lib/devFallbackParts');
      return NextResponse.json(DEV_FALLBACK_PARTS);
    }
    console.error('Parts GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch parts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const partsData: PartsData = await request.json();

    // Flatten and map for Supabase
    const flattened: { category: string; name_en: string; name_ar: string; models: string }[] = [];
    Object.entries(partsData).forEach(([category, items]) => {
      items.forEach((item) => {
        flattened.push({
          category,
          name_en: item.nameEn,
          name_ar: item.nameAr,
          models: item.models
        });
      });
    });

    // An empty payload almost always means the client saved before parts
    // finished loading (a failed GET leaves an empty object). Never wipe every
    // part on it — bail out as a no-op. (insert([]) semantics vary across
    // PostgREST versions, so this also avoids the "id not in (0)" delete-all.)
    if (flattened.length === 0) {
      return NextResponse.json({ success: true, skipped: 'empty payload' });
    }

    // Insert the new rows first, then delete the old ones — if the insert
    // fails partway through, the table still has the previous data instead
    // of being left empty (the old delete-then-insert order could do that).
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('parts')
      .insert(flattened)
      .select('id');

    if (insertError) throw insertError;

    const newIds = (inserted || []).map(row => row.id);
    const { error: deleteError } = await supabaseAdmin
      .from('parts')
      .delete()
      .not('id', 'in', `(${newIds.join(',') || '0'})`);

    if (deleteError) throw deleteError;

    revalidatePublicSite();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Parts POST error:', error);
    return NextResponse.json({ error: 'Failed to update parts' }, { status: 500 });
  }
}
