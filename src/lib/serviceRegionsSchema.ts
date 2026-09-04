import { z } from 'zod';
import { MAX_SERVICE_REGIONS } from './serviceRegions';

/**
 * Validation for the Admin → Regions save payload, used by
 * POST /api/admin/regions.
 *
 * Kept out of the route module so it can be unit-tested directly: the route
 * itself is only reachable behind an admin session, and this is the check that
 * stops a malformed footprint from reaching the database in the first place.
 * `parseServiceRegions` in serviceRegions.ts is the matching guard on the read
 * side — this one reports *why* a payload was rejected so the admin UI can say
 * so, while that one simply falls back to the built-in list.
 */

const name = (max: number) => z.string().trim().min(1).max(max);

export const regionSchema = z.object({
  // Stored uppercase so it can key translations and schema.org identifiers
  // regardless of how it was typed.
  code: z.string().trim().regex(/^[A-Za-z]{2}$/, 'Country code must be two letters')
    .transform((v) => v.toUpperCase()),
  nameEn: name(80),
  nameAr: name(80),
  flag: name(16),
  hubEn: name(80),
  hubAr: name(80),
  // Latitude then longitude. Range-checked because these are plotted directly
  // on the sourcing globe — an out-of-range pair puts a marker nowhere.
  hub: z.tuple([
    z.number().finite().min(-90).max(90),
    z.number().finite().min(-180).max(180),
  ]),
  presence: z.enum(['office', 'market']),
});

export const regionsPayloadSchema = z.object({
  regions: z.array(regionSchema).min(1).max(MAX_SERVICE_REGIONS),
}).superRefine((val, ctx) => {
  const seen = new Set<string>();
  val.regions.forEach((r, i) => {
    if (seen.has(r.code)) {
      ctx.addIssue({
        code: 'custom',
        path: ['regions', i, 'code'],
        message: `Duplicate country code ${r.code}`,
      });
    }
    seen.add(r.code);
  });
  // The contact forms seed their country field from the first entry and the
  // globe hangs every market route off the first office, so a list with no
  // office at all would leave both without an anchor.
  if (!val.regions.some((r) => r.presence === 'office')) {
    ctx.addIssue({
      code: 'custom',
      path: ['regions'],
      message: 'At least one country must be marked as an office',
    });
  }
});
