import { NextResponse } from 'next/server';
import { supabaseAdmin, type Product } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('printers')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Map back to camelCase for the frontend if needed, 
    // but the frontend is already using the JSON structure.
    // Exclude printer IDs, only return equipment IDs.
    const formatted = data.filter(p => p.id.startsWith('eq-')).map(p => ({
      id: p.id,
      name: p.name,
      descEn: p.desc_en,
      descAr: p.desc_ar,
      images: p.images,
      featuresEn: p.features_en,
      featuresAr: p.features_ar,
      specsEn: p.specs_en,
      specsAr: p.specs_ar,
      available: p.available
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Equipment GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch equipment' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const equipment: Product[] = await request.json();

    // Map back to snake_case for Supabase
    const formatted = equipment.map((p) => ({
      id: p.id,
      name: p.name,
      desc_en: p.descEn,
      desc_ar: p.descAr,
      images: p.images,
      features_en: p.featuresEn,
      features_ar: p.featuresAr,
      specs_en: p.specsEn,
      specs_ar: p.specsAr,
      available: p.available
    }));

    // Delete equipment that were removed from the UI. Do not delete printer IDs.
    const { data: existing } = await supabaseAdmin.from('printers').select('id');
    const existingIds = existing?.map(e => e.id) || [];
    const existingEquipmentIds = existingIds.filter(id => id.startsWith('eq-'));
    const newIds = formatted.map((p) => p.id);
    const idsToDelete = existingEquipmentIds.filter(id => !newIds.includes(id));

    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabaseAdmin.from('printers').delete().in('id', idsToDelete);
      if (deleteError) throw deleteError;
    }

    const { error } = await supabaseAdmin
      .from('printers')
      .upsert(formatted);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Equipment POST error:', error);
    return NextResponse.json({ error: 'Failed to update equipment' }, { status: 500 });
  }
}
