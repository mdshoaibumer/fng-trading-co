'use client';

import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import MagneticButton from '@/components/ui/MagneticButton';
import DocumentVerificationModal from '@/components/ui/DocumentVerificationModal';

interface DocumentInspectTriggerProps {
  isAr?: boolean;
  variant?: 'dark' | 'light';
}

export default function DocumentInspectTrigger({
  isAr = false,
  variant = 'dark',
}: DocumentInspectTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isDark = variant === 'dark';

  return (
    <>
      <MagneticButton magneticPull={8}>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 28px',
            borderRadius: 'var(--radius-pill)',
            background: isDark
              ? 'rgba(255, 255, 255, 0.12)'
              : 'linear-gradient(135deg, rgba(26,61,43,0.06) 0%, rgba(141,184,51,0.12) 100%)',
            border: isDark
              ? '1.5px solid rgba(141, 184, 51, 0.5)'
              : '1.5px solid rgba(141, 184, 51, 0.45)',
            color: isDark ? '#FFFFFF' : 'var(--deep-forest)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.04)',
            transition: 'all 200ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(141, 184, 51, 0.3)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = isDark ? 'rgba(141, 184, 51, 0.5)' : 'rgba(141, 184, 51, 0.45)';
            e.currentTarget.style.boxShadow = isDark ? '0 4px 20px rgba(0, 0, 0, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.04)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <ShieldCheck size={18} color="var(--accent)" />
          <span>
            {isAr
              ? 'معاينة وثائق السجل التجاري والتراخيص الرسمية'
              : 'Inspect Official CR & Government Licenses'}
          </span>
        </button>
      </MagneticButton>

      <DocumentVerificationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isAr={isAr}
      />
    </>
  );
}
