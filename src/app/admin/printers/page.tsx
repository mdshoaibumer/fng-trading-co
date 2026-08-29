'use client';

import ProductCatalogAdmin, { type ProductCatalogConfig } from '@/components/admin/ProductCatalogAdmin';

const COMMON_FEATURES_EN = [
  "Fully inspected & tested",
  "Vibrant Color Output",
  "OEM-grade components",
  "Factory-spec restoration",
  "High-volume trays",
  "Enterprise security",
  "Certified refurbished",
  "Wireless & duplex",
  "Quality guaranteed"
];

const COMMON_FEATURES_AR = [
  "مفحوصة ومختبرة بالكامل",
  "ألوان نابضة بالحياة",
  "مكونات بمعايير OEM",
  "استعادة بمواصفات المصنع",
  "أدراج عالية السعة",
  "أمان مؤسسي",
  "مُجددة معتمدة",
  "لاسلكية ومزدوجة",
  "جودة مضمونة"
];

const config: ProductCatalogConfig = {
  endpoint: 'printers',
  title: 'Printer Catalog',
  subtitle: 'Manage refurbished HP printers, descriptions, specs, and availability.',
  addLabel: 'Add New Printer',
  editAria: 'Edit printer',
  deleteAria: 'Delete printer',
  emptyText: 'No printers yet. Click "Add New Printer" to create your first listing.',
  deleteConfirm: 'Are you sure you want to remove this printer?',
  loadingText: 'Loading printer catalog...',
  toasts: {
    loadError: 'Failed to load printers. Check your connection and refresh.',
    saveSuccess: 'Printers updated successfully!',
    saveError: 'Failed to save printers. Please try again.',
    saveException: 'Error saving printers.',
  },
  presetFeaturesEn: COMMON_FEATURES_EN,
  presetFeaturesAr: COMMON_FEATURES_AR,
  makeNewItem: () => ({
    id: `hp-${crypto.randomUUID()}`,
    name: 'New HP Printer',
    descEn: 'Product description goes here...',
    descAr: 'وصف المنتج هنا...',
    featuresEn: ['High Quality'],
    featuresAr: ['جودة عالية'],
    images: ['/placeholder.png'],
    specsEn: { 'Print Speed': '30 ppm' },
    specsAr: { 'سرعة الطباعة': '٣٠ صفحة' },
    available: true,
  }),
};

export default function AdminPrintersPage() {
  return <ProductCatalogAdmin config={config} />;
}
