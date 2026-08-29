import { notFound } from 'next/navigation';
import { SITE_URL } from '@/lib/siteContact';
import ProductPageClient from '@/components/pages/ProductPageClient';
import { supabaseAdmin, getSettings } from '@/lib/supabase';
import type { Metadata } from 'next';
import { safeJsonLd } from '@/lib/safeJsonLd';
import { buildAlternates } from '@/lib/metadata';
import { DEFAULT_WHATSAPP_NUMBER, sanitizeWhatsappNumber } from '@/lib/whatsapp';

// Reads live product data from Supabase per request.
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  
  const { data: p } = await supabaseAdmin
    .from('printers')
    .select('*')
    .eq('id', id)
    .single();

  if (!p) {
    return {
      title: 'Equipment Not Found | Future Next Gen',
    };
  }

  const name = p.name;
  const desc = locale === 'ar' ? p.desc_ar : p.desc_en;
  const image = p.images?.[0];

  return {
    title: {
      absolute: `${name} | ${locale === 'ar' ? 'أجهزة مكتبية مجددة معتمدة' : 'Certified Refurbished Office Equipment'} | FNG`,
    },
    description: desc || '',
    alternates: buildAlternates(locale, `/equipment/${id}`),
    openGraph: {
      title: `${name} | ${locale === 'ar' ? 'أجهزة مكتبية مجددة' : 'Certified Refurbished Office Equipment'}`,
      description: desc || '',
      images: image ? [{ url: image }] : [],
      type: 'article',
    },
  };
}

export default async function EquipmentProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  
  // Fetch equipment data from Supabase (starts with eq-)
  const { data: p } = await supabaseAdmin
    .from('printers')
    .select('*')
    .eq('id', id)
    .single();

  if (!p || !p.id.startsWith('eq-')) {
    notFound();
  }

  // Map to frontend structure
  const equipment = {
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
    'name': equipment.name,
    'image': equipment.images,
    'description': isAr ? equipment.descAr : equipment.descEn,
    'brand': {
      '@type': 'Brand',
      'name': 'FNG'
    },
    'offers': {
      '@type': 'Offer',
      'url': `${websiteUrl}/${locale}/equipment/${id}`,
      'priceCurrency': 'SAR',
      'price': '0.00',
      'priceValidUntil': '2030-12-31',
      'itemCondition': 'https://schema.org/RefurbishedCondition',
      'availability': equipment.available 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      'seller': {
        '@type': 'Organization',
        'name': 'Future Next Gen (FNG)'
      },
      'description': isAr 
        ? 'طابعة/جهاز مكتبي مجدد معتمد ومشمول بالصيانة مجاناً عند الاشتراك في باقة أحبار إيكو إنكس.' 
        : 'Free certified refurbished office equipment deployed with paid Eco Inks subscription.'
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
        'name': isAr ? 'الأجهزة المكتبية' : 'Office Equipment',
        'item': `${websiteUrl}/${locale}/equipment`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': equipment.name,
        'item': `${websiteUrl}/${locale}/equipment/${id}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />
      <ProductPageClient product={equipment} whatsapp={whatsapp} locale={locale} itemType="equipment" />
    </>
  );
}
