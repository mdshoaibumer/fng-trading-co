import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePhone,
  cleanPhoneNumber,
  formatFullPhone,
  findCountryConfig,
} from './formValidation';

describe('formValidation', () => {
  describe('validateEmail', () => {
    it('accepts valid email addresses in English', () => {
      expect(validateEmail('test@example.com', true, 'en')).toBeNull();
      expect(validateEmail('user.name+tag@sub.domain.co.uk', true, 'en')).toBeNull();
      expect(validateEmail('inquiry@fngtradingco.com', true, 'en')).toBeNull();
    });

    it('rejects invalid email addresses in English', () => {
      expect(validateEmail('plainaddress', true, 'en')).toContain('valid email');
      expect(validateEmail('@missinguser.com', true, 'en')).toContain('valid email');
      expect(validateEmail('user@nodomain', true, 'en')).toContain('valid email');
      expect(validateEmail('user@.com', true, 'en')).toContain('valid email');
    });

    it('returns localized error in Arabic', () => {
      expect(validateEmail('invalid', true, 'ar')).toContain('بريد إلكتروني صحيح');
      expect(validateEmail('', true, 'ar')).toContain('يرجى إدخال');
    });

    it('handles optional email correctly', () => {
      expect(validateEmail('', false, 'en')).toBeNull();
      expect(validateEmail('   ', false, 'en')).toBeNull();
      expect(validateEmail('not-an-email', false, 'en')).toContain('valid email');
    });
  });

  describe('cleanPhoneNumber', () => {
    it('strips non-digits', () => {
      expect(cleanPhoneNumber('(555) 123-4567')).toBe('5551234567');
      expect(cleanPhoneNumber('+966 50 123 4567')).toBe('966501234567');
    });

    it('strips leading 0 when dialCode is present', () => {
      expect(cleanPhoneNumber('0501234567', '+966')).toBe('501234567');
      expect(cleanPhoneNumber('0529876543', '+971')).toBe('529876543');
    });
  });

  describe('validatePhone', () => {
    it('validates Saudi Arabia mobile numbers', () => {
      // Valid Saudi numbers start with 5 and are 9 digits
      expect(validatePhone('501234567', '+966', 'en')).toBeNull();
      expect(validatePhone('0593380390', '+966', 'en')).toBeNull();
      expect(validatePhone('55 123 4567', '+966', 'en')).toBeNull();

      // Invalid Saudi numbers
      expect(validatePhone('401234567', '+966', 'en')).toContain('start with 5');
      expect(validatePhone('5012345', '+966', 'en')).toContain('9 digits');
      expect(validatePhone('50123456789', '+966', 'en')).toContain('9 digits');
      expect(validatePhone('0493380390', '+966', 'ar')).toContain('يبدأ برقم 5');
    });

    it('validates UAE phone numbers', () => {
      expect(validatePhone('501234567', '+971', 'en')).toBeNull();
      expect(validatePhone('0501234567', '+971', 'en')).toBeNull();
      expect(validatePhone('123', '+971', 'en')).toContain('valid UAE phone number');
    });

    it('validates other countries by min/max digits', () => {
      // US (+1) requires 10 digits
      expect(validatePhone('2125551234', '+1', 'en')).toBeNull();
      expect(validatePhone('555123', '+1', 'en')).toContain('digits');

      // China (+86) requires 11 digits
      expect(validatePhone('13812345678', '+86', 'en')).toBeNull();
      expect(validatePhone('1381234567', '+86', 'en')).toContain('11 digits');
    });

    it('rejects empty input', () => {
      expect(validatePhone('', '+966', 'en')).toContain('enter a phone number');
      expect(validatePhone('', '+966', 'ar')).toContain('يرجى إدخال');
    });
  });

  describe('formatFullPhone', () => {
    it('formats clean international phone with dial code', () => {
      expect(formatFullPhone('+966', '050 123 4567')).toBe('+966 501234567');
      expect(formatFullPhone('+971', '052-987-6543')).toBe('+971 529876543');
      expect(formatFullPhone('+1', '(212) 555-1234')).toBe('+1 2125551234');
    });
  });

  describe('findCountryConfig', () => {
    it('finds by code, name, or dialCode', () => {
      expect(findCountryConfig('SA').dialCode).toBe('+966');
      expect(findCountryConfig('Saudi Arabia').code).toBe('SA');
      expect(findCountryConfig('+971').code).toBe('AE');
      expect(findCountryConfig('China').dialCode).toBe('+86');
      expect(findCountryConfig('NonExistentCountry').code).toBe('SA'); // default
    });
  });
});
