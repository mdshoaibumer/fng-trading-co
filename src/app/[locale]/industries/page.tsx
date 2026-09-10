import IndustriesPageClient from '@/components/pages/IndustriesPageClient';
import { SITE_URL } from '@/lib/siteContact';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { safeJsonLd } from '@/lib/safeJsonLd';
import { buildPageMetadata } from '@/lib/metadata';
import PageTransition from '@/components/ui/PageTransition';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getTranslations({ locale, namespace: 'seo.industries' });

  return buildPageMetadata({
    locale,
    path: '/industries',
    title: seo('title'),
    description: seo('description'),
  });
}

export default async function IndustriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isAr = locale === 'ar';
  
  // Structured Data (JSON-LD)
  const websiteUrl = SITE_URL;

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
        'name': isAr ? 'القطاعات' : 'Industries We Serve',
        'item': `${websiteUrl}/${locale}/industries`
      }
    ]
  };

  return (
    <PageTransition>
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
        />
        <IndustriesPageClient locale={locale} />
      </>
    </PageTransition>
  );
}
