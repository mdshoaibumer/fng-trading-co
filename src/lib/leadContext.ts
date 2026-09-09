import { useSyncExternalStore, useMemo, useState } from 'react';

export interface LeadInquiryContext {
  badgeEn: string;
  badgeAr: string;
  messageEn: string;
  messageAr: string;
  quantity?: string;
  sourceType: 'product' | 'part' | 'boq' | 'sourcing';
}

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
 * Client hook that safely subscribes to URL search params without triggering
 * cascading renders in effects or SSR hydration mismatches.
 */
export function useLeadContext() {
  const search = useSyncExternalStore(subscribeSearch, getSearchSnapshot, getServerSearchSnapshot);
  const [dismissed, setDismissed] = useState(false);

  const parsed = useMemo(() => parseLeadContext(search), [search]);
  const activeContext = dismissed ? null : parsed;

  const dismiss = () => setDismissed(true);

  return { leadContext: activeContext, dismiss };
}

/**
 * Parses URL query parameters to detect deep buyer intent across the site
 * (e.g. from Product Pages, Exploded 3D view, BOQ configurator, and Sourcing Radar).
 */
export function parseLeadContext(search: string): LeadInquiryContext | null {
  if (!search) return null;
  const rawQuery = search.startsWith('?') ? search.slice(1) : search;
  if (!rawQuery.trim()) return null;

  const params = new URLSearchParams(rawQuery);

  const product = params.get('product')?.trim();
  if (product) {
    return {
      badgeEn: `Direct Quote: ${product}`,
      badgeAr: `طلب تسعير مباشر: ${product}`,
      messageEn: `Inquiry for ${product}: Please provide availability, warranty details, and B2B volume pricing.`,
      messageAr: `طلب عرض سعر خاص بـ ${product}: نرجو موافاتنا ببيانات التوافر والضمان وتفاصيل تسعير الكميات.`,
      sourceType: 'product',
    };
  }

  const part = params.get('part')?.trim();
  if (part || params.get('inquiry') === 'part') {
    const partName = part || 'Refurbished Component';
    return {
      badgeEn: `Part Request: ${partName}`,
      badgeAr: `طلب قطعة غيار: ${partName}`,
      messageEn: `Spare part procurement request: ${partName}. Please share availability and delivery timeframe.`,
      messageAr: `طلب توريد قطعة غيار: ${partName}. نرجو إفادتنا بالتوافر وفترة التوصيل.`,
      sourceType: 'part',
    };
  }

  const workstations = params.get('workstations')?.trim();
  const volume = params.get('volume')?.trim();
  if (params.get('service') === 'printers' && (workstations || volume)) {
    const ws = workstations || '10';
    const vol = volume || '5,000';
    const numericWs = Number(ws);
    const suggestedQty = !Number.isNaN(numericWs)
      ? numericWs >= 20 ? '20' : numericWs >= 10 ? '10' : numericWs >= 5 ? '5' : '3'
      : '5';

    return {
      badgeEn: `BOQ Fleet Estimate: ${ws} Workstations`,
      badgeAr: `تقدير الأسطول (BOQ): ${ws} محطة عمل`,
      messageEn: `Enterprise BOQ configuration: Fleet scale of ${ws} workstations with estimated ${vol} monthly pages.`,
      messageAr: `طلب تسعير قائمة كميات (BOQ): أسطول طابعات يخدم ${ws} محطة عمل بحجم شهري تقديري ${vol} صفحة.`,
      quantity: suggestedQty,
      sourceType: 'boq',
    };
  }

  const service = params.get('service')?.trim();
  const stage = params.get('stage')?.trim();
  if (service === 'sourcing') {
    const stageName = stage ? stage.charAt(0).toUpperCase() + stage.slice(1) : 'Guangzhou Hub Procurement';
    return {
      badgeEn: `Cross-Border Sourcing: ${stageName}`,
      badgeAr: `توريد تجاري عبر مكتب كوانزو`,
      messageEn: `Cross-border B2B electronics & equipment sourcing inquiry (${stageName}).`,
      messageAr: `طلب استفسار عن خدمات التوريد التجاري المباشر للإلكترونيات والأجهزة عبر مركز كوانزو.`,
      sourceType: 'sourcing',
    };
  }

  return null;
}
