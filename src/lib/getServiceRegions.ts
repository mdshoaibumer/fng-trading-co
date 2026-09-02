import { cache } from 'react';
import { getSettings } from './supabase';
import {
  DEFAULT_SERVICE_REGIONS,
  parseServiceRegions,
  type ServiceRegion,
} from './serviceRegions';

/**
 * The live service-region footprint, as edited in Admin → Regions.
 *
 * Reads the `service_regions` row through `getSettings()`, which is already
 * request-cached — so the layout, the page and any route handler that asks
 * share one database round trip. Falls back to the built-in list whenever the
 * row is missing or fails validation, which is what keeps the footer, globe
 * and JSON-LD populated on a fresh database.
 *
 * Server-only. Client Components get the same array through
 * `useServiceRegions()`, which the localized layout seeds from this.
 */
export const getServiceRegions = cache(async (): Promise<ServiceRegion[]> => {
  try {
    const settings = await getSettings();
    const parsed = parseServiceRegions(settings.service_regions);
    if (parsed) return parsed;
    if (settings.service_regions !== undefined) {
      console.warn('service_regions in settings failed validation — using the built-in list');
    }
  } catch (error) {
    console.error('Failed to read service_regions, using the built-in list:', error);
  }
  return [...DEFAULT_SERVICE_REGIONS];
});
