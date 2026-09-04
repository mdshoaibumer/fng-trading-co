import { getTranslations, setRequestLocale } from 'next-intl/server';
import ProductCatalogSection from '@/components/sections/ProductCatalogSection';
import ContactSection from '@/components/sections/ContactSection';
import type { Metadata } from 'next';
import { buildAlternates } from '@/lib/metadata';
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

  return {
    title: {
      absolute: seo('title'),
    },
    description: seo('description'),
    alternates: buildAlternates(locale, '/equipment'),
  };
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
          products={equipment}
          error={equipmentError}
          isAr={isAr}
          basePath={`/${locale}/equipment`}
          tag={isAr ? 'تجهيزات مكتبية مُجددة' : 'Refurbished Office Equipment'}
          title={isAr ? 'تجهيزات مكتبية مُجددة باحترافية' : 'Professionally Refurbished Office Equipment'}
          subtitle={isAr
            ? 'كل قطعة يتم فحصها وتنظيفها وتجديدها باحترافية واختبارها لتعمل بمعايير المصنع. كراسي ومكاتب وشاشات وحواسيب بحالة الجديد.'
            : 'Every item is professionally inspected, cleaned, refurbished, and tested to factory standards. Chairs, desks, monitors & computers in like-new condition.'}
        />
        <ContactSection />
      </main>
    </PageTransition>
  );
}
