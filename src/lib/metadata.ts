import type { Metadata } from 'next';
import { SITE_URL } from './siteContact';

export interface PageMetadataOptions {
  locale: string;
  path: string;
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
}

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

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  image = '/FNG_LOGO.png',
  type = 'website',
}: PageMetadataOptions): Metadata {
  const isAr = locale === 'ar';
  const ogImageUrl = image.startsWith('http') ? image : `${SITE_URL}${image.startsWith('/') ? '' : '/'}${image}`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}${path}`,
      siteName: isAr ? 'فيوتشر ست جين (FNG)' : 'Future Next Gen (FNG)',
      locale: isAr ? 'ar_SA' : 'en_US',
      type,
      images: [
        {
          url: ogImageUrl,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
