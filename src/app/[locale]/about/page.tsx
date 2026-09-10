import AboutPageClient from '@/components/pages/AboutPageClient';
import PageTransition from '@/components/ui/PageTransition';
import { SITE_URL } from '@/lib/siteContact';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { safeJsonLd } from '@/lib/safeJsonLd';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getTranslations({ locale, namespace: 'seo.about' });

  return buildPageMetadata({
    locale,
    path: '/about',
    title: seo('title'),
    description: seo('description'),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isAr = locale === 'ar';
  
  // Structured Data (JSON-LD)
  const websiteUrl = SITE_URL;
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'name': isAr ? 'من نحن | فيوتشر نيكست جين' : 'About Us | Future Next Gen',
    'description': isAr 
      ? 'تعرف على شركة FNG، المزود الرائد في السعودية لحلول طابعات HP مجددة للشركات، أحبار طابعات صديقة للبيئة.' 
      : 'Learn about Future Next Gen, Saudi Arabia\'s leading provider of refurbished HP printers and sustainable toners.',
    'url': `${websiteUrl}/${locale}/about`,
    'mainEntity': {
      '@type': 'Organization',
      'name': 'Future Next Gen (FNG)',
      'url': websiteUrl,
      'logo': `${websiteUrl}/FNG_LOGO.png`,
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': isAr ? 'الرئيسية' : 'Home',
        'item': `${websiteUrl}/${locale}`
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': isAr ? 'من نحن' : 'About Us',
        'item': `${websiteUrl}/${locale}/about`
      }
    ]
  };

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(aboutSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />
      <AboutPageClient locale={locale} />
    </PageTransition>
  );
}
