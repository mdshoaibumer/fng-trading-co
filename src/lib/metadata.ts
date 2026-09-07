/**
 * Every page's `generateMetadata` sets its own `alternates` object, which
 * fully replaces (not merges with) the root layout's `alternates.languages` —
 * so without this, no page on the site ever emits an hreflang tag. Use this
 * everywhere instead of a bare `{ canonical }` literal.
 */
export function buildAlternates(locale: string, path: string = '') {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      ar: `/ar${path}`,
      en: `/en${path}`,
    },
  };
}
