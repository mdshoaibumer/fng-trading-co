import { NextResponse } from 'next/server';
import { supabaseAdmin, type Product } from '@/lib/supabase';
import { revalidatePublicSite } from '@/lib/revalidate';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('printers')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Map back to camelCase for the frontend if needed, 
    // but the frontend is already using the JSON structure.
    // Let's ensure compatibility. Exclude equipment IDs.
    const formatted = (data || []).filter((p) => !p.id?.startsWith('eq-')).map((p) => ({
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
    console.error('Printers GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch printers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const printers: Product[] = await request.json();

    if (!Array.isArray(printers)) {
      return NextResponse.json({ error: 'Expected an array of printers' }, { status: 400 });
    }

    // An empty payload almost always means the client saved before the catalog
    // finished loading (a failed GET leaves the list empty). Never mass-delete
    // the catalog on it — bail out as a no-op rather than wiping every row.
    if (printers.length === 0) {
      return NextResponse.json({ success: true, skipped: 'empty payload' });
    }

    // Map back to snake_case for Supabase
    const formatted = printers.map((p) => ({
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

    // Upsert FIRST, then delete removed rows — if the upsert fails, the old
    // rows are still intact instead of being deleted against a failed write.
    const { error: upsertError } = await supabaseAdmin.from('printers').upsert(formatted);
    if (upsertError) throw upsertError;

    // Delete printers that were removed from the UI. Do not delete equipment IDs.
    const { data: existing } = await supabaseAdmin.from('printers').select('id');
    const existingPrinterIds = (existing?.map(e => e.id) || []).filter(id => !id.startsWith('eq-'));
    const newIds = formatted.map((p) => p.id);
    const idsToDelete = existingPrinterIds.filter(id => !newIds.includes(id));

    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabaseAdmin.from('printers').delete().in('id', idsToDelete);
      if (deleteError) throw deleteError;
    }

    revalidatePublicSite();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Printers POST error:', error);
    return NextResponse.json({ error: 'Failed to update printers' }, { status: 500 });
  }
}
