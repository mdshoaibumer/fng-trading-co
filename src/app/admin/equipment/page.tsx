'use client';

import ProductCatalogAdmin, { type ProductCatalogConfig } from '@/components/admin/ProductCatalogAdmin';

const COMMON_FEATURES_EN = [
  "Ergonomic Design",
  "Lumbar Support",
  "Adjustable Height",
  "HD Display",
  "Energy Efficient",
  "Like-new Condition",
  "Tested & Certified",
  "Premium Materials",
  "1-Year Warranty"
];

const COMMON_FEATURES_AR = [
  "تصميم مريح",
  "دعم أسفل الظهر",
  "ارتفاع قابل للتعديل",
  "شاشة عالية الدقة",
  "موفر للطاقة",
  "بحالة كالجديد",
  "مفحوص ومعتمد",
  "مواد عالية الجودة",
  "ضمان لمدة عام"
];

const config: ProductCatalogConfig = {
  endpoint: 'equipment',
  title: 'Office Equipment Catalog',
  subtitle: 'Manage refurbished office equipment like chairs, monitors, and more.',
  addLabel: 'Add New Equipment',
  editAria: 'Edit equipment',
  deleteAria: 'Delete equipment',
  emptyText: 'No equipment yet. Click "Add New Equipment" to create your first listing.',
  deleteConfirm: 'Are you sure you want to remove this item?',
  loadingText: 'Loading equipment catalog...',
  toasts: {
    loadError: 'Failed to load equipment. Check your connection and refresh.',
    saveSuccess: 'Equipment updated successfully!',
    saveError: 'Failed to save equipment. Please try again.',
    saveException: 'Error saving equipment.',
  },
  presetFeaturesEn: COMMON_FEATURES_EN,
  presetFeaturesAr: COMMON_FEATURES_AR,
  makeNewItem: () => ({
    id: `eq-${Date.now()}`,
    name: 'New Office Equipment',
    descEn: 'Product description goes here...',
    descAr: 'وصف المنتج هنا...',
    featuresEn: ['Ergonomic Design'],
    featuresAr: ['تصميم مريح'],
    images: ['/placeholder.png'],
    specsEn: { 'Material': 'Ergonomic Mesh' },
    specsAr: { 'المادة': 'شبك مريح' },
    available: true,
  }),
};

export default function AdminEquipmentPage() {
  return <ProductCatalogAdmin config={config} />;
}
