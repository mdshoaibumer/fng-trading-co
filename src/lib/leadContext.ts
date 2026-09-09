import { useSyncExternalStore, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

export type InquiryCategory = 'printer' | 'eco_inks' | 'printer_parts' | 'office_equipment' | 'sourcing' | 'general';

export interface LeadInquiryContext {
  category: InquiryCategory;
  badgeEn: string;
  badgeAr: string;
  messageEn: string;
  messageAr: string;
  quantityLabelEn: string;
  quantityLabelAr: string;
  quantityOptions: string[];
  quantity?: string;
  sourceType: 'product' | 'part' | 'boq' | 'sourcing' | 'eco_inks' | 'equipment';
}

export const CATEGORY_CONFIG: Record<InquiryCategory, {
  labelEn: string;
  labelAr: string;
  quantityLabelEn: string;
  quantityLabelAr: string;
  options: string[];
  defaultMessageEn: string;
  defaultMessageAr: string;
  badgeEn: string;
  badgeAr: string;
}> = {
  printer: {
    labelEn: 'Refurbished Printers',
    labelAr: 'طابعات مُجددة',
    quantityLabelEn: 'Number of Printers Needed',
    quantityLabelAr: 'عدد طابعات HP المطلوبة',
    options: ['1', '2', '3', '5', '10', '20', '50+'],
    defaultMessageEn: 'Inquiry for HP refurbished printers: Please provide availability, warranty details, and B2B volume pricing.',
    defaultMessageAr: 'استفسار عن طابعات HP المجددة: نرجو موافاتنا ببيانات التوافر والضمان وتفاصيل تسعير الكميات.',
    badgeEn: 'Printer Fleet Inquiry',
    badgeAr: 'استفسار أسطول طابعات',
  },
  eco_inks: {
    labelEn: 'Eco Inks & Toners',
    labelAr: 'أحبار إيكو',
    quantityLabelEn: 'Estimated Cartridges / Sets Needed',
    quantityLabelAr: 'عدد الخراطيش أو الباقات المطلوبة',
    options: ['1 Set', '2-5 Sets', '5-10 Sets', '10-25 Sets', '25+ Sets'],
    defaultMessageEn: 'Inquiry for Eco Inks: Please provide cartridge volume pricing, monthly subscription options, and printer compatibility.',
    defaultMessageAr: 'طلب تسعير أحبار إيكو: نرجو تزويدنا بأسعار الكميات وباقات الاشتراك والتوافق مع الطابعات.',
    badgeEn: 'Eco-Friendly Toner Inquiry',
    badgeAr: 'طلب أحبار إيكو الصديقة للبيئة',
  },
  printer_parts: {
    labelEn: 'Printer Parts',
    labelAr: 'قطع غيار طابعات',
    quantityLabelEn: 'Number of Spare Parts Required',
    quantityLabelAr: 'عدد قطع الغيار المطلوبة',
    options: ['1', '2', '3', '5', '10', '20+'],
    defaultMessageEn: 'Spare part procurement request: Please share availability, OEM/refurbished options, and delivery timeframe.',
    defaultMessageAr: 'طلب توريد قطع غيار: نرجو إفادتنا بالتوافر وخيارات القطع وفترة التوصيل.',
    badgeEn: 'Printer Spare Parts Request',
    badgeAr: 'طلب قطع غيار طابعات',
  },
  office_equipment: {
    labelEn: 'Office Equipment',
    labelAr: 'أجهزة وأثاث مكتبي',
    quantityLabelEn: 'Number of Units / Workstations Needed',
    quantityLabelAr: 'عدد الوحدات أو محطات العمل المطلوبة',
    options: ['1', '2', '3', '5', '10', '25', '50+'],
    defaultMessageEn: 'Inquiry for Office Equipment: Please provide corporate B2B pricing, delivery schedule, and warranty.',
    defaultMessageAr: 'طلب تسعير تجهيزات وأثاث مكتبي: نرجو تزويدنا بأسعار الشركات وتفاصيل التوريد والتركيب والضمان.',
    badgeEn: 'Office Equipment Quote',
    badgeAr: 'طلب تسعير أجهزة وأثاث مكتبي',
  },
  sourcing: {
    labelEn: 'Global Sourcing',
    labelAr: 'التوريد العالمي',
    quantityLabelEn: 'Estimated Order Quantity / Volume',
    quantityLabelAr: 'الكمية التقديرية للطلب',
    options: ['100-500 Units', '500-2,000 Units', '2,000-10,000 Units', '10,000+ Units'],
    defaultMessageEn: 'Cross-border B2B electronics & equipment sourcing inquiry from Guangzhou Hub.',
    defaultMessageAr: 'طلب استفسار عن خدمات التوريد التجاري المباشر للإلكترونيات والأجهزة عبر مركز كوانزو.',
    badgeEn: 'Cross-Border Sourcing Inquiry',
    badgeAr: 'توريد تجاري عبر مركز كوانزو',
  },
  general: {
    labelEn: 'General Inquiry',
    labelAr: 'استفسار عام',
    quantityLabelEn: 'Estimated Quantity (Optional)',
    quantityLabelAr: 'الكمية التقديرية (اختياري)',
    options: ['1', '2-5', '5-10', '10-20', '20+'],
    defaultMessageEn: '',
    defaultMessageAr: '',
    badgeEn: 'General Inquiry',
    badgeAr: 'استفسار عام',
  },
};

function subscribeSearch(callback: () => void) {
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
}

function getSearchSnapshot(): string {
  return window.location.search;
}

function getServerSearchSnapshot(): string {
  return '';
}

/**
 * Detects the inquiry category from the current URL pathname.
 * This is a fallback for when no explicit query params are set — e.g. the
 * ContactSection on /eco-inks should still show eco-inks-specific labels.
 */
export function detectCategoryFromPathname(pathname: string): InquiryCategory {
  const p = pathname.toLowerCase();
  if (p.includes('/eco-inks') || p.includes('/eco_inks')) return 'eco_inks';
  if (p.includes('/printer-parts')) return 'printer_parts';
  if (p.includes('/equipment')) return 'office_equipment';
  if (p.includes('/sourcing')) return 'sourcing';
  if (p.includes('/printers') || p.includes('/printer')) return 'printer';
  return 'general';
}

/**
 * Client hook that safely subscribes to URL search params without triggering
 * cascading renders in effects or SSR hydration mismatches.
 *
 * Returns:
 * - `leadContext` — parsed from query params when a user navigated from a
 *   product card or configurator (e.g. ?product=HP+LaserJet+Pro).
 * - `categoryFromPath` — always set based on the current route, so that
 *   embedded forms show the correct quantity label/options even without
 *   query params.
 */
export function useLeadContext() {
  const search = useSyncExternalStore(subscribeSearch, getSearchSnapshot, getServerSearchSnapshot);
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);

  const parsed = useMemo(() => parseLeadContext(search), [search]);
  const activeContext = dismissed ? null : parsed;
  const categoryFromPath = useMemo(() => detectCategoryFromPathname(pathname || ''), [pathname]);

  const dismiss = () => setDismissed(true);

  return { leadContext: activeContext, categoryFromPath, dismiss };
}

