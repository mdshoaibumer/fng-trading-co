import { supabaseAdmin } from './supabase';

/** Every lead type the CRM understands — the contact API validates against this. */
export const LEAD_TYPES = ['contact', 'printer_request', 'printer', 'eco_inks', 'printer_parts', 'office_equipment', 'sourcing', 'general'] as const;

export interface InquiryRow {
  type: (typeof LEAD_TYPES)[number];
  name: string;
  company: string;
  phone: string;
  email: string | null;
  industry?: string | null;
  message: string | null;
  city: string | null;
  /** Country the lead is in — new column (supabase/migrations/…_inquiries_country.sql). */
  country: string | null;
  quantity: string | null;
  status: 'new';
}

/**
 * Inserts a lead. The `country` column was added after the site went live;
 * if the production database has not had that migration applied yet,
 * PostgREST rejects the insert ("Could not find the 'country' column …").
 * Losing a lead over a missing column is not acceptable, so in that case
 * the row is re-inserted without it and the country is folded into `city`
 * ("Riyadh, Saudi Arabia") so nothing the visitor typed is dropped.
 */
export async function insertInquiry(row: InquiryRow): Promise<{ error: { message: string } | null; degraded: boolean }> {
  const { error } = await supabaseAdmin.from('inquiries').insert(row);
  if (!error) return { error: null, degraded: false };

  if (/country/i.test(error.message)) {
    const { country, ...rest } = row;
    const fallback = {
      ...rest,
      city: [rest.city, country].filter(Boolean).join(', ') || null,
    };
    const retry = await supabaseAdmin.from('inquiries').insert(fallback);
    if (!retry.error) {
      console.warn('inquiries.country column missing — apply supabase/migrations/00000000000002_inquiries_country.sql. Stored country inside city for now.');
    }
    return { error: retry.error, degraded: true };
  }

  return { error, degraded: false };
}
