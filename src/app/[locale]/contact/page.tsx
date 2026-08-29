import ContactPageClient from '@/components/pages/ContactPageClient';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { safeJsonLd } from '@/lib/safeJsonLd';
import { getSettings } from '@/lib/supabase';
import { buildAlternates } from '@/lib/metadata';
import { SITE_EMAIL } from '@/lib/siteContact';

// Reads live contact settings from Supabase on every request.
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getTranslations({ locale, namespace: 'seo.contact' });

  return {
    title: {
      absolute: seo('title'),
    },
    description: seo('description'),
    alternates: buildAlternates(locale, '/contact'),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const settings = await getSettings();
  const isAr = locale === 'ar';
  
  // Structured Data (JSON-LD)
  const websiteUrl = 'https://fngtradingco.com';
  
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': isAr ? 'شركة فيوتشر نيكست جين (FNG)' : 'Future Next Gen (FNG)',
    'image': `${websiteUrl}/FNG_LOGO.png`,
    'url': websiteUrl,
    'telephone': settings.contact?.phone || '+966-59-338-0390',
    'email': SITE_EMAIL,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': isAr ? 'طريق مكة المكرمة الفرعي، حي السليمانية' : 'Makkah Al Mukarramah Branch Rd, Al Sulaimaniyah',
      'addressLocality': isAr ? 'الرياض' : 'Riyadh',
      'addressRegion': isAr ? 'منطقة الرياض' : 'Riyadh Province',
      'postalCode': '12621',
      'addressCountry': 'SA'
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday'
      ],
      'opens': '09:00',
      'closes': '18:00'
    },
    'areaServed': [
      { '@type': 'AdministrativeArea', 'name': 'Riyadh' },
      { '@type': 'AdministrativeArea', 'name': 'Jeddah' },
      { '@type': 'AdministrativeArea', 'name': 'Dammam' },
      { '@type': 'AdministrativeArea', 'name': 'Al Madinah' }
    ],
    'priceRange': '$$',
    'description': isAr 
      ? 'مورد طابعات HP المجددة و خراطيش الحبر الصديقة للبيئة للشركات والمؤسسات في السعودية.' 
      : 'Refurbished HP printer supplier and eco-friendly toner provider serving businesses across Saudi Arabia.'
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
        'name': isAr ? 'تواصل معنا' : 'Contact Us',
        'item': `${websiteUrl}/${locale}/contact`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />
      <ContactPageClient />
    </>
  );
}
