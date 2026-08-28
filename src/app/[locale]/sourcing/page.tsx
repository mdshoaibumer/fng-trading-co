import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import SourcingHeroSection from '@/components/sections/sourcing/SourcingHeroSection';
import SourcingProcessSection from '@/components/sections/sourcing/SourcingProcessSection';
import SourcingCategoriesSection from '@/components/sections/sourcing/SourcingCategoriesSection';
import SourcingServicesSection from '@/components/sections/sourcing/SourcingServicesSection';
import SourcingWhySection from '@/components/sections/sourcing/SourcingWhySection';
import ContactSection from '@/components/sections/ContactSection';
import { buildAlternates } from '@/lib/metadata';
import { safeJsonLd } from '@/lib/safeJsonLd';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getTranslations({ locale, namespace: 'seo.sourcing' });
  return {
    title: {
      absolute: seo('title'),
    },
    description: seo('description'),
    alternates: buildAlternates(locale, '/sourcing'),
  };
}

export default async function SourcingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'sourcingHero' });
  const isAr = locale === 'ar';
  const websiteUrl = 'https://fngtradingco.com';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': isAr ? 'الرئيسية' : 'Home', 'item': `${websiteUrl}/${locale}` },
      { '@type': 'ListItem', 'position': 2, 'name': t('kicker'), 'item': `${websiteUrl}/${locale}/sourcing` },
    ],
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': t('kicker'),
    'description': t('subtitle'),
    'provider': {
      '@type': 'Organization',
      'name': 'Future Next Gen',
      'url': websiteUrl,
    },
    'areaServed': {
      '@type': 'Country',
      'name': 'Saudi Arabia',
    },
    'url': `${websiteUrl}/${locale}/sourcing`,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(serviceSchema) }}
      />
      <SourcingHeroSection />
      <SourcingProcessSection />
      <SourcingCategoriesSection />
      <SourcingServicesSection />
      <SourcingWhySection />
      <ContactSection />
    </main>
  );
}
