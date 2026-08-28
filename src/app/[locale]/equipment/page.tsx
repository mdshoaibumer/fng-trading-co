import { setRequestLocale } from 'next-intl/server';
import EquipmentCatalogSection from '@/components/sections/EquipmentCatalogSection';
import ContactSection from '@/components/sections/ContactSection';

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
