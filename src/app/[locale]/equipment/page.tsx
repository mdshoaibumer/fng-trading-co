import { getTranslations, setRequestLocale } from 'next-intl/server';
import EquipmentCatalogSection from '@/components/sections/EquipmentCatalogSection';
import ContactSection from '@/components/sections/ContactSection';
import type { Metadata } from 'next';

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
    alternates: {
      canonical: `/${locale}/equipment`,
    },
  };
}

export default async function EquipmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <EquipmentCatalogSection />
      <ContactSection />
    </main>
  );
}
