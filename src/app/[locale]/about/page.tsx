import AboutPageClient from '@/components/pages/AboutPageClient';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getTranslations({ locale, namespace: 'seo.about' });

  return {
    title: {
      absolute: seo('title'),
    },
    description: seo('description'),
    alternates: {
      canonical: `/${locale}/about`,
    },
  };
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
  const websiteUrl = 'https://fngtradingco.com';
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AboutPageClient />
    </>
  );
}
