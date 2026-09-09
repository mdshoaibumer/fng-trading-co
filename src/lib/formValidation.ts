export interface CountryDialCode {
  code: string;
  dialCode: string;
  nameEn: string;
  nameAr: string;
  flag: string;
  placeholder: string;
  minDigits: number;
  maxDigits: number;
}

export const COUNTRY_DIAL_CODES: readonly CountryDialCode[] = [
  // Primary Regional Footprint & GCC
  { code: 'SA', dialCode: '+966', nameEn: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', flag: '🇸🇦', placeholder: '5X XXX XXXX', minDigits: 9, maxDigits: 9 },
  { code: 'AE', dialCode: '+971', nameEn: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة', flag: '🇦🇪', placeholder: '5X XXX XXXX', minDigits: 9, maxDigits: 9 },
  { code: 'OM', dialCode: '+968', nameEn: 'Oman', nameAr: 'سلطنة عُمان', flag: '🇴🇲', placeholder: '9XXX XXXX', minDigits: 8, maxDigits: 8 },
  { code: 'KW', dialCode: '+965', nameEn: 'Kuwait', nameAr: 'الكويت', flag: '🇰🇼', placeholder: '9XXX XXXX', minDigits: 8, maxDigits: 8 },
  { code: 'QA', dialCode: '+974', nameEn: 'Qatar', nameAr: 'قطر', flag: '🇶🇦', placeholder: '3XXX XXXX', minDigits: 8, maxDigits: 8 },
  { code: 'BH', dialCode: '+973', nameEn: 'Bahrain', nameAr: 'البحرين', flag: '🇧🇭', placeholder: '3XXX XXXX', minDigits: 8, maxDigits: 8 },
  { code: 'EG', dialCode: '+20', nameEn: 'Egypt', nameAr: 'مصر', flag: '🇪🇬', placeholder: '1X XXXX XXXX', minDigits: 10, maxDigits: 10 },
  { code: 'JO', dialCode: '+962', nameEn: 'Jordan', nameAr: 'الأردن', flag: '🇯🇴', placeholder: '7X XXX XXXX', minDigits: 9, maxDigits: 9 },
  { code: 'LB', dialCode: '+961', nameEn: 'Lebanon', nameAr: 'لبنان', flag: '🇱🇧', placeholder: '7X XXX XXX', minDigits: 7, maxDigits: 8 },

  // Global & Major Trade Partners
  { code: 'CN', dialCode: '+86', nameEn: 'China', nameAr: 'الصين', flag: '🇨🇳', placeholder: '1XX XXXX XXXX', minDigits: 11, maxDigits: 11 },
  { code: 'IN', dialCode: '+91', nameEn: 'India', nameAr: 'الهند', flag: '🇮🇳', placeholder: '9XXX XXXXXX', minDigits: 10, maxDigits: 10 },
  { code: 'US', dialCode: '+1', nameEn: 'United States', nameAr: 'الولايات المتحدة', flag: '🇺🇸', placeholder: '(555) 000-0000', minDigits: 10, maxDigits: 10 },
  { code: 'GB', dialCode: '+44', nameEn: 'United Kingdom', nameAr: 'المملكة المتحدة', flag: '🇬🇧', placeholder: '7XXX XXXXXX', minDigits: 10, maxDigits: 10 },
  { code: 'DE', dialCode: '+49', nameEn: 'Germany', nameAr: 'ألمانيا', flag: '🇩🇪', placeholder: '1XX XXXXXXXX', minDigits: 10, maxDigits: 11 },
  { code: 'FR', dialCode: '+33', nameEn: 'France', nameAr: 'فرنسا', flag: '🇫🇷', placeholder: '6 XX XX XX XX', minDigits: 9, maxDigits: 9 },
  { code: 'TR', dialCode: '+90', nameEn: 'Turkey', nameAr: 'تركيا', flag: '🇹🇷', placeholder: '5XX XXX XXXX', minDigits: 10, maxDigits: 10 },
  { code: 'PK', dialCode: '+92', nameEn: 'Pakistan', nameAr: 'باكستان', flag: '🇵🇰', placeholder: '3XX XXXXXXX', minDigits: 10, maxDigits: 10 },
  { code: 'BD', dialCode: '+880', nameEn: 'Bangladesh', nameAr: 'بنغلاديش', flag: '🇧🇩', placeholder: '1XXX XXXXXX', minDigits: 10, maxDigits: 10 },
  { code: 'MY', dialCode: '+60', nameEn: 'Malaysia', nameAr: 'ماليزيا', flag: '🇲🇾', placeholder: '1X XXX XXXX', minDigits: 9, maxDigits: 10 },
  { code: 'SG', dialCode: '+65', nameEn: 'Singapore', nameAr: 'سنغافورة', flag: '🇸🇬', placeholder: '8XXX XXXX', minDigits: 8, maxDigits: 8 },
  { code: 'JP', dialCode: '+81', nameEn: 'Japan', nameAr: 'اليابان', flag: '🇯🇵', placeholder: '90 XXXX XXXX', minDigits: 10, maxDigits: 10 },
  { code: 'KR', dialCode: '+82', nameEn: 'South Korea', nameAr: 'كوريا الجنوبية', flag: '🇰🇷', placeholder: '10 XXXX XXXX', minDigits: 9, maxDigits: 10 },
  { code: 'AU', dialCode: '+61', nameEn: 'Australia', nameAr: 'أستراليا', flag: '🇦🇺', placeholder: '4XX XXX XXX', minDigits: 9, maxDigits: 9 },
  { code: 'OTHER', dialCode: '+', nameEn: 'Other / International', nameAr: 'أخرى / دولي', flag: '🌐', placeholder: 'Phone number', minDigits: 7, maxDigits: 15 },
];

/** Standard email regex matching valid user@domain.tld */
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validates an email address.
 * Returns null if valid, or an error message string if invalid.
 */
export function validateEmail(email: string, required = true, locale = 'en'): string | null {
  const trimmed = email.trim();
  const isAr = locale === 'ar';

  if (!trimmed) {
    if (required) {
      return isAr ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter an email address';
    }
    return null;
  }

  if (trimmed.length > 254) {
    return isAr ? 'البريد الإلكتروني طويل جداً' : 'Email address is too long';
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return isAr ? 'يرجى إدخال بريد إلكتروني صحيح (مثال: name@company.com)' : 'Please enter a valid email address (e.g. name@company.com)';
  }

  return null;
}

/**
 * Extracts pure numeric digits from phone input.
 * Strips leading 0 if standard international dial code is provided.
 */
export function cleanPhoneNumber(rawPhone: string, dialCode = ''): string {
  let cleaned = rawPhone.replace(/\D/g, '');
  // If user entered a leading 0 (e.g. 0501234567 in Saudi or UAE) and dialCode is selected, strip the leading 0
  if (dialCode && dialCode !== '+' && cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }
  return cleaned;
}

/**
 * Finds country config matching a country name or dial code.
 */
export function findCountryConfig(nameOrCodeOrDial: string): CountryDialCode {
  const val = nameOrCodeOrDial.trim().toLowerCase();
  const found = COUNTRY_DIAL_CODES.find(
    (c) =>
      c.code.toLowerCase() === val ||
      c.dialCode.toLowerCase() === val ||
      c.nameEn.toLowerCase() === val ||
      c.nameAr.toLowerCase() === val
  );
  return found || COUNTRY_DIAL_CODES[0]; // defaults to Saudi Arabia
}

/**
 * Validates a phone number based on dial code and digits.
 * Returns null if valid, or an error message string if invalid.
 */
export function validatePhone(phone: string, dialCode = '+966', locale = 'en'): string | null {
  const isAr = locale === 'ar';
  const trimmed = phone.trim();

  if (!trimmed) {
    return isAr ? 'يرجى إدخال رقم الجوال' : 'Please enter a phone number';
  }

  const cleaned = cleanPhoneNumber(trimmed, dialCode);
  const country = COUNTRY_DIAL_CODES.find((c) => c.dialCode === dialCode) || COUNTRY_DIAL_CODES[0];

  if (cleaned.length === 0) {
    return isAr ? 'يرجى إدخال أرقام صحيحة لرقم الهاتف' : 'Please enter valid digits for the phone number';
  }

  // Specific validation for Saudi Arabia (+966)
  if (dialCode === '+966') {
    if (!/^5\d{8}$/.test(cleaned)) {
      return isAr
        ? 'رقم الجوال السعودي يجب أن يبدأ برقم 5 ويتكون من 9 أرقام (مثال: 5X XXX XXXX)'
        : 'Saudi mobile numbers must start with 5 and be 9 digits (e.g. 5X XXX XXXX)';
    }
    return null;
  }

  // Specific validation for UAE (+971)
  if (dialCode === '+971') {
    if (!/^[2-9]\d{7,8}$/.test(cleaned)) {
      return isAr
        ? 'يرجى إدخال رقم إماراتي صحيح (مثال: 5X XXX XXXX)'
        : 'Please enter a valid UAE phone number (e.g. 5X XXX XXXX)';
    }
    return null;
  }

  // General length checks based on country config
  if (cleaned.length < country.minDigits || cleaned.length > country.maxDigits) {
    return isAr
      ? `رقم الهاتف يجب أن يتكون من ${country.minDigits === country.maxDigits ? country.minDigits : `${country.minDigits}-${country.maxDigits}`} أرقام`
      : `Phone number must be ${country.minDigits === country.maxDigits ? `${country.minDigits} digits` : `between ${country.minDigits} and ${country.maxDigits} digits`}`;
  }

  return null;
}

/**
 * Formats a combined phone string for saving and API delivery (e.g. "+966 50 123 4567").
 */
export function formatFullPhone(dialCode: string, localPhone: string): string {
  const cleaned = cleanPhoneNumber(localPhone, dialCode);
  if (!cleaned) return '';
  const prefix = dialCode.startsWith('+') ? dialCode : `+${dialCode}`;
  return `${prefix} ${cleaned}`.trim();
}
