// Where FNG operates. The business no longer describes itself by Saudi
// cities (Riyadh, Jeddah, Dammam, Al Madinah) — it is set up across several
// countries, and this list is the single source of truth for that footprint.
//
// Everything that names a service area reads from here: the footer, the
// contact page's "Our Locations" cards, the JSON-LD `areaServed` fields, the
// AI assistant's system prompt, the contact-form country picker and the
// sourcing globe.
//
// The live list is EDITABLE FROM ADMIN → Regions, stored in the `settings`
// table under the `service_regions` key. The array below is the built-in
// fallback used when that row is absent or fails validation, so the site
// always has a sane footprint even against an empty or corrupted database.
// Server code reads the live list with `getServiceRegions()` (src/lib/
// getServiceRegions.ts); Client Components read it from `useServiceRegions()`.
//
// Kept framework-free (no React, no 'use client') so it can be imported from
// Server Components, Route Handlers and Client Components alike.

export interface ServiceRegion {
  /** ISO 3166-1 alpha-2, used for schema.org addressCountry and as a key. */
  code: string;
  nameEn: string;
  nameAr: string;
  /** Regional-indicator flag emoji, for compact "where we are" rows. */
  flag: string;
  /** Main hub in that country, shown on the contact page and the globe. */
  hubEn: string;
  hubAr: string;
  /** [latitude, longitude] of the hub — feeds the sourcing globe markers. */
  hub: [number, number];
  /**
   * 'office'  — FNG has a registered entity / office there.
   * 'market'  — actively served (delivery, installation, sourcing) without
   *             a standalone office.
   */
  presence: 'office' | 'market';
}

/**
 * Built-in footprint. Editing this file changes the fallback only — to change
 * what the live site shows, edit Admin → Regions.
 */
export const DEFAULT_SERVICE_REGIONS: readonly ServiceRegion[] = [
  { code: 'SA', nameEn: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', flag: '🇸🇦', hubEn: 'Riyadh (HQ)', hubAr: 'الرياض (المقر الرئيسي)', hub: [24.71, 46.68], presence: 'office' },
  { code: 'AE', nameEn: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة', flag: '🇦🇪', hubEn: 'Dubai', hubAr: 'دبي', hub: [25.20, 55.27], presence: 'office' },
  { code: 'CN', nameEn: 'China', nameAr: 'الصين', flag: '🇨🇳', hubEn: 'Guangzhou', hubAr: 'قوانغتشو', hub: [23.13, 113.26], presence: 'office' },
  { code: 'OM', nameEn: 'Oman', nameAr: 'سلطنة عُمان', flag: '🇴🇲', hubEn: 'Muscat', hubAr: 'مسقط', hub: [23.59, 58.41], presence: 'office' },
  { code: 'IN', nameEn: 'India', nameAr: 'الهند', flag: '🇮🇳', hubEn: 'Mumbai', hubAr: 'مومباي', hub: [19.08, 72.88], presence: 'market' },
];

/** Upper bound on a stored list — a guard against a runaway payload, not a business rule. */
export const MAX_SERVICE_REGIONS = 60;

const isFiniteInRange = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max;

const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

/**
 * Validates a value read from the database (or posted by the admin UI) into a
 * usable region list, or returns null if it can't be trusted.
 *
 * Every consumer of this data renders it directly, and two of them do more
 * than print a string: the globe plots `hub` as coordinates, and the contact
 * forms seed their country field from `regions[0]`. So this rejects the whole
 * payload rather than repairing it — a half-valid list would put a marker in
 * the ocean or leave a form with an empty country, both of which are worse
 * than falling back to the built-in list.
 */
export function parseServiceRegions(value: unknown): ServiceRegion[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_SERVICE_REGIONS) return null;

  const seen = new Set<string>();
  const out: ServiceRegion[] = [];

  for (const raw of value) {
    if (!raw || typeof raw !== 'object') return null;
    const r = raw as Record<string, unknown>;

    const code = typeof r.code === 'string' ? r.code.trim().toUpperCase() : '';
    if (!/^[A-Z]{2}$/.test(code) || seen.has(code)) return null;

    const hub = r.hub;
    if (!Array.isArray(hub) || hub.length !== 2) return null;
    const [lat, lng] = hub;
    if (!isFiniteInRange(lat, -90, 90) || !isFiniteInRange(lng, -180, 180)) return null;

    if (r.presence !== 'office' && r.presence !== 'market') return null;
    if (![r.nameEn, r.nameAr, r.flag, r.hubEn, r.hubAr].every(isNonEmptyString)) return null;

    seen.add(code);
    out.push({
      code,
      nameEn: (r.nameEn as string).trim(),
      nameAr: (r.nameAr as string).trim(),
      flag: (r.flag as string).trim(),
      hubEn: (r.hubEn as string).trim(),
      hubAr: (r.hubAr as string).trim(),
      hub: [lat, lng],
      presence: r.presence,
    });
  }

  return out;
}

/** Countries with a registered FNG entity or office. */
export function officeRegions(regions: readonly ServiceRegion[]): ServiceRegion[] {
  return regions.filter((r) => r.presence === 'office');
}

export function regionName(region: ServiceRegion, locale: string): string {
  return locale === 'ar' ? region.nameAr : region.nameEn;
}

export function regionHub(region: ServiceRegion, locale: string): string {
  return locale === 'ar' ? region.hubAr : region.hubEn;
}

/**
 * "Saudi Arabia, United Arab Emirates, China, Oman & 10 more markets" style
 * sentence for compact places (footer). Leads with the office countries.
 */
export function serviceRegionsSummary(regions: readonly ServiceRegion[], locale: string): string {
  const isAr = locale === 'ar';
  const offices = officeRegions(regions).map((r) => regionName(r, locale));
  const rest = regions.length - offices.length;
  const sep = isAr ? '، ' : ', ';
  const head = offices.join(sep);
  if (rest <= 0) return head;
  return isAr ? `${head} و${rest} أسواق أخرى` : `${head} & ${rest} more markets`;
}

/** Full list joined for prose (chat prompt, structured data descriptions). */
export function serviceRegionsList(regions: readonly ServiceRegion[], locale: string): string {
  const sep = locale === 'ar' ? '، ' : ', ';
  return regions.map((r) => regionName(r, locale)).join(sep);
}

/** schema.org `areaServed` value — one Country node per region. */
export function areaServedSchema(regions: readonly ServiceRegion[]) {
  return regions.map((r) => ({ '@type': 'Country', name: r.nameEn, identifier: r.code }));
}
