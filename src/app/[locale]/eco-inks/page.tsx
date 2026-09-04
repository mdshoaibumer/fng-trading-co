import { setRequestLocale, getTranslations } from 'next-intl/server';
import { SITE_URL } from '@/lib/siteContact';
import type { Metadata } from 'next';
import { safeJsonLd } from '@/lib/safeJsonLd';
import EcoInksHeroSection from '@/components/sections/EcoInksHeroSection';
import EcoInksInteractiveSection from '@/components/sections/EcoInksInteractiveSection';
import EcoInksLeafletSection from '@/components/sections/EcoInksLeafletSection';
import EcoInksSection from '@/components/sections/EcoInksSection';
import EcoInksSustainabilitySection from '@/components/sections/EcoInksSustainabilitySection';
import TonerProductsSection from '@/components/sections/TonerProductsSection';
import ContactSection from '@/components/sections/ContactSection';
import { buildAlternates } from '@/lib/metadata';
import PageTransition from '@/components/ui/PageTransition';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getTranslations({ locale, namespace: 'seo.ecoInks' });

  return {
    title: {
      absolute: seo('title'),
    },
    description: seo('description'),
    alternates: buildAlternates(locale, '/eco-inks'),
  };
}

export default async function EcoInksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isAr = locale === 'ar';
  const websiteUrl = SITE_URL;

  const productGreenSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': isAr ? 'حبر إيكو إنكس الأخضر (Eco Inks Green)' : 'EcoInks Green Toner',
    'image': `${websiteUrl}/toners/green/green-toner-set.png`,
    'description': isAr 
      ? 'خراطيش HP أصلية مُعاد تصنيعها باحترافية — تمر بعمليات تنظيف، فحص، وإعادة تعبئة بحبر حيوي مستدام.' 
      : 'Original HP cartridges professionally remanufactured — cleaned, inspected, refilled with bio-based toner, and tested to OEM specifications.',
    'brand': {
      '@type': 'Brand',
      'name': 'EcoInks'
    },
    'offers': {
      '@type': 'AggregateOffer',
      'priceCurrency': 'SAR',
      'lowPrice': '100.00',
      'highPrice': '500.00',
      'offerCount': '10',
      'seller': {
        '@type': 'Organization',
        'name': 'Future Next Gen (FNG)'
      }
    }
  };

  const productPremiumSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': isAr ? 'حبر إيكو إنكس بريميوم (Eco Inks Premium)' : 'EcoInks Premium Toner',
    'image': `${websiteUrl}/toners/premium/premium-toner-set.png`,
    'description': isAr 
      ? 'خراطيش حبر طابعات ليزر متوافقة جديدة بالكامل، مُصنعة بدقة لتطابق أداء خراطيش HP الأصلية.' 
      : 'Brand-new compatible cartridges manufactured to match HP originals. Engineered for high yield and consistent output.',
    'brand': {
      '@type': 'Brand',
      'name': 'EcoInks'
    },
    'offers': {
      '@type': 'AggregateOffer',
      'priceCurrency': 'SAR',
      'lowPrice': '80.00',
      'highPrice': '400.00',
      'offerCount': '10',
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
        'name': isAr ? 'أحبار إيكو' : 'Eco Inks',
        'item': `${websiteUrl}/${locale}/eco-inks`
      }
    ]
  };

  return (
    <PageTransition>
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(productGreenSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(productPremiumSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
        />
        <EcoInksHeroSection />
        <EcoInksInteractiveSection />
        <EcoInksLeafletSection />
        <EcoInksSection />
        <EcoInksSustainabilitySection />
        <TonerProductsSection />
        <ContactSection />
      </main>
    </PageTransition>
  );
}
