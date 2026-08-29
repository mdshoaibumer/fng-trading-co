import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

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

export async function getSettings() {
  const { data } = await supabaseAdmin.from('settings').select('*');
  const settings: Record<string, unknown> = {};
  data?.forEach(item => {
    settings[item.key] = item.value;
  });
  return settings as {
    contact?: { whatsapp?: string; phone?: string; email?: string };
    ai_settings?: { welcome_message?: string; system_prompt?: string };
    videos?: { divider1?: string; divider2?: string };
    social_media?: { facebook?: string; instagram?: string; linkedin?: string; twitter?: string };
    seo?: { title?: string; description?: string };
  };
}

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
export async function getProducts(kind: 'printer' | 'equipment'): Promise<{ products: Product[]; error: boolean }> {
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
}
