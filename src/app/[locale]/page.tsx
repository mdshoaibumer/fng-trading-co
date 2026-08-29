import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { safeJsonLd } from '@/lib/safeJsonLd';
import { cookies } from 'next/headers';
import EntryGate from '@/components/gate/EntryGate';
import { GATE_COOKIE } from '@/lib/entryGate';
import HeroSection from '@/components/sections/HeroSection';
import FreePrinterSection from '@/components/sections/FreePrinterSection';
import ProductCatalogSection from '@/components/sections/ProductCatalogSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import IndustriesSection from '@/components/sections/IndustriesSection';
import TrustSection from '@/components/sections/TrustSection';
import ContactSection from '@/components/sections/ContactSection';
import VideoDivider from '@/components/sections/VideoDivider';
import { getSettings, getProducts } from '@/lib/supabase';
import { buildAlternates } from '@/lib/metadata';

// Reads live settings (videos, contact info) from Supabase on every request.
export const dynamic = 'force-dynamic';

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
    alternates: buildAlternates(locale),
  };
}

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ gate?: string }>;
}) {
  const { locale } = await params;
  const { gate } = await searchParams;
  setRequestLocale(locale);

  const settings = await getSettings();
  const videos = settings.videos || { divider1: '', divider2: '' };
  const { products: printers, error: printersError } = await getProducts('printer');

  // Greet a visitor who hasn't picked a track yet, and re-open the chooser
  // whenever it is asked for explicitly with ?gate=1 — which is what the
  // Navbar's logo and Home link do. Printers and sourcing are run as separate
  // businesses with no cross-links, so the gate is the only route between
  // them; without the ?gate=1 escape hatch, picking one track would strand a
  // visitor there for the rest of the session.
  //
  // Arrivals that don't ask for it (a bookmark, an external link) still go
  // straight to the page once the cookie is set, rather than being made to
  // re-answer the chooser every time.
  const showGate = gate === '1' || (await cookies()).get(GATE_COOKIE)?.value !== '1';

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
        dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteSchema) }}
      />
      {showGate && <EntryGate />}
      <HeroSection />
      <ProductCatalogSection
        products={printers}
        error={printersError}
        isAr={isAr}
        basePath={`/${locale}/printers`}
        tag={isAr ? 'طابعاتنا المُجددة' : 'Refurbished Printers'}
        title={isAr ? 'طابعات HP مُجددة باحترافية' : 'Professionally Refurbished HP Printers'}
        subtitle={isAr
          ? 'كل طابعة يتم فحصها وتنظيفها وتجديدها باحترافية واختبارها لتعمل بمعايير المصنع. جودة HP بجزء بسيط من تكلفة الجديدة.'
          : 'Every printer is professionally inspected, cleaned, refurbished, and tested to factory standards. HP quality at a fraction of the new price.'}
      />
      <FreePrinterSection />
      <HowItWorksSection />
      <VideoDivider src={videos.divider1 || ''} />
      <IndustriesSection />
      <VideoDivider src={videos.divider2 || ''} />
      <TrustSection />
      <ContactSection />
    </main>
  );
}