/**
 * Parses URL query parameters to detect deep buyer intent across the site
 * (e.g. from Product Pages, Eco Inks cards, Parts Catalog, BOQ configurator, and Sourcing Radar).
 */
export function parseLeadContext(search: string): LeadInquiryContext | null {
  if (!search) return null;
  const rawQuery = search.startsWith('?') ? search.slice(1) : search;
  if (!rawQuery.trim()) return null;

  const params = new URLSearchParams(rawQuery);
  const rawCategory = params.get('category')?.trim().toLowerCase();

  // Normalize category string
  const categoryParam: InquiryCategory | null =
    rawCategory === 'eco_inks' || rawCategory === 'eco-inks' || rawCategory === 'eco' ? 'eco_inks' :
    rawCategory === 'printer_parts' || rawCategory === 'parts' ? 'printer_parts' :
    rawCategory === 'office_equipment' || rawCategory === 'equipment' ? 'office_equipment' :
    rawCategory === 'printer' || rawCategory === 'printers' ? 'printer' :
    rawCategory === 'sourcing' ? 'sourcing' : null;

  // 1. Eco Inks
  const toner = params.get('toner')?.trim();
  if (categoryParam === 'eco_inks' || toner) {
    const cfg = CATEGORY_CONFIG.eco_inks;
    return {
      category: 'eco_inks',
      badgeEn: toner ? `Eco Inks: ${toner}` : cfg.badgeEn,
      badgeAr: toner ? `أحبار إيكو: ${toner}` : cfg.badgeAr,
      messageEn: toner
        ? `Inquiry for ${toner}: Please provide cartridge volume pricing, monthly subscription options, and printer compatibility.`
        : cfg.defaultMessageEn,
      messageAr: toner
        ? `طلب تسعير ${toner}: نرجو تزويدنا بأسعار الكميات وباقات الاشتراك والتوافق مع الطابعات.`
        : cfg.defaultMessageAr,
      quantityLabelEn: cfg.quantityLabelEn,
      quantityLabelAr: cfg.quantityLabelAr,
      quantityOptions: cfg.options,
      sourceType: 'eco_inks',
    };
  }

  // 2. Printer Parts
  const part = params.get('part')?.trim();
  if (categoryParam === 'printer_parts' || part || params.get('inquiry') === 'part') {
    const partName = part || 'Certified Replacement Component';
    const cfg = CATEGORY_CONFIG.printer_parts;
    return {
      category: 'printer_parts',
      badgeEn: `Part Request: ${partName}`,
      badgeAr: `طلب قطعة غيار: ${partName}`,
      messageEn: `Spare part procurement request: ${partName}. Please share availability and delivery timeframe.`,
      messageAr: `طلب توريد قطعة غيار: ${partName}. نرجو إفادتنا بالتوافر وفترة التوصيل.`,
      quantityLabelEn: cfg.quantityLabelEn,
      quantityLabelAr: cfg.quantityLabelAr,
      quantityOptions: cfg.options,
      sourceType: 'part',
    };
  }

  // 3. Office Equipment
  if (categoryParam === 'office_equipment') {
    const equipName = params.get('product')?.trim() || 'Office Equipment';
    const cfg = CATEGORY_CONFIG.office_equipment;
    return {
      category: 'office_equipment',
      badgeEn: `Equipment Quote: ${equipName}`,
      badgeAr: `طلب تسعير أجهزة: ${equipName}`,
      messageEn: `Inquiry for ${equipName}: Please provide corporate B2B pricing, delivery schedule, and warranty.`,
      messageAr: `طلب تسعير ${equipName}: نرجو تزويدنا بأسعار الشركات وتفاصيل التوريد والتركيب والضمان.`,
      quantityLabelEn: cfg.quantityLabelEn,
      quantityLabelAr: cfg.quantityLabelAr,
      quantityOptions: cfg.options,
      sourceType: 'equipment',
    };
  }

  // 4. Products (defaulting to printer unless equipment specified)
  const product = params.get('product')?.trim();
  if (product) {
    const cfg = CATEGORY_CONFIG.printer;
    return {
      category: 'printer',
      badgeEn: `Direct Quote: ${product}`,
      badgeAr: `طلب تسعير مباشر: ${product}`,
      messageEn: `Inquiry for ${product}: Please provide availability, warranty details, and B2B volume pricing.`,
      messageAr: `طلب عرض سعر خاص بـ ${product}: نرجو موافاتنا ببيانات التوافر والضمان وتفاصيل تسعير الكميات.`,
      quantityLabelEn: cfg.quantityLabelEn,
      quantityLabelAr: cfg.quantityLabelAr,
      quantityOptions: cfg.options,
      sourceType: 'product',
    };
  }

  // 5. BOQ configurator fleet calculations
  const workstations = params.get('workstations')?.trim();
  const volume = params.get('volume')?.trim();
  if (params.get('service') === 'printers' && (workstations || volume)) {
    const ws = workstations || '10';
    const vol = volume || '5,000';
    const numericWs = Number(ws);
    const suggestedQty = !Number.isNaN(numericWs)
      ? numericWs >= 20 ? '20' : numericWs >= 10 ? '10' : numericWs >= 5 ? '5' : '3'
      : '5';

    const cfg = CATEGORY_CONFIG.printer;
    return {
      category: 'printer',
      badgeEn: `BOQ Fleet Estimate: ${ws} Workstations`,
      badgeAr: `تقدير الأسطول (BOQ): ${ws} محطة عمل`,
      messageEn: `Enterprise BOQ configuration: Fleet scale of ${ws} workstations with estimated ${vol} monthly pages.`,
      messageAr: `طلب تسعير قائمة كميات (BOQ): أسطول طابعات يخدم ${ws} محطة عمل بحجم شهري تقديري ${vol} صفحة.`,
      quantityLabelEn: cfg.quantityLabelEn,
      quantityLabelAr: cfg.quantityLabelAr,
      quantityOptions: cfg.options,
      quantity: suggestedQty,
      sourceType: 'boq',
    };
  }

  // 6. Cross-border Sourcing
  const service = params.get('service')?.trim();
  const stage = params.get('stage')?.trim();
  if (service === 'sourcing' || categoryParam === 'sourcing') {
    const stageName = stage ? stage.charAt(0).toUpperCase() + stage.slice(1) : 'Guangzhou Hub Procurement';
    const cfg = CATEGORY_CONFIG.sourcing;
    return {
      category: 'sourcing',
      badgeEn: `Cross-Border Sourcing: ${stageName}`,
      badgeAr: `توريد تجاري عبر مركز كوانزو`,
      messageEn: `Cross-border B2B electronics & equipment sourcing inquiry (${stageName}).`,
      messageAr: `طلب استفسار عن خدمات التوريد التجاري المباشر للإلكترونيات والأجهزة عبر مركز كوانزو.`,
      quantityLabelEn: cfg.quantityLabelEn,
      quantityLabelAr: cfg.quantityLabelAr,
      quantityOptions: cfg.options,
      sourceType: 'sourcing',
    };
  }

  return null;
}
