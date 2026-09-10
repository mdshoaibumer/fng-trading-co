'use client';

import React, { useId, useState } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import {
  COUNTRY_DIAL_CODES,
  CountryDialCode,
  cleanPhoneNumber,
} from '@/lib/formValidation';

export interface PhoneInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  dialCode: string;
  onDialCodeChange: (dialCode: string) => void;
  locale?: string;
  theme?: 'dark' | 'light';
  error?: string | null;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
}

export default function PhoneInput({
  id,
  value,
  onChange,
  dialCode,
  onDialCodeChange,
  locale = 'en',
  theme = 'light',
  error,
  required = true,
  disabled = false,
  placeholder,
  label,
}: PhoneInputProps) {
  const generatedId = useId();
  const inputId = id || `phone-input-${generatedId}`;
  const errorId = `phone-error-${generatedId}`;
  const isAr = locale === 'ar';

  const [isFocused, setIsFocused] = useState(false);

  const selectedCountry: CountryDialCode =
    COUNTRY_DIAL_CODES.find((c) => c.dialCode === dialCode) || COUNTRY_DIAL_CODES[0];

  const effectivePlaceholder =
    placeholder || (selectedCountry ? selectedCountry.placeholder : (isAr ? 'رقم الهاتف' : 'Phone number'));

  const isDark = theme === 'dark';

  // Theme styling tokens
  const containerBg = isDark ? 'rgba(255, 255, 255, 0.06)' : 'var(--bg-secondary)';
  const borderColor = error
    ? (isDark ? '#FF6B6B' : '#E53E3E')
    : isFocused
    ? 'var(--accent)'
    : isDark
    ? 'rgba(255, 255, 255, 0.15)'
    : 'var(--light-grey)';
  const textColor = isDark ? '#FFFFFF' : 'var(--text-primary)';
  const selectTextColor = isDark ? '#FFFFFF' : 'var(--text-primary)';
  const dividerColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'var(--light-grey)';

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, spaces, and hyphens in the input
    const raw = e.target.value;
    // Strip leading 0 if standard international dialCode is active and length > 1
    const cleaned = cleanPhoneNumber(raw, dialCode);
    onChange(cleaned);
  };

  return (
    <div style={{ width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '6px',
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-secondary)',
            textAlign: isAr ? 'right' : 'left',
          }}
        >
          {label} {required && <span style={{ color: isDark ? '#FF6B6B' : '#E53E3E' }}>*</span>}
        </label>
      )}

      {/* Unified Input Container */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: isDark ? 'var(--radius-md)' : 'var(--radius-lg)',
          border: `1px solid ${borderColor}`,
          background: containerBg,
          minHeight: isDark ? '48px' : '56px',
          boxShadow: isFocused ? (isDark ? '0 0 0 2px rgba(141, 184, 51, 0.3)' : '0 0 0 2px rgba(141, 184, 51, 0.25)') : 'none',
          transition: 'all var(--transition-fast)',
          overflow: 'hidden',
          flexDirection: isAr ? 'row-reverse' : 'row',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Country Dial Code Selector */}
        <div
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            padding: isDark ? '0 10px 0 14px' : '0 12px 0 16px',
            cursor: 'pointer',
            flexShrink: 0,
            direction: 'ltr',
          }}
        >
          <span style={{ fontSize: '1.2rem', marginRight: '6px', lineHeight: 1 }} aria-hidden="true">
            {selectedCountry.flag}
          </span>
          <span
            style={{
              fontSize: isDark ? '0.88rem' : '0.95rem',
              fontWeight: 700,
              color: selectTextColor,
              marginRight: '4px',
              fontFamily: 'monospace',
            }}
          >
            {selectedCountry.dialCode}
          </span>
          <ChevronDown
            size={14}
            style={{
              color: isDark ? 'rgba(255, 255, 255, 0.5)' : '#94A3B8',
              pointerEvents: 'none',
              marginLeft: '2px',
            }}
          />

          {/* Native Accessible Select Layer */}
          <select
            aria-label={isAr ? 'اختر رمز الدولة للاتصال' : 'Select country phone dial code'}
            value={dialCode}
            disabled={disabled}
            onChange={(e) => onDialCodeChange(e.target.value)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
              appearance: 'none',
              zIndex: 2,
            }}
          >
            {COUNTRY_DIAL_CODES.map((c) => (
              <option key={c.code} value={c.dialCode} style={{ color: '#0F172A', background: '#FFFFFF' }}>
                {c.flag} {isAr ? c.nameAr : c.nameEn} ({c.dialCode})
              </option>
            ))}
          </select>
        </div>

        {/* Divider */}
        <div
          style={{
            width: '1px',
            height: isDark ? '24px' : '28px',
            background: dividerColor,
            flexShrink: 0,
          }}
        />

        {/* Phone Number Input */}
        <input
          id={inputId}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          required={required}
          disabled={disabled}
          value={value}
          onChange={handlePhoneChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={effectivePlaceholder}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          style={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            background: 'transparent',
            color: textColor,
            fontSize: isDark ? '0.95rem' : 'var(--text-base)',
            fontFamily: 'var(--font-inter), sans-serif',
            padding: isDark ? '12px 14px' : '16px 18px',
            outline: 'none',
            direction: 'ltr',
            textAlign: isAr ? 'right' : 'left',
          }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div
          id={errorId}
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '6px',
            color: isDark ? '#FF8A80' : '#DC2626',
            fontSize: '0.82rem',
            fontWeight: 600,
            textAlign: isAr ? 'right' : 'left',
            flexDirection: isAr ? 'row-reverse' : 'row',
          }}
        >
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
