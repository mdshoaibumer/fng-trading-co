import { describe, it, expect } from 'vitest';
import { regionsPayloadSchema } from './serviceRegionsSchema';
import { DEFAULT_SERVICE_REGIONS } from './serviceRegions';

const region = (overrides: Record<string, unknown> = {}) => ({
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

const issues = (input: unknown): string[] => {
  const result = regionsPayloadSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
};

describe('regionsPayloadSchema', () => {
  it('accepts the built-in footprint', () => {
    const result = regionsPayloadSchema.safeParse({ regions: DEFAULT_SERVICE_REGIONS });
    expect(result.success).toBe(true);
  });

  it('normalises a lowercase code to uppercase', () => {
    const result = regionsPayloadSchema.safeParse({ regions: [region({ code: 'sa' })] });
    expect(result.success && result.data.regions[0].code).toBe('SA');
  });

  it('trims whitespace off text fields', () => {
    const result = regionsPayloadSchema.safeParse({ regions: [region({ nameEn: '  Oman  ' })] });
    expect(result.success && result.data.regions[0].nameEn).toBe('Oman');
  });

  it('requires at least one country', () => {
    expect(issues({ regions: [] }).length).toBeGreaterThan(0);
  });

  it('requires at least one office', () => {
    expect(issues({ regions: [region({ presence: 'market' })] }))
      .toContain('regions: At least one country must be marked as an office');
  });

  it('reports duplicate codes against the offending row', () => {
    expect(issues({ regions: [region(), region({ code: 'SA', nameEn: 'Copy' })] }))
      .toContain('regions.1.code: Duplicate country code SA');
  });

  it('rejects a three-letter code with a readable message', () => {
    expect(issues({ regions: [region({ code: 'SAU' })] }))
      .toContain('regions.0.code: Country code must be two letters');
  });

  it.each([
    ['latitude above 90', { hub: [90.1, 0] }],
    ['latitude below -90', { hub: [-90.1, 0] }],
    ['longitude above 180', { hub: [0, 180.1] }],
    ['longitude below -180', { hub: [0, -180.1] }],
    ['a coordinate sent as a string', { hub: ['24.71', 46.68] }],
    ['a hub with one element', { hub: [24.71] }],
    ['a hub with three elements', { hub: [24.71, 46.68, 1] }],
  ])('rejects %s', (_label, overrides) => {
    expect(issues({ regions: [region(overrides)] }).length).toBeGreaterThan(0);
  });

  it('rejects an unknown presence value', () => {
    expect(issues({ regions: [region({ presence: 'partner' })] }).length).toBeGreaterThan(0);
  });

  it('rejects blank required text', () => {
    expect(issues({ regions: [region({ hubAr: '   ' })] }).length).toBeGreaterThan(0);
  });

  it('rejects a payload that is not shaped like { regions: [...] }', () => {
    expect(issues([region()]).length).toBeGreaterThan(0);
    expect(issues({}).length).toBeGreaterThan(0);
  });
});
