'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Leaf, Wind, Recycle, CheckCircle2, ThermometerSun, Zap } from 'lucide-react';

const FEATURES = ['bio', 'voc', 'recycle', 'quality', 'temp', 'energy'] as const;
const ICONS = [
  <Leaf key="bio" className="w-6 h-6" color="var(--accent)" strokeWidth={1.5} />,
  <Wind key="voc" className="w-6 h-6" color="var(--accent)" strokeWidth={1.5} />,
  <Recycle key="recycle" className="w-6 h-6" color="var(--accent)" strokeWidth={1.5} />,
  <CheckCircle2 key="quality" className="w-6 h-6" color="var(--accent)" strokeWidth={1.5} />,
  <ThermometerSun key="temp" className="w-6 h-6" color="var(--accent)" strokeWidth={1.5} />,
  <Zap key="energy" className="w-6 h-6" color="var(--accent)" strokeWidth={1.5} />
];

export default function EcoInksSection() {
  const t = useTranslations('ecoInks');
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
  return (
    <section id="eco-inks" className="section" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
      <div className="eco-glow" style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(141,184,51,0.05) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          <span className="section-tag" style={{ background: 'rgba(141,184,51,0.1)', color: 'var(--accent)', border: '1px solid rgba(141,184,51,0.2)' }}>{t('tag')}</span>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,3.5rem)', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>{t('title')}</h2>
          <p style={{ color: '#4B5563', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', maxWidth: '600px', margin: '0 auto' }}>{t('subtitle')}</p>
        </div>
        <div className="eco-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 'clamp(12px, 3vw, 24px)' }}>
          {FEATURES.map((f, i) => (
            <div key={f} style={{
              background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '20px',
              padding: 'clamp(20px, 4vw, 32px) clamp(16px, 3vw, 28px)',
              transition: 'all 350ms cubic-bezier(0.34,1.56,0.64,1)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              textAlign: isAr ? 'right' : 'left'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(141,184,51,0.4)'; e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#F3F4F6'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; }}
            >
              <div style={{ 
                width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(141,184,51,0.12)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', 
                border: '1px solid rgba(141,184,51,0.2)',
                marginLeft: isAr ? 'auto' : '0',
                marginRight: isAr ? '0' : 'auto',
              }}>
                {ICONS[i]}
              </div>
              <h3 style={{ color: 'var(--accent)', fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', fontWeight: 700, marginBottom: '8px' }}>{t(`features.${f}.title`)}</h3>
              <p style={{ color: '#4B5563', fontSize: '0.85rem', lineHeight: 1.6 }}>{t(`features.${f}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .eco-grid { grid-template-columns: 1fr !important; }
          .eco-glow { display: none !important; }
        }
      `}</style>
    </section>
  );
}
