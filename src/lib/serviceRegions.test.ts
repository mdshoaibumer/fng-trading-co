import { describe, it, expect } from 'vitest';
import {
  DEFAULT_SERVICE_REGIONS,
  MAX_SERVICE_REGIONS,
  parseServiceRegions,
  officeRegions,
  serviceRegionsSummary,
  serviceRegionsList,
  areaServedSchema,
  type ServiceRegion,
} from './serviceRegions';

const valid = (overrides: Partial<ServiceRegion> = {}): ServiceRegion => ({
  code: 'SA',
  nameEn: 'Saudi Arabia',
  nameAr: 'السعودية',
  flag: '🇸🇦',
  hubEn: 'Riyadh',
  hubAr: 'الرياض',
  hub: [24.71, 46.68],
  presence: 'office',
  ...overrides,
});

describe('parseServiceRegions', () => {
  it('accepts a well-formed list', () => {
    const parsed = parseServiceRegions([valid(), valid({ code: 'AE', nameEn: 'UAE', presence: 'market' })]);
    expect(parsed).toHaveLength(2);
    expect(parsed?.[1].code).toBe('AE');
  });

  it('round-trips the built-in list', () => {
    expect(parseServiceRegions(DEFAULT_SERVICE_REGIONS)).toEqual([...DEFAULT_SERVICE_REGIONS]);
  });

  it('uppercases and trims the country code', () => {
    expect(parseServiceRegions([valid({ code: ' sa ' })])?.[0].code).toBe('SA');
  });

  it('trims surrounding whitespace on text fields', () => {
    const parsed = parseServiceRegions([valid({ nameEn: '  Oman  ', hubEn: ' Muscat ' })]);
    expect(parsed?.[0].nameEn).toBe('Oman');
    expect(parsed?.[0].hubEn).toBe('Muscat');
  });

  it.each([
    ['not an array', { code: 'SA' }],
    ['an empty list', []],
    ['a null entry', [null]],
    ['a one-letter code', [valid({ code: 'S' })]],
    ['a non-alphabetic code', [valid({ code: '1A' })]],
    ['a blank name', [valid({ nameEn: '   ' })]],
    ['a missing Arabic name', [valid({ nameAr: '' })]],
    ['an unknown presence', [valid({ presence: 'partner' as unknown as 'office' })]],
    ['a latitude past the pole', [valid({ hub: [91, 0] })]],
    ['a longitude past the meridian', [valid({ hub: [0, 181] })]],
    ['a non-numeric coordinate', [valid({ hub: ['24.71', 46.68] as unknown as [number, number] })]],
    ['a NaN coordinate', [valid({ hub: [Number.NaN, 46.68] })]],
    ['a one-element hub', [valid({ hub: [24.71] as unknown as [number, number] })]],
  ])('rejects %s', (_label, input) => {
    expect(parseServiceRegions(input)).toBeNull();
  });

  it('rejects duplicate country codes, case-insensitively', () => {
    expect(parseServiceRegions([valid({ code: 'SA' }), valid({ code: 'sa' })])).toBeNull();
  });

  it('rejects a list longer than the cap', () => {
    const tooMany = Array.from({ length: MAX_SERVICE_REGIONS + 1 }, (_, i) =>
      valid({ code: `A${String.fromCharCode(65 + (i % 26))}` })
    );
    expect(parseServiceRegions(tooMany)).toBeNull();
  });

  it('rejects the whole payload when a single entry is bad', () => {
    // Deliberate: a partially-repaired list would leave a globe marker in the
    // ocean rather than falling back to the built-in footprint.
    expect(parseServiceRegions([valid(), valid({ code: 'AE', hub: [999, 0] })])).toBeNull();
  });
});

describe('region helpers', () => {
  const regions = [
    valid({ code: 'SA', nameEn: 'Saudi Arabia', nameAr: 'السعودية', presence: 'office' }),
    valid({ code: 'AE', nameEn: 'UAE', nameAr: 'الإمارات', presence: 'office' }),
    valid({ code: 'QA', nameEn: 'Qatar', nameAr: 'قطر', presence: 'market' }),
  ];

  it('officeRegions keeps only countries with an office', () => {
    expect(officeRegions(regions).map((r) => r.code)).toEqual(['SA', 'AE']);
  });

  it('serviceRegionsList joins every country in the requested locale', () => {
    expect(serviceRegionsList(regions, 'en')).toBe('Saudi Arabia, UAE, Qatar');
    expect(serviceRegionsList(regions, 'ar')).toBe('السعودية، الإمارات، قطر');
  });

  it('serviceRegionsSummary leads with offices and counts the rest', () => {
    expect(serviceRegionsSummary(regions, 'en')).toBe('Saudi Arabia, UAE & 1 more markets');
  });

  it('serviceRegionsSummary omits the tail when every country has an office', () => {
    expect(serviceRegionsSummary(regions.slice(0, 2), 'en')).toBe('Saudi Arabia, UAE');
  });

  it('areaServedSchema emits one Country node per region', () => {
    expect(areaServedSchema(regions)).toEqual([
      { '@type': 'Country', name: 'Saudi Arabia', identifier: 'SA' },
      { '@type': 'Country', name: 'UAE', identifier: 'AE' },
      { '@type': 'Country', name: 'Qatar', identifier: 'QA' },
    ]);
  });
});
