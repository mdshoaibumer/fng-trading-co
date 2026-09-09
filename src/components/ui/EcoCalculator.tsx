'use client';

import { useState, useId } from 'react';
import { DollarSign, Trash2, CloudRain, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import BorderBeam from '@/components/ui/BorderBeam';
import SpotlightCard from '@/components/ui/SpotlightCard';

interface EcoCalculatorProps {
  isAr?: boolean;
  locale?: string;
}

export default function EcoCalculator({ isAr = false, locale = 'en' }: EcoCalculatorProps) {
  const [pages, setPages] = useState(10000);
  const sliderId = useId();

  // Metrics estimation formula based on Saudi enterprise printing averages:
  // Avg OEM cost per page = ~0.08 SAR. FNG Refurbished + Eco-Toner = ~0.035 SAR (saves ~0.045 SAR/page)
  const annualSavings = Math.round(pages * 12 * 0.045);
  // Plastic e-waste diverted: ~0.008 kg plastic per 100 pages through cartridge refilling and printer re-use
  const plasticSavedKg = Math.round(pages * 12 * 0.006);
  // CO2 equivalent avoided: ~0.024 kg CO2 per page from avoiding new printer production and oil-based toner
  const co2AvoidedKg = Math.round(pages * 12 * 0.018);

  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const sliderPercent = ((pages - 1000) / (50000 - 1000)) * 100;

  return (
    <div className="w-full mb-12 sm:mb-16">
      <SpotlightCard
        className="glass"
        style={{
          padding: 'clamp(28px, 4.5vw, 56px)',
          background: 'rgba(255, 255, 255, 0.96)',
          border: '1px solid rgba(141, 184, 51, 0.28)',
          boxShadow: '0 16px 48px -8px rgba(26, 61, 43, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
          borderRadius: '24px',
          position: 'relative',
        }}
      >
        <BorderBeam size={380} duration={12} colorFrom="var(--accent)" colorTo="var(--deep-forest)" />

        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto clamp(24px, 4vw, 36px)' }}>
          <span
            className="section-tag"
            style={{
              marginBottom: '12px',
              display: 'inline-block',
              padding: '6px 18px',
              fontSize: '0.85rem',
              fontWeight: 700,
            }}
          >
            {isAr ? 'حاسبة التوفير والاستدامة' : 'ROI & Sustainability Calculator'}
          </span>
          <h3
            style={{
              fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)',
              fontWeight: 800,
              color: 'var(--primary)',
              marginBottom: '12px',
              lineHeight: 1.22,
              letterSpacing: '-0.02em',
            }}
          >
            {isAr ? 'احسب وفورات أسطولك والأثر البيئي' : 'Calculate Your Fleet Savings & Impact'}
          </h3>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
              margin: '0 auto',
              lineHeight: 1.6,
              maxWidth: '720px',
            }}
          >
            {isAr
              ? 'حرّك المؤشر بناءً على استهلاك صفحاتك الشهرية لتقدير الوفورات المالية وتقليل النفايات.'
              : 'Adjust your estimated monthly print volume to see your projected annual financial and environmental savings.'}
          </p>
        </div>

        {/* Volume Slider Card */}
        <div
          style={{
            marginBottom: 'clamp(24px, 3.5vw, 36px)',
            background: 'var(--bg-secondary)',
            padding: 'clamp(20px, 3.5vw, 32px)',
            borderRadius: '20px',
            border: '1px solid rgba(26, 61, 43, 0.08)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '18px',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            <label
              htmlFor={sliderId}
              style={{
                fontWeight: 700,
                color: 'var(--primary)',
                fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              }}
            >
              {isAr ? 'عدد الصفحات الشهرية المقدر:' : 'Estimated Monthly Pages:'}
            </label>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(1.2rem, 2.4vw, 1.55rem)',
                fontWeight: 800,
                color: 'var(--accent-text)',
                background: '#fff',
                padding: '8px 22px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid rgba(141, 184, 51, 0.4)',
                boxShadow: '0 2px 8px rgba(141, 184, 51, 0.12)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>{pages.toLocaleString(isAr ? 'ar-SA' : 'en-US')}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {isAr ? 'صفحة / شهر' : 'pages / mo'}
              </span>
            </span>
          </div>

          <div style={{ direction: 'ltr' }}>
            <input
              id={sliderId}
              type="range"
              min={1000}
              max={50000}
              step={1000}
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              aria-label={isAr ? 'عدد الصفحات الشهرية' : 'Monthly page volume'}
              style={{
                width: '100%',
                height: '10px',
                borderRadius: 'var(--radius-pill)',
                accentColor: 'var(--accent-text)',
                background: `linear-gradient(to right, var(--accent-text) 0%, var(--accent-text) ${sliderPercent}%, #DDE3D5 ${sliderPercent}%, #DDE3D5 100%)`,
                cursor: 'pointer',
                display: 'block',
                outline: 'none',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '12px',
                fontSize: '0.92rem',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
              }}
            >
              <span>1,000</span>
              <span>25,000</span>
              <span>50,000+</span>
            </div>
          </div>
        </div>

        {/* 3 Calculated Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'clamp(16px, 2.5vw, 24px)',
            marginBottom: 'clamp(28px, 4vw, 40px)',
          }}
        >
          {/* Card 1: SAR Savings */}
          <div
            style={{
              background: '#fff',
              padding: 'clamp(24px, 3vw, 32px)',
              borderRadius: '20px',
              border: '1px solid rgba(141, 184, 51, 0.28)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '190px',
              textAlign: isAr ? 'right' : 'left',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <div>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'rgba(141, 184, 51, 0.16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px',
                  marginRight: isAr ? 0 : 'auto',
                  marginLeft: isAr ? 'auto' : 0,
                }}
              >
                <DollarSign size={26} color="var(--accent-text)" />
              </div>
              <div
                style={{
                  fontSize: 'clamp(2rem, 3.2vw, 2.9rem)',
                  fontWeight: 900,
                  color: 'var(--primary)',
                  fontFamily: 'var(--font-mono)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  marginBottom: '10px',
                }}
              >
                {annualSavings.toLocaleString(isAr ? 'ar-SA' : 'en-US')}{' '}
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-text)' }}>
                  {isAr ? 'ر.س' : 'SAR'}
                </span>
              </div>
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {isAr ? 'وفورات سنوية تقديرية' : 'Estimated Annual Savings'}
            </div>
          </div>

          {/* Card 2: Plastic Diverted */}
          <div
            style={{
              background: '#fff',
              padding: 'clamp(24px, 3vw, 32px)',
              borderRadius: '20px',
              border: '1px solid rgba(141, 184, 51, 0.28)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '190px',
              textAlign: isAr ? 'right' : 'left',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <div>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'rgba(74, 94, 42, 0.14)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px',
                  marginRight: isAr ? 0 : 'auto',
                  marginLeft: isAr ? 'auto' : 0,
                }}
              >
                <Trash2 size={26} color="var(--olive-green)" />
              </div>
              <div
                style={{
                  fontSize: 'clamp(2rem, 3.2vw, 2.9rem)',
                  fontWeight: 900,
                  color: 'var(--primary)',
                  fontFamily: 'var(--font-mono)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  marginBottom: '10px',
                }}
              >
                {plasticSavedKg.toLocaleString(isAr ? 'ar-SA' : 'en-US')}{' '}
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--olive-green)' }}>
                  {isAr ? 'كجم' : 'kg'}
                </span>
              </div>
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {isAr ? 'بلاستيك تم تجنيبه للمكبات' : 'Plastic Landfill Diversion'}
            </div>
          </div>

          {/* Card 3: CO2 Avoided */}
          <div
            style={{
              background: '#fff',
              padding: 'clamp(24px, 3vw, 32px)',
              borderRadius: '20px',
              border: '1px solid rgba(141, 184, 51, 0.28)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '190px',
              textAlign: isAr ? 'right' : 'left',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <div>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'rgba(47, 109, 176, 0.14)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px',
                  marginRight: isAr ? 0 : 'auto',
                  marginLeft: isAr ? 'auto' : 0,
                }}
              >
                <CloudRain size={26} color="var(--info-strong)" />
              </div>
              <div
                style={{
                  fontSize: 'clamp(2rem, 3.2vw, 2.9rem)',
                  fontWeight: 900,
                  color: 'var(--primary)',
                  fontFamily: 'var(--font-mono)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  marginBottom: '10px',
                }}
              >
                {co2AvoidedKg.toLocaleString(isAr ? 'ar-SA' : 'en-US')}{' '}
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--info-strong)' }}>
                  {isAr ? 'كجم CO₂' : 'kg CO₂'}
                </span>
              </div>
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {isAr ? 'انبعاثات كربونية مُخفّضة' : 'Carbon Emissions Reduced'}
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-5 pt-7 border-t border-[var(--light-grey)]"
          style={{ textAlign: isAr ? 'right' : 'left' }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(0.95rem, 1.6vw, 1.05rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
            }}
            className="w-full sm:w-auto text-center sm:text-start"
          >
            {isAr
              ? 'هل ترغب في تقرير مخصص لأسطول شركتك؟ احصل على عرض أسعار وخطة استبدال فورية.'
              : 'Need an audit for your office fleet? Get an itemised assessment with exact figures.'}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="btn-primary w-full sm:w-auto shrink-0"
            style={{
              padding: '14px 30px',
              height: '50px',
              fontSize: '0.95rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <span>{isAr ? 'اطلب تقييماً مجانياً' : 'Request Free Assessment'}</span>
            <Arrow size={18} />
          </Link>
        </div>
      </SpotlightCard>
    </div>
  );
}
