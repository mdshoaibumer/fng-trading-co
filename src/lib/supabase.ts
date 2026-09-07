import { createClient } from '@supabase/supabase-js';
import { cache } from 'react';
import dotenv from 'dotenv';

// Loads .env.local for the standalone `npx tsx` migrate CLI (which doesn't go
// through Next's env loading). In the Next runtime this is a harmless no-op —
// Next has already populated process.env, and the file isn't in the image.
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Ensure .env.local is configured.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : supabase;

// cache() dedupes the fetch within a single server request — the layout and
// the page both call getSettings(), and product pages call it several times.
export const getSettings = cache(async () => {
  const { data } = await supabaseAdmin.from('settings').select('*');
  const settings: Record<string, unknown> = {};
  data?.forEach(item => {
    // Never surface the admin password hash to callers. It's only read
    // server-side, but stripping it here guarantees it can't leak into an RSC
    // payload if the settings object is ever passed to a Client Component.
    if (item.key === 'admin_password') return;
    settings[item.key] = item.value;
  });
  return settings as {
    contact?: { whatsapp?: string; phone?: string; email?: string };
    ai_settings?: { welcome_message?: string; system_prompt?: string };
    videos?: { divider1?: string; divider2?: string };
    social_media?: { facebook?: string; instagram?: string; linkedin?: string; twitter?: string };
    seo?: { title?: string; description?: string };
    /**
     * The admin-edited service-region footprint. Deliberately `unknown`: it is
     * free-form JSON in the database and is only trustworthy once it has been
     * through `parseServiceRegions`, so typing it as ServiceRegion[] here would
     * hand callers a guarantee this function cannot make. Read it via
     * `getServiceRegions()` rather than touching it directly.
     */
    service_regions?: unknown;
  };
});

export interface PartEntry {
  nameEn: string;
  nameAr: string;
  models: string;
}

// The printer-parts catalog, keyed by category (e.g. "fuser", "pickup").
export type PartsData = Record<string, PartEntry[]>;

export interface Product {
  id: string;
  name: string;
  descEn: string;
  descAr: string;
  images: string[];
  featuresEn: string[];
  featuresAr: string[];
  specsEn: Record<string, string>;
  specsAr: Record<string, string>;
  available: boolean;
}

// Shared by both the printer and office-equipment catalogs — both live in
// the same `printers` table, distinguished only by an `eq-` id prefix.
//
// Returns `error: true` when the fetch itself failed, distinct from a
// successful fetch that simply found zero matching rows — callers need to
// tell "nothing to show" apart from "something broke" instead of collapsing
// both into an empty array.
export const getProducts = cache(async (kind: 'printer' | 'equipment'): Promise<{ products: Product[]; error: boolean }> => {
  const { data, error } = await supabaseAdmin
    .from('printers')
    .select('*')
    .order('created_at', { ascending: true });

  if (error || !data) return { products: [], error: true };

  const products = data
    .filter((p) => (kind === 'equipment' ? p.id.startsWith('eq-') : !p.id.startsWith('eq-')))
    .map((p) => ({
      id: p.id,
      name: p.name,
      descEn: p.desc_en,
      descAr: p.desc_ar,
      images: p.images || [],
      featuresEn: p.features_en || [],
      featuresAr: p.features_ar || [],
      specsEn: p.specs_en || {},
      specsAr: p.specs_ar || {},
      available: p.available,
    }));

  return { products, error: false };
});
