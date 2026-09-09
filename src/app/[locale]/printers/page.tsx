import { setRequestLocale, getTranslations } from 'next-intl/server';
import ProductCatalogSection from '@/components/sections/ProductCatalogSection';
import OperatingCountriesSection from '@/components/sections/OperatingCountriesSection';
import ContactSection from '@/components/sections/ContactSection';
import type { Metadata } from 'next';
import { buildAlternates } from '@/lib/metadata';
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

  return {
    title: {
      absolute: seo('title'),
    },
    description: seo('description'),
    alternates: buildAlternates(locale, '/printers'),
  };
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
        <OperatingCountriesSection />
        <ContactSection />
      </main>
    </PageTransition>
  );
}
