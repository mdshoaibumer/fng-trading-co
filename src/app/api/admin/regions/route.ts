import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePublicSite } from '@/lib/revalidate';
import { getServiceRegions } from '@/lib/getServiceRegions';
import { DEFAULT_SERVICE_REGIONS } from '@/lib/serviceRegions';
import { regionsPayloadSchema } from '@/lib/serviceRegionsSchema';

/**
 * The service-region footprint edited in Admin → Regions and stored in the
 * `settings` table under `service_regions`.
 *
 * GET is public (see PUBLIC_GET_ROUTES in src/proxy.ts) — this is the same
 * country list already printed in the footer, so there is nothing to withhold,
 * and the admin UI loads it through the same path the public site does.
 * POST goes through the usual admin session check in the proxy.
 */

export async function GET() {
  try {
    // Returns the same list the public site renders: the stored row when it is
    // valid, the built-in list otherwise. The admin UI therefore opens showing
    // exactly what visitors see, even before anything has ever been saved.
    const regions = await getServiceRegions();
    return NextResponse.json({ regions, defaults: DEFAULT_SERVICE_REGIONS });
  } catch (error) {
    console.error('Regions GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch regions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const parsed = regionsPayloadSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid regions payload',
          issues: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
        },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('settings')
      .upsert({ key: 'service_regions', value: parsed.data.regions });

    if (error) throw error;

    // The footprint appears in the footer on every page, the contact page's
    // location cards and three sets of JSON-LD — refresh the static pages so
    // it changes everywhere without a redeploy.
    revalidatePublicSite();

    return NextResponse.json({ success: true, count: parsed.data.regions.length });
  } catch (error) {
    console.error('Regions POST error:', error);
    return NextResponse.json({ error: 'Failed to update regions' }, { status: 500 });
  }
}
