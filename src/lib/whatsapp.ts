export const DEFAULT_WHATSAPP_NUMBER = '966593380390';

export function sanitizeWhatsappNumber(raw: string): string {
  return raw.replace(/\s/g, '').replace('+', '');
}
