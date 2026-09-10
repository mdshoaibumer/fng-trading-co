'use client';

import { useTranslations } from 'next-intl';
import { HeartPulse, GraduationCap, Building, Scale, ShoppingCart, Landmark, Ruler, Truck } from 'lucide-react';
import { useParams } from 'next/navigation';
import Reveal from '@/components/ui/Reveal';

const INDUSTRIES = ['healthcare', 'education', 'realEstate', 'legal', 'retail', 'government', 'architecture', 'logistics'] as const;

const ICONS = {
  healthcare: <HeartPulse size={32} color="var(--accent)" strokeWidth={1.5} />,
  education: <GraduationCap size={32} color="var(--accent)" strokeWidth={1.5} />,
  realEstate: <Building size={32} color="var(--accent)" strokeWidth={1.5} />,
  legal: <Scale size={32} color="var(--accent)" strokeWidth={1.5} />,
  retail: <ShoppingCart size={32} color="var(--accent)" strokeWidth={1.5} />,
  government: <Landmark size={32} color="var(--accent)" strokeWidth={1.5} />,
  architecture: <Ruler size={32} color="var(--accent)" strokeWidth={1.5} />,
  logistics: <Truck size={32} color="var(--accent)" strokeWidth={1.5} />
};

// Static cards: each industry's name and one-line description say all there
// is to say, so there is no detail popup to open.
export default function IndustriesSection() {
  const t = useTranslations('industries');
  const params = useParams();
  const isAr = params.locale === 'ar';

  return (
    <section id="industries" className="section" style={{ background: '#fff', position: 'relative' }}>
      <div className="container">
        <Reveal style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          <span className="section-tag">{t('tag')}</span>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,3.5rem)', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>{t('title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', maxWidth: '550px', margin: '0 auto' }}>{t('subtitle')}</p>
        </Reveal>
        <div className="industries-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '24px' }}>
          {INDUSTRIES.map((ind, i) => (
            // A true diagonal cascade (row + column, assuming the common
            // 4-column desktop layout) rather than every row sweeping
            // left-to-right in lockstep — one more grid on the page with its
            // own stagger identity instead of the same reveal repeated.
            <Reveal key={ind} delay={(Math.floor(i / 4) + (i % 4)) * 70} from="scale" threshold={0.1}>
            <div
              style={{
              padding: 'clamp(20px, 4vw, 32px) clamp(16px, 3vw, 24px)', borderRadius: 'var(--radius-lg)', background: '#fff', border: '1px solid var(--light-grey)',
              height: '100%',
              textAlign: isAr ? 'right' : 'left',
            }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: 'linear-gradient(135deg,rgba(26,61,43,0.08),rgba(141,184,51,0.08))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
                border: '1px solid rgba(141,184,51,0.12)',
                marginLeft: isAr ? 'auto' : '0',
                marginRight: isAr ? '0' : 'auto',
              }}>
                {ICONS[ind]}
              </div>
              <h3 style={{ color: 'var(--primary)', fontSize: 'clamp(0.95rem, 2vw, 1.05rem)', fontWeight: 700, marginBottom: '6px' }}>{t(`items.${ind}.name`)}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>{t(`items.${ind}.desc`)}</p>
            </div>
            </Reveal>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .industries-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 480px) {
          .industries-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
