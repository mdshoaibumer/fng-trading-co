'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Laptop, Smartphone, BatteryCharging, Headphones, Watch, Router, Home, Gamepad2 } from 'lucide-react';

const CATEGORY_KEYS = ['computers', 'mobileAccessories', 'chargers', 'audio', 'wearables', 'networking', 'smartHome', 'gaming'] as const;

const ICONS: Record<typeof CATEGORY_KEYS[number], React.ReactNode> = {
  computers: <Laptop size={26} color="var(--accent)" strokeWidth={1.5} />,
  mobileAccessories: <Smartphone size={26} color="var(--accent)" strokeWidth={1.5} />,
  chargers: <BatteryCharging size={26} color="var(--accent)" strokeWidth={1.5} />,
  audio: <Headphones size={26} color="var(--accent)" strokeWidth={1.5} />,
  wearables: <Watch size={26} color="var(--accent)" strokeWidth={1.5} />,
  networking: <Router size={26} color="var(--accent)" strokeWidth={1.5} />,
  smartHome: <Home size={26} color="var(--accent)" strokeWidth={1.5} />,
  gaming: <Gamepad2 size={26} color="var(--accent)" strokeWidth={1.5} />,
};

export default function SourcingCategoriesSection() {
  const t = useTranslations('sourcingCategories');
  const params = useParams();
  const isAr = params.locale === 'ar';

  return (
    <section id="sourcing-categories" className="section" style={{ background: '#fff' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          <span className="section-tag">{t('tag')}</span>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,3.5rem)', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>{t('title')}</h2>
          <p style={{ color: '#555', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', maxWidth: '600px', margin: '0 auto' }}>{t('subtitle')}</p>
        </div>
        <div className="sc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {CATEGORY_KEYS.map((key) => (
            <div key={key} style={{
              padding: 'clamp(18px, 3vw, 24px)', borderRadius: '16px', background: '#fff', border: '1px solid #EEEEEE',
              transition: 'all 350ms cubic-bezier(0.34,1.56,0.64,1)', textAlign: isAr ? 'right' : 'left',
              cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(26,61,43,0.1)'; e.currentTarget.style.borderColor = 'rgba(141,184,51,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#EEEEEE'; }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'linear-gradient(135deg,rgba(26,61,43,0.08),rgba(141,184,51,0.08))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px',
                border: '1px solid rgba(141,184,51,0.12)', marginLeft: isAr ? 'auto' : '0', marginRight: isAr ? '0' : 'auto',
              }}>
                {ICONS[key]}
              </div>
              <h3 style={{ color: 'var(--primary)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>{t(`items.${key}.name`)}</h3>
              <p style={{ color: '#555', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '14px' }}>{t(`items.${key}.desc`)}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ padding: '4px 10px', borderRadius: '999px', background: 'var(--bg-secondary)', color: '#4A5E2A', fontSize: '0.7rem', fontWeight: 600, fontFamily: 'var(--font-ibm-plex-mono), monospace' }}>
                  {t(`items.${key}.moq`)}
                </span>
                <span style={{ padding: '4px 10px', borderRadius: '999px', background: 'var(--bg-secondary)', color: '#4A5E2A', fontSize: '0.7rem', fontWeight: 600, fontFamily: 'var(--font-ibm-plex-mono), monospace' }}>
                  {t(`items.${key}.lead`)}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p style={{ color: '#888', fontSize: '0.8rem', lineHeight: 1.7, marginTop: 'clamp(24px, 4vw, 40px)', textAlign: 'center', maxWidth: '700px', marginInline: 'auto' }}>
          {t('footnote')}
        </p>
      </div>
      <style jsx>{`
        @media (max-width: 1024px) {
          .sc-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .sc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
