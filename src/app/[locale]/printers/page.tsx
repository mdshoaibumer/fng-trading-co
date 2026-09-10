import { setRequestLocale, getTranslations } from 'next-intl/server';
import ProductCatalogSection from '@/components/sections/ProductCatalogSection';
import EnterpriseBOQConfigurator from '@/components/sections/EnterpriseBOQConfigurator';
import OperatingCountriesSection from '@/components/sections/OperatingCountriesSection';
import ContactSection from '@/components/sections/ContactSection';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/metadata';
import { getProducts } from '@/lib/supabase';
import PageTransition from '@/components/ui/PageTransition';

// Reads the live printer catalog from Supabase on every request, matching the
// office-equipment catalog page.
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getTranslations({ locale, namespace: 'seo.printers' });

  return buildPageMetadata({
    locale,
    path: '/printers',
    title: seo('title'),
    description: seo('description'),
  });
}

export default async function PrintersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === 'ar';
  const { products: printers, error: printersError } = await getProducts('printer');

  return (
    <PageTransition>
      <main>
        <ProductCatalogSection
          asH1={true}
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
        <EnterpriseBOQConfigurator isAr={isAr} locale={locale} />
        <OperatingCountriesSection />
        <ContactSection />
      </main>
    </PageTransition>
  );
}
