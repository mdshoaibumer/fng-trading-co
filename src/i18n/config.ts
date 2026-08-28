export const locales = ['ar', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ar';

export function isRTL(locale: string): boolean {
  return locale === 'ar';
}
