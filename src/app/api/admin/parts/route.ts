import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('parts')
      .select('*');

    if (error) throw error;

    // Reconstruct the category-based object
    const result: Record<string, any[]> = {};
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
    console.error('Parts GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch parts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const partsData = await request.json();
    
    // Flatten and map for Supabase
    const flattened: any[] = [];
    Object.entries(partsData).forEach(([category, items]: [string, any]) => {
      items.forEach((item: any) => {
        flattened.push({
          category,
          name_en: item.nameEn,
          name_ar: item.nameAr,
          models: item.models
        });
      });
    });

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Parts POST error:', error);
    return NextResponse.json({ error: 'Failed to update parts' }, { status: 500 });
  }
}
