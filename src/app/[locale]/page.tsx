import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import FreePrinterSection from '@/components/sections/FreePrinterSection';
import FreePrintersCatalogSection from '@/components/sections/FreePrintersCatalogSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import IndustriesSection from '@/components/sections/IndustriesSection';
import TrustSection from '@/components/sections/TrustSection';
import ContactSection from '@/components/sections/ContactSection';
import VideoDivider from '@/components/sections/VideoDivider';
import { getSettings } from '@/lib/supabase';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: {
      absolute: t('title'),
    },
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const settings = await getSettings();
  const videos = settings.videos || { divider1: '', divider2: '' };

  const isAr = locale === 'ar';
  const websiteUrl = 'https://fngtradingco.com';

  // Structured Data (JSON-LD)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': isAr ? 'فيوتشر نيكست جين' : 'Future Next Gen',
    'alternateName': 'FNG',
    'url': websiteUrl,
    'logo': `${websiteUrl}/FNG_LOGO.png`,
    'description': isAr 
      ? 'المورد الرائد في المملكة العربية السعودية لطابعات HP المجددة، أحبار طابعات صديقة للبيئة، وقطع غيار طابعات أصلية.' 
      : 'Saudi Arabia\'s leading supplier of refurbished HP printers, eco-friendly toners, and genuine printer parts.',
    'foundingDate': '2021',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': isAr ? 'طريق مكة المكرمة الفرعي، حي السليمانية' : 'Makkah Al Mukarramah Branch Rd, Al Sulaimaniyah',
      'addressLocality': isAr ? 'الرياض' : 'Riyadh',
      'addressRegion': isAr ? 'منطقة الرياض' : 'Riyadh Province',
      'postalCode': '12621',
      'addressCountry': 'SA'
    },
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': settings.contact?.phone || '+966-59-338-0390',
      'contactType': 'customer service',
      'availableLanguage': ['Arabic', 'English']
    },
    'sameAs': [
      `${websiteUrl}/ar`,
      `${websiteUrl}/en`
    ]
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': isAr ? 'شركة فيوتشر نيكست جين (FNG)' : 'Future Next Gen (FNG)',
    'image': `${websiteUrl}/FNG_LOGO.png`,
    'url': websiteUrl,
    'telephone': settings.contact?.phone || '+966-59-338-0390',
    'email': 'Support@fngtradingco.com',
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
    'areaServed': ['Riyadh', 'Jeddah', 'Dammam', 'Al Madinah'],
    'priceRange': '$$',
    'description': isAr 
      ? 'توريد طابعات HP مجددة ومستلزمات أحبار طابعات ليزر للشركات والمؤسسات.' 
      : 'Refurbished HP printer supplier and eco-friendly toner provider serving businesses across Saudi Arabia.'
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Future Next Gen (FNG)',
    'url': websiteUrl,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${websiteUrl}/${locale}?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <HeroSection />
      <FreePrintersCatalogSection />
      <FreePrinterSection />
      <HowItWorksSection />
      <VideoDivider src={videos.divider1} />
      <IndustriesSection />
      <VideoDivider src={videos.divider2} />
      <TrustSection />
      <ContactSection />
    </main>
  );
}
