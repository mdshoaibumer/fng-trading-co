'use client';

import { createContext, useContext } from 'react';
import { DEFAULT_SERVICE_REGIONS, type ServiceRegion } from '@/lib/serviceRegions';

/**
 * Carries the admin-edited service-region list from the server into the Client
 * Components that render it — the footer, the contact forms, the contact
 * page's location cards and the sourcing globe.
 *
 * A context rather than props because those four sit at unrelated depths under
 * the localized layout, and threading the same array through every component
 * between them would be noise. The layout is a Server Component that already
 * awaits `getSettings()`, so seeding this costs no extra database work.
 *
 * The default value is the built-in list, so a component rendered outside the
 * provider (a test, a future standalone route) still gets a usable footprint
 * instead of an empty array.
 */
const ServiceRegionsContext = createContext<readonly ServiceRegion[]>(DEFAULT_SERVICE_REGIONS);

export function ServiceRegionsProvider({
  regions,
  children,
}: {
  regions: readonly ServiceRegion[];
  children: React.ReactNode;
}) {
  return (
    <ServiceRegionsContext.Provider value={regions.length > 0 ? regions : DEFAULT_SERVICE_REGIONS}>
      {children}
    </ServiceRegionsContext.Provider>
  );
}

/**
 * The live region list. Never empty — callers index `[0]` to seed form state,
 * so both the provider and the context default guarantee at least one entry.
 */
export function useServiceRegions(): readonly ServiceRegion[] {
  return useContext(ServiceRegionsContext);
}
