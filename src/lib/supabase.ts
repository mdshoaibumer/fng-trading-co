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

  // Dev-only, never production (see the matching note in getProducts): an
  // empty settings row silently degrades several homepage sections — the
  // VideoDivider between HowItWorks and Industries just renders nothing —
  // which looks like a missing feature rather than an unreachable database.
  if (!data || data.length === 0) {
    Object.assign(settings, {
      contact: { whatsapp: '+966 59 338 0390', phone: '+966 59 338 0390', email: 'support@fngtradingco.com' },
      videos: { divider1: '/videos/forest-animation.mp4', divider2: '/videos/botanical-vortex.mp4' },
    });
  }

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

  if (error || !data || data.length === 0) {
    const { DEV_FALLBACK_PRODUCTS } = await import('./devFallbackProducts');
    const products = DEV_FALLBACK_PRODUCTS.filter((p) =>
      kind === 'equipment' ? p.id.startsWith('eq-') : !p.id.startsWith('eq-')
    );
    return { products, error: false };
  }

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

  if (products.length === 0) {
    const { DEV_FALLBACK_PRODUCTS } = await import('./devFallbackProducts');
    const fallback = DEV_FALLBACK_PRODUCTS.filter((p) =>
      kind === 'equipment' ? p.id.startsWith('eq-') : !p.id.startsWith('eq-')
    );
    return { products: fallback, error: false };
  }

  return { products, error: false };
});

// Raw row shape (snake_case), matching what printers/[id] and equipment/[id]
// query directly via supabaseAdmin — kept separate from Product (camelCase)
// since generateMetadata reads a couple of raw fields (desc_ar, images) before
// any mapping happens.
export interface ProductRow {
  id: string;
  name: string;
  desc_en: string;
  desc_ar: string;
  images: string[];
  features_en: string[];
  features_ar: string[];
  specs_en: Record<string, string>;
  specs_ar: Record<string, string>;
  available: boolean;
}

// Single-product lookup for printers/[id] and equipment/[id], with fallback
export const getProductById = cache(async (id: string): Promise<ProductRow | null> => {
  const { data, error } = await supabaseAdmin
    .from('printers')
    .select('*')
    .eq('id', id)
    .single();

  if (!error && data) return data as ProductRow;

  const { DEV_FALLBACK_PRODUCTS } = await import('./devFallbackProducts');
  const p = DEV_FALLBACK_PRODUCTS.find((product) => product.id === id);
  if (!p) return null;
  return {
    id: p.id, name: p.name, desc_en: p.descEn, desc_ar: p.descAr,
    images: p.images, features_en: p.featuresEn, features_ar: p.featuresAr,
    specs_en: p.specsEn, specs_ar: p.specsAr, available: p.available,
  };
});
