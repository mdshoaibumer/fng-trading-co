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
  const plasticSavedKg = Math.round((pages * 12 * 0.006));
  // CO2 equivalent avoided: ~0.024 kg CO2 per page from avoiding new printer production and oil-based toner
  const co2AvoidedKg = Math.round(pages * 12 * 0.018);

  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="w-full max-w-5xl mx-auto mb-12 sm:mb-16">
      <SpotlightCard
        className="glass"
        style={{
          padding: 'clamp(24px, 5vw, 44px)',
          background: 'rgba(255, 255, 255, 0.92)',
          border: '1px solid rgba(141, 184, 51, 0.25)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
        }}
      >
        <BorderBeam size={320} duration={10} colorFrom="var(--accent)" colorTo="var(--deep-forest)" />

        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 28px' }}>
          <span className="section-tag" style={{ marginBottom: '10px', display: 'inline-block' }}>
            {isAr ? 'حاسبة التوفير والاستدامة' : 'ROI & Sustainability Calculator'}
          </span>
          <h3 style={{ fontSize: 'clamp(1.35rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px', lineHeight: 1.25 }}>
            {isAr ? 'احسب وفورات أسطولك والأثر البيئي' : 'Calculate Your Fleet Savings & Impact'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
            {isAr
              ? 'حرّك المؤشر بناءً على استهلاك صفحاتك الشهرية لتقدير الوفورات المالية وتقليل النفايات.'
              : 'Adjust your estimated monthly print volume to see your projected annual financial and environmental savings.'}
          </p>
        </div>

        {/* Volume Slider */}
        <div style={{ 
          marginBottom: '28px', 
          background: 'var(--bg-secondary)', 
          padding: 'clamp(18px, 3vw, 24px)', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--light-grey)' 
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '16px', 
            flexWrap: 'wrap', 
            gap: '12px' 
          }}>
            <label htmlFor={sliderId} style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1rem' }}>
              {isAr ? 'عدد الصفحات الشهرية المقدر:' : 'Estimated Monthly Pages:'}
            </label>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
              fontWeight: 800,
              color: 'var(--accent-text)',
              background: '#fff',
              padding: '6px 18px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(141, 184, 51, 0.35)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>{pages.toLocaleString(isAr ? 'ar-SA' : 'en-US')}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
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
                height: '8px',
                borderRadius: 'var(--radius-pill)',
                accentColor: 'var(--accent-text)',
                cursor: 'pointer',
                display: 'block',
              }}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '10px', 
              fontSize: 'var(--text-xs)', 
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600
            }}>
              <span>1,000</span>
              <span>25,000</span>
              <span>50,000+</span>
            </div>
          </div>
        </div>

        {/* 3 Calculated Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
          {/* Card 1: SAR Savings */}
          <div style={{
            background: '#fff',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(141, 184, 51, 0.25)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            textAlign: isAr ? 'right' : 'left',
          }}>
            <div>
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '12px', 
                background: 'rgba(141, 184, 51, 0.15)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '16px',
                marginRight: isAr ? 0 : 'auto',
                marginLeft: isAr ? 'auto' : 0,
              }}>
                <DollarSign size={22} color="var(--accent-text)" />
              </div>
              <div style={{ 
                fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', 
                fontWeight: 900, 
                color: 'var(--primary)', 
                fontFamily: 'var(--font-mono)', 
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                marginBottom: '8px'
              }}>
                {annualSavings.toLocaleString(isAr ? 'ar-SA' : 'en-US')}{' '}
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-text)' }}>
                  {isAr ? 'ر.س' : 'SAR'}
                </span>
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {isAr ? 'وفورات سنوية تقديرية' : 'Estimated Annual Savings'}
            </div>
          </div>

          {/* Card 2: Plastic Diverted */}
          <div style={{
            background: '#fff',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(141, 184, 51, 0.25)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            textAlign: isAr ? 'right' : 'left',
          }}>
            <div>
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '12px', 
                background: 'rgba(74, 94, 42, 0.12)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '16px',
                marginRight: isAr ? 0 : 'auto',
                marginLeft: isAr ? 'auto' : 0,
              }}>
                <Trash2 size={22} color="var(--olive-green)" />
              </div>
              <div style={{ 
                fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', 
                fontWeight: 900, 
                color: 'var(--primary)', 
                fontFamily: 'var(--font-mono)', 
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                marginBottom: '8px'
              }}>
                {plasticSavedKg.toLocaleString(isAr ? 'ar-SA' : 'en-US')}{' '}
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--olive-green)' }}>
                  {isAr ? 'كجم' : 'kg'}
                </span>
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {isAr ? 'بلاستيك تم تجنيبه للمكبات' : 'Plastic Landfill Diversion'}
            </div>
          </div>

          {/* Card 3: CO2 Avoided */}
          <div style={{
            background: '#fff',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(141, 184, 51, 0.25)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            textAlign: isAr ? 'right' : 'left',
          }}>
            <div>
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '12px', 
                background: 'rgba(47, 109, 176, 0.12)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '16px',
                marginRight: isAr ? 0 : 'auto',
                marginLeft: isAr ? 'auto' : 0,
              }}>
                <CloudRain size={22} color="var(--info-strong)" />
              </div>
              <div style={{ 
                fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', 
                fontWeight: 900, 
                color: 'var(--primary)', 
                fontFamily: 'var(--font-mono)', 
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                marginBottom: '8px'
              }}>
                {co2AvoidedKg.toLocaleString(isAr ? 'ar-SA' : 'en-US')}{' '}
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--info-strong)' }}>
                  {isAr ? 'كجم CO₂' : 'kg CO₂'}
                </span>
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {isAr ? 'انبعاثات كربونية مُخفّضة' : 'Carbon Emissions Reduced'}
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div 
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[var(--light-grey)]"
          style={{ textAlign: isAr ? 'right' : 'left' }}
        >
          <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5 }} className="w-full sm:w-auto text-center sm:text-start">
            {isAr
              ? 'هل ترغب في تقرير مخصص لأسطول شركتك؟ احصل على عرض أسعار وخطة استبدال فورية.'
              : 'Need an audit for your office fleet? Get an itemised assessment with exact figures.'}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="btn-primary w-full sm:w-auto shrink-0"
            style={{
              padding: '12px 24px',
              height: '46px',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
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
