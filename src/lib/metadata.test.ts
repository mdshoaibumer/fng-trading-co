import { describe, it, expect } from 'vitest';
import { buildAlternates, buildPageMetadata } from './metadata';

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

describe('buildPageMetadata', () => {
  it('builds complete OpenGraph, Twitter and hreflang metadata for a page', () => {
    const meta = buildPageMetadata({
      locale: 'en',
      path: '/printers',
      title: 'Professionally Refurbished HP Printers',
      description: 'Factory inspected HP LaserJet fleet printers.',
      image: '/printers/hero.png',
    });

    expect(meta.title).toEqual({ absolute: 'Professionally Refurbished HP Printers' });
    expect(meta.description).toBe('Factory inspected HP LaserJet fleet printers.');
    expect(meta.alternates).toEqual({
      canonical: '/en/printers',
      languages: { ar: '/ar/printers', en: '/en/printers' },
    });
    expect(meta.openGraph?.title).toBe('Professionally Refurbished HP Printers');
    expect(meta.openGraph?.url).toBe('https://fngtradingco.com/en/printers');
    expect(meta.openGraph?.locale).toBe('en_US');
    expect(meta.openGraph?.images).toEqual([
      { url: 'https://fngtradingco.com/printers/hero.png', alt: 'Professionally Refurbished HP Printers' }
    ]);
  });

  it('correctly handles Arabic locale and default fallback OG image', () => {
    const meta = buildPageMetadata({
      locale: 'ar',
      path: '/eco-inks',
      title: 'أحبار بيئية مستدامة',
      description: 'خراطيش حبر ليزر معتمدة ومطابقة للمواصفات.',
    });

    expect(meta.openGraph?.locale).toBe('ar_SA');
    expect(meta.openGraph?.siteName).toBe('فيوتشر ست جين (FNG)');
    expect(meta.openGraph?.images).toEqual([
      { url: 'https://fngtradingco.com/FNG_LOGO.png', alt: 'أحبار بيئية مستدامة' }
    ]);
  });
});
