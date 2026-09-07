import { describe, it, expect } from 'vitest';
import { buildAlternates } from './metadata';

describe('buildAlternates', () => {
  it('builds a canonical + both-language hreflang set for the homepage', () => {
    expect(buildAlternates('en')).toEqual({
      canonical: '/en',
      languages: { ar: '/ar', en: '/en' },
    });
  });

  it('builds a canonical + both-language hreflang set for a nested path', () => {
    expect(buildAlternates('ar', '/sourcing')).toEqual({
      canonical: '/ar/sourcing',
      languages: { ar: '/ar/sourcing', en: '/en/sourcing' },
    });
  });

  // This is the actual bug this helper exists to prevent: every page must
  // emit `languages` for BOTH locales, regardless of which locale is
  // currently being rendered — otherwise hreflang tags silently vanish.
  it('always includes both locales in `languages`, not just the current one', () => {
    const result = buildAlternates('en', '/printers/hp-m428fdw');
    expect(result.languages.ar).toBe('/ar/printers/hp-m428fdw');
    expect(result.languages.en).toBe('/en/printers/hp-m428fdw');
  });
});
