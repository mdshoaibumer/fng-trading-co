import { getTranslations, setRequestLocale } from 'next-intl/server';
import ProductCatalogSection from '@/components/sections/ProductCatalogSection';
import ContactSection from '@/components/sections/ContactSection';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/metadata';
import { getProducts } from '@/lib/supabase';
import PageTransition from '@/components/ui/PageTransition';

// Reads the live product catalog from Supabase on every request.
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getTranslations({ locale, namespace: 'seo.equipment' });

  return buildPageMetadata({
    locale,
    path: '/equipment',
    title: seo('title'),
    description: seo('description'),
  });
}

export default async function EquipmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === 'ar';
  const { products: equipment, error: equipmentError } = await getProducts('equipment');

  return (
    <PageTransition>
      <main>
        <ProductCatalogSection
          asH1={true}
          products={equipment}
          error={equipmentError}
          isAr={isAr}
          basePath={`/${locale}/equipment`}
          tag={isAr ? 'تجهيزات مكتبية مُجددة' : 'Refurbished Office Equipment'}
          title={isAr ? 'تجهيزات مكتبية مُجددة باحترافية' : 'Professionally Refurbished Office Equipment'}
          subtitle={isAr
            ? 'تجهيز مكتبي عند الطلب إلى جانب أسطول طابعاتك — كل قطعة مفحوصة ومجددة ومختبرة. أخبرنا بما تحتاجه عبر نموذج الطلب أدناه وسنوفره لك.'
            : 'Office fit-out on request, alongside your printer fleet — every item inspected, refurbished and tested. Tell us what you need in the form below and we’ll source it.'}
        />
        <ContactSection />
      </main>
    </PageTransition>
  );
}
