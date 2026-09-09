import { setRequestLocale, getTranslations } from 'next-intl/server';
import { SITE_URL } from '@/lib/siteContact';
import type { Metadata } from 'next';
import SourcingHeroSection from '@/components/sections/sourcing/SourcingHeroSection';
import SourcingProcessSection from '@/components/sections/sourcing/SourcingProcessSection';
import SourcingCategoriesSection from '@/components/sections/sourcing/SourcingCategoriesSection';
import SourcingSystemsSection from '@/components/sections/sourcing/SourcingSystemsSection';
import SourcingServicesSection from '@/components/sections/sourcing/SourcingServicesSection';
import SourcingWhySection from '@/components/sections/sourcing/SourcingWhySection';
import OperatingCountriesSection from '@/components/sections/OperatingCountriesSection';
import ContactSection from '@/components/sections/ContactSection';
import { buildAlternates } from '@/lib/metadata';
import { safeJsonLd } from '@/lib/safeJsonLd';
import { areaServedSchema } from '@/lib/serviceRegions';
import { getServiceRegions } from '@/lib/getServiceRegions';
import PageTransition from '@/components/ui/PageTransition';

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
  const serviceRegions = await getServiceRegions();
  const t = await getTranslations({ locale, namespace: 'sourcingHero' });
  const isAr = locale === 'ar';
  const websiteUrl = SITE_URL;

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
    'areaServed': areaServedSchema(serviceRegions),
    'url': `${websiteUrl}/${locale}/sourcing`,
  };

  return (
    <PageTransition>
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
        <SourcingSystemsSection />
        <SourcingServicesSection />
        <SourcingWhySection />
        <OperatingCountriesSection />
        <ContactSection />
      </main>
    </PageTransition>
  );
}
