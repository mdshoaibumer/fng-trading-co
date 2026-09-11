import { createClient } from '@supabase/supabase-js';
import { cache } from 'react';
import dotenv from 'dotenv';

// Loads .env.local for the standalone `npx tsx` migrate CLI (which doesn't go
// through Next's env loading). In the Next runtime this is a harmless no-op —
// Next has already populated process.env, and the file isn't in the image.
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials missing. Ensure environment variables are configured.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// cache() dedupes the fetch within a single server request — the layout and
// the page both call getSettings(), and product pages call it several times.
export const getSettings = cache(async () => {
  const settings: Record<string, unknown> = {};

  try {
    const { data } = await supabaseAdmin.from('settings').select('*');
    data?.forEach(item => {
      // Never surface the admin password hash to callers. It's only read
      // server-side, but stripping it here guarantees it can't leak into an RSC
      // payload if the settings object is ever passed to a Client Component.
      if (item.key === 'admin_password') return;
      settings[item.key] = item.value;
    });

    if (!data || data.length === 0) {
      Object.assign(settings, {
        contact: { whatsapp: '+966 59 338 0390', phone: '+966 59 338 0390', email: 'support@fngtradingco.com' },
      });
    }
  } catch (err) {
    console.warn('Could not fetch settings from DB, using fallback defaults:', err);
    Object.assign(settings, {
      contact: { whatsapp: '+966 59 338 0390', phone: '+966 59 338 0390', email: 'support@fngtradingco.com' },
    });
  }

  return settings as {
    contact?: { whatsapp?: string; phone?: string; email?: string };
    ai_settings?: { welcome_message?: string; welcome_message_ar?: string; system_prompt?: string };
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
// In production:
// - Query failure -> returns `{ products: [], error: true }` and logs technical error.
// - Empty catalog -> returns `{ products: [], error: false }` (renders EmptyState).
// - Active catalog -> returns `{ products, error: false }`.
//
// In development:
// - Falls back to DEV_FALLBACK_PRODUCTS if local Supabase is offline/empty.
export const getProducts = cache(async (kind: 'printer' | 'equipment'): Promise<{ products: Product[]; error: boolean }> => {
  const isDev = process.env.NODE_ENV === 'development';

  try {
    const { data, error } = await supabaseAdmin
      .from('printers')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error(`[getProducts] Supabase query failed for kind="${kind}":`, error);
      if (isDev) {
        console.warn('[getProducts] Dev mode: falling back to devFallbackProducts due to DB error');
        const { DEV_FALLBACK_PRODUCTS } = await import('./devFallbackProducts');
        const products = DEV_FALLBACK_PRODUCTS.filter((p) =>
          kind === 'equipment' ? p.id.startsWith('eq-') : !p.id.startsWith('eq-')
        );
        return { products, error: false };
      }
      return { products: [], error: true };
    }

    if (!data) {
      if (isDev) {
        const { DEV_FALLBACK_PRODUCTS } = await import('./devFallbackProducts');
        const products = DEV_FALLBACK_PRODUCTS.filter((p) =>
          kind === 'equipment' ? p.id.startsWith('eq-') : !p.id.startsWith('eq-')
        );
        return { products, error: false };
      }
      return { products: [], error: false };
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

    // In development mode only, if the database table is completely empty, populate fallback
    if (products.length === 0 && isDev) {
      const { DEV_FALLBACK_PRODUCTS } = await import('./devFallbackProducts');
      const fallback = DEV_FALLBACK_PRODUCTS.filter((p) =>
        kind === 'equipment' ? p.id.startsWith('eq-') : !p.id.startsWith('eq-')
      );
      return { products: fallback, error: false };
    }

    return { products, error: false };
  } catch (err) {
    console.error(`[getProducts] Unexpected exception for kind="${kind}":`, err);
    if (isDev) {
      console.warn('[getProducts] Dev mode: falling back to devFallbackProducts due to exception');
      const { DEV_FALLBACK_PRODUCTS } = await import('./devFallbackProducts');
      const products = DEV_FALLBACK_PRODUCTS.filter((p) =>
        kind === 'equipment' ? p.id.startsWith('eq-') : !p.id.startsWith('eq-')
      );
      return { products, error: false };
    }
    return { products: [], error: true };
  }
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

// Single-product lookup for printers/[id] and equipment/[id]
// In production: returns null on query failure or missing product.
// In development: falls back to DEV_FALLBACK_PRODUCTS for offline local testing.
export const getProductById = cache(async (id: string): Promise<ProductRow | null> => {
  const isDev = process.env.NODE_ENV === 'development';

  try {
    const { data, error } = await supabaseAdmin
      .from('printers')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) return data as ProductRow;
    if (error && error.code !== 'PGRST116') {
      console.error(`[getProductById] Supabase error for id="${id}":`, error);
    }
  } catch (err) {
    console.error(`[getProductById] Query exception for id="${id}":`, err);
  }

  if (isDev) {
    const { DEV_FALLBACK_PRODUCTS } = await import('./devFallbackProducts');
    const p = DEV_FALLBACK_PRODUCTS.find((product) => product.id === id);
    if (!p) return null;
    return {
      id: p.id, name: p.name, desc_en: p.descEn, desc_ar: p.descAr,
      images: p.images, features_en: p.featuresEn, features_ar: p.featuresAr,
      specs_en: p.specsEn, specs_ar: p.specsAr, available: p.available,
    };
  }

  return null;
});
