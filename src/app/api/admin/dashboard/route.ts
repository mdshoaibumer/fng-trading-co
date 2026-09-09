import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // 1. Fetch total leads (inquiries)
    const { count: leadsCount, error: leadsError } = await supabaseAdmin
      .from('inquiries')
      .select('*', { count: 'exact', head: true });

    if (leadsError) throw leadsError;

    // 2. Fetch total printers and equipment
    const { data: allPrinters, error: printersError } = await supabaseAdmin
      .from('printers')
      .select('id');

    if (printersError) throw printersError;

    const printersCount = (allPrinters || []).filter((p) => !p.id.startsWith('eq-')).length;
    const equipmentCount = (allPrinters || []).filter((p) => p.id.startsWith('eq-')).length;

    // 3. Fetch total parts
    const { count: partsCount, error: partsError } = await supabaseAdmin
      .from('parts')
      .select('*', { count: 'exact', head: true });

    if (partsError) throw partsError;

    // 4. Fetch recent leads (latest 5)
    const { data: recentLeads, error: recentLeadsError } = await supabaseAdmin
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentLeadsError) throw recentLeadsError;

    return NextResponse.json({
      stats: {
        totalLeads: leadsCount || 0,
        printers: printersCount || 0,
        equipment: equipmentCount || 0,
        parts: partsCount || 0,
      },
      recentLeads: recentLeads || []
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
