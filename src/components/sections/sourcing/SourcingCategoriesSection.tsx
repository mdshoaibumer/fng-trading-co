'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Reveal from '@/components/ui/Reveal';
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
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', maxWidth: '600px', margin: '0 auto' }}>{t('subtitle')}</p>
        </div>
        <div className="sc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {CATEGORY_KEYS.map((key, i) => (
            <Reveal key={key} delay={(i % 4) * 80} from="scale" threshold={0.1}>
            <div className="card-lift category-card" style={{ height: '100%',
              padding: 'clamp(18px, 3vw, 24px)', borderRadius: 'var(--radius-lg)', background: '#fff', border: '1px solid var(--light-grey)',
              textAlign: isAr ? 'right' : 'left', cursor: 'default',
              ['--lift-shadow' as string]: '0 12px 40px rgba(26,61,43,0.1)',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg,rgba(26,61,43,0.08),rgba(141,184,51,0.08))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px',
                border: '1px solid rgba(141,184,51,0.12)', marginLeft: isAr ? 'auto' : '0', marginRight: isAr ? '0' : 'auto',
              }}>
                {ICONS[key]}
              </div>
              <h3 style={{ color: 'var(--primary)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>{t(`items.${key}.name`)}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '14px' }}>{t(`items.${key}.desc`)}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-pill)', background: 'var(--bg-secondary)', color: '#4A5E2A', fontSize: '0.7rem', fontWeight: 600, fontFamily: 'var(--font-ibm-plex-mono), monospace' }}>
                  {t(`items.${key}.moq`)}
                </span>
                <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-pill)', background: 'var(--bg-secondary)', color: '#4A5E2A', fontSize: '0.7rem', fontWeight: 600, fontFamily: 'var(--font-ibm-plex-mono), monospace' }}>
                  {t(`items.${key}.lead`)}
                </span>
              </div>
            </div>
            </Reveal>
          ))}
        </div>
        <p style={{ color: '#888', fontSize: '0.8rem', lineHeight: 1.7, marginTop: 'clamp(24px, 4vw, 40px)', textAlign: 'center', maxWidth: '700px', marginInline: 'auto' }}>
          {t('footnote')}
        </p>
      </div>
      <style jsx>{`
        @media (hover: hover) {
          .category-card:hover { border-color: rgba(141, 184, 51, 0.3); }
        }
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
