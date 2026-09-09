import { setRequestLocale, getTranslations } from 'next-intl/server';
import { SITE_URL } from '@/lib/siteContact';
import type { Metadata } from 'next';
import { safeJsonLd } from '@/lib/safeJsonLd';
import PrinterPartsHeroSection from '@/components/sections/PrinterPartsHeroSection';
import InteractivePrinterExploded from '@/components/ui/InteractivePrinterExploded';
import PrinterPartsCatalogSection from '@/components/sections/PrinterPartsCatalogSection';
import MaintenanceTeaser from '@/components/sections/MaintenanceTeaser';
import ContactSection from '@/components/sections/ContactSection';
import { buildAlternates } from '@/lib/metadata';
import PageTransition from '@/components/ui/PageTransition';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getTranslations({ locale, namespace: 'seo.printerParts' });

  return {
    title: {
      absolute: seo('title'),
    },
    description: seo('description'),
    alternates: buildAlternates(locale, '/printer-parts'),
  };
}

export default async function PrinterPartsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isAr = locale === 'ar';
  const websiteUrl = SITE_URL;

  const partsCatalogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': isAr ? 'كتالوج قطع غيار طابعات HP' : 'HP Printer Parts Catalog',
    'image': `${websiteUrl}/printer-parts-hero.jpeg`,
    'description': isAr 
      ? 'كتالوج شامل لقطع غيار طابعات HP LaserJet الأصلية والمتوافقة مثل وحدات التثبيت الحراري، أسطوانات التغذية، وأحزمة النقل.' 
      : 'Comprehensive catalog of genuine and compatible HP LaserJet printer parts including fusers, maintenance kits, rollers, and formatting boards.',
    'brand': {
      '@type': 'Brand',
      'name': 'HP'
    },
    'offers': {
      '@type': 'AggregateOffer',
      'priceCurrency': 'SAR',
      'lowPrice': '20.00',
      'highPrice': '1200.00',
      'offerCount': '50',
      'seller': {
        '@type': 'Organization',
        'name': 'Future Next Gen (FNG)'
      }
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
        'name': isAr ? 'قطع غيار الطابعات' : 'Printer Parts Catalog',
        'item': `${websiteUrl}/${locale}/printer-parts`
      }
    ]
  };

  return (
    <PageTransition>
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(partsCatalogSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
        />
        <PrinterPartsHeroSection locale={locale} />
        <InteractivePrinterExploded isAr={isAr} locale={locale} />
        <PrinterPartsCatalogSection />
        <MaintenanceTeaser />
        <ContactSection />
      </main>
    </PageTransition>
  );
}
