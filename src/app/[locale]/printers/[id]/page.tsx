import { notFound } from 'next/navigation';
import { SITE_URL } from '@/lib/siteContact';
import ProductPageClient from '@/components/pages/ProductPageClient';
import { getProductById, getSettings } from '@/lib/supabase';
import type { Metadata } from 'next';
import { safeJsonLd } from '@/lib/safeJsonLd';
import { buildAlternates } from '@/lib/metadata';
import { DEFAULT_WHATSAPP_NUMBER, sanitizeWhatsappNumber } from '@/lib/whatsapp';
import PageTransition from '@/components/ui/PageTransition';

// Reads live product data from Supabase per request.
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;

  const p = await getProductById(id);

  if (!p) {
    return {
      title: { absolute: 'Product Not Found | Future Next Gen' },
    };
  }

  const name = p.name;
  const desc = locale === 'ar' ? p.desc_ar : p.desc_en;
  const image = p.images?.[0];

  return {
    title: {
      absolute: `${name} | ${locale === 'ar' ? 'طابعات HP المجددة معاً مع الحبر' : 'Certified Refurbished HP LaserJet'} | FNG`,
    },
    description: desc || '',
    alternates: buildAlternates(locale, `/printers/${id}`),
    openGraph: {
      title: `${name} | ${locale === 'ar' ? 'طابعة HP مجددة' : 'Certified Refurbished HP LaserJet'}`,
      description: desc || '',
      images: image ? [{ url: image }] : [],
      type: 'article',
    },
  };
}

export default async function PrinterProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  // Fetch printer data from Supabase
  const p = await getProductById(id);

  if (!p || p.id.startsWith('eq-')) {
    notFound();
  }

  // Map to frontend structure
  const printer = {
    id: p.id,
    name: p.name,
    descEn: p.desc_en,
    descAr: p.desc_ar,
    images: p.images || [],
    featuresEn: p.features_en || [],
    featuresAr: p.features_ar || [],
    specsEn: p.specs_en || {},
    specsAr: p.specs_ar || {},
    available: p.available
  };

  // Fetch WhatsApp number from settings
  const settings = await getSettings();
  const whatsapp = settings.contact?.whatsapp
    ? sanitizeWhatsappNumber(settings.contact.whatsapp)
    : DEFAULT_WHATSAPP_NUMBER;

  const isAr = locale === 'ar';
  const websiteUrl = SITE_URL;

  // Schemas
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': printer.name,
    'image': printer.images,
    'description': isAr ? printer.descAr : printer.descEn,
    'brand': {
      '@type': 'Brand',
      'name': 'HP'
    },
    'offers': {
      '@type': 'Offer',
      'url': `${websiteUrl}/${locale}/printers/${id}`,
      // Quote-based pricing — no public price. A literal 0.00 renders as "Free"
      // in rich results, so price/priceValidUntil are intentionally omitted.
      'priceCurrency': 'SAR',
      'itemCondition': 'https://schema.org/RefurbishedCondition',
      'availability': printer.available 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      'seller': {
        '@type': 'Organization',
        'name': 'Future Next Gen (FNG)'
      },
      'description': isAr 
        ? 'طابعة HP مجددة معتمدة مجانية عند الاشتراك في باقة أحبار إيكو إنكس.' 
        : 'Free certified refurbished HP LaserJet printer deployed with paid Eco Inks subscription.'
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
        'name': isAr ? 'الطابعات' : 'Printers',
        'item': `${websiteUrl}/${locale}/printers`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': printer.name,
        'item': `${websiteUrl}/${locale}/printers/${id}`
      }
    ]
  };

  return (
    <PageTransition>
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(productSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
        />
        <ProductPageClient product={printer} whatsapp={whatsapp} locale={locale} itemType="printer" />
      </>
    </PageTransition>
  );
}
