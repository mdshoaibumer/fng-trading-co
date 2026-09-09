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
    <div className="w-full max-w-4xl mx-auto my-12">
      <SpotlightCard
        className="glass"
        style={{
          padding: 'clamp(24px, 5vw, 48px)',
          background: 'rgba(255, 255, 255, 0.85)',
          border: '1px solid rgba(141, 184, 51, 0.25)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
        }}
      >
        <BorderBeam size={320} duration={10} colorFrom="var(--accent)" colorTo="var(--deep-forest)" />

        <div style={{ textAlign: isAr ? 'right' : 'left', marginBottom: '28px' }}>
          <span className="section-tag" style={{ marginBottom: '8px' }}>
            {isAr ? 'حاسبة التوفير والاستدامة' : 'ROI & Sustainability Calculator'}
          </span>
          <h3 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>
            {isAr ? 'احسب وفورات أسطولك والأثر البيئي' : 'Calculate Your Fleet Savings & Impact'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {isAr
              ? 'حرّك المؤشر بناءً على استهلاك صفحاتك الشهرية لتقدير الوفورات المالية وتقليل النفايات.'
              : 'Adjust your estimated monthly print volume to see your projected annual financial and environmental savings.'}
          </p>
        </div>

        {/* Volume Slider */}
        <div style={{ marginBottom: '36px', background: 'var(--bg-secondary)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--light-grey)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <label htmlFor={sliderId} style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1rem' }}>
              {isAr ? 'عدد الصفحات الشهرية المقدر:' : 'Estimated Monthly Pages:'}
            </label>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.4rem',
              fontWeight: 800,
              color: 'var(--accent-text)',
              background: '#fff',
              padding: '4px 16px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(141, 184, 51, 0.3)',
            }}>
              {pages.toLocaleString(isAr ? 'ar-SA' : 'en-US')} {isAr ? 'صفحة / شهر' : 'pages / mo'}
            </span>
          </div>

          <input
            id={sliderId}
            type="range"
            min={1000}
            max={50000}
            step={1000}
            value={pages}
            onChange={(e) => setPages(Number(e.target.value))}
            style={{
              width: '100%',
              height: '8px',
              borderRadius: 'var(--radius-pill)',
              accentColor: 'var(--accent-text)',
              cursor: 'pointer',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            <span>1,000</span>
            <span>25,000</span>
            <span>50,000+</span>
          </div>
        </div>

        {/* 3 Calculated Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}>
          {/* Card 1: SAR Savings */}
          <div style={{
            background: '#fff',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(141, 184, 51, 0.2)',
            boxShadow: 'var(--shadow-sm)',
            textAlign: isAr ? 'right' : 'left',
          }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(141, 184, 51, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <DollarSign size={22} color="var(--accent-text)" />
            </div>
            <div style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
              {annualSavings.toLocaleString(isAr ? 'ar-SA' : 'en-US')} <span style={{ fontSize: '1rem', fontWeight: 600 }}>{isAr ? 'ر.س' : 'SAR'}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>
              {isAr ? 'وفورات سنوية تقديرية' : 'Estimated Annual Savings'}
            </div>
          </div>

          {/* Card 2: Plastic Diverted */}
          <div style={{
            background: '#fff',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(141, 184, 51, 0.2)',
            boxShadow: 'var(--shadow-sm)',
            textAlign: isAr ? 'right' : 'left',
          }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(74, 94, 42, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Trash2 size={22} color="var(--olive-green)" />
            </div>
            <div style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
              {plasticSavedKg.toLocaleString(isAr ? 'ar-SA' : 'en-US')} <span style={{ fontSize: '1rem', fontWeight: 600 }}>{isAr ? 'كجم' : 'kg'}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>
              {isAr ? 'بلاستيك تم تجنيبه للمكبات' : 'Plastic Landfill Diversion'}
            </div>
          </div>

          {/* Card 3: CO2 Avoided */}
          <div style={{
            background: '#fff',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(141, 184, 51, 0.2)',
            boxShadow: 'var(--shadow-sm)',
            textAlign: isAr ? 'right' : 'left',
          }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(47, 109, 176, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <CloudRain size={22} color="var(--info-strong)" />
            </div>
            <div style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
              {co2AvoidedKg.toLocaleString(isAr ? 'ar-SA' : 'en-US')} <span style={{ fontSize: '1rem', fontWeight: 600 }}>{isAr ? 'كجم CO₂' : 'kg CO₂'}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>
              {isAr ? 'انبعاثات كربونية مُخفّضة' : 'Carbon Emissions Reduced'}
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          paddingTop: '20px',
          borderTop: '1px solid var(--light-grey)',
        }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {isAr
              ? 'هل ترغب في تقرير مخصص لأسطول شركتك؟ احصل على عرض أسعار وخطة استبدال فورية.'
              : 'Need an audit for your office fleet? Get an itemised assessment with exact figures.'}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="btn-primary"
            style={{
              padding: '12px 24px',
              height: '46px',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
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
