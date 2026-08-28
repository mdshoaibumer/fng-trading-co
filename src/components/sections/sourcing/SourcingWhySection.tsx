'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { UserCheck, BadgeCheck, ShieldCheck } from 'lucide-react';

const POINT_KEYS = ['accountability', 'verified', 'compliance'] as const;
const POINT_ICONS = {
  accountability: <UserCheck size={24} color="var(--accent)" strokeWidth={1.5} />,
  verified: <BadgeCheck size={24} color="var(--accent)" strokeWidth={1.5} />,
  compliance: <ShieldCheck size={24} color="var(--accent)" strokeWidth={1.5} />,
};

const LICENSE_ROWS = ['saudiCr', 'fng', 'china', 'uscc'] as const;

export default function SourcingWhySection() {
  const t = useTranslations('sourcingWhy');
  const params = useParams();
  const isAr = params.locale === 'ar';

  return (
    <>
      <section id="sourcing-why" className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 6vw, 64px)', alignItems: 'center' }}>
            <div style={{ textAlign: isAr ? 'right' : 'left' }}>
              <span className="section-tag">{t('tag')}</span>
              <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.75rem)', fontWeight: 800, color: 'var(--primary)', marginBottom: '16px' }}>{t('title')}</h2>
              <p style={{ color: '#555', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', lineHeight: 1.7 }}>{t('subtitle')}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {POINT_KEYS.map((key) => (
                <div key={key} className="glass" style={{ padding: '20px 24px', display: 'flex', gap: '16px', alignItems: 'flex-start', flexDirection: isAr ? 'row-reverse' : 'row', textAlign: isAr ? 'right' : 'left', background: 'rgba(247,248,245,0.9)' }}>
                  <div style={{ flexShrink: 0, width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(141,184,51,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {POINT_ICONS[key]}
                  </div>
                  <div>
                    <h3 style={{ color: 'var(--primary)', fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>{t(`points.${key}.title`)}</h3>
                    <p style={{ color: '#555', fontSize: '0.85rem', lineHeight: 1.6 }}>{t(`points.${key}.desc`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style jsx>{`
          @media (max-width: 900px) {
            .why-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      <section id="sourcing-licensing" className="section" style={{ background: 'linear-gradient(135deg, #1A3D2B 0%, #0F2A1C 100%)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 56px)' }}>
            <span className="section-tag">{t('licensing.tag')}</span>
            <h2 style={{ fontSize: 'clamp(1.4rem,3.5vw,2.5rem)', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>{t('licensing.title')}</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', maxWidth: '600px', margin: '0 auto' }}>{t('licensing.subtitle')}</p>
          </div>
          <div className="lic-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {LICENSE_ROWS.map((key) => (
              <div key={key} className="glass-dark" style={{ padding: '20px', textAlign: isAr ? 'right' : 'left' }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  {t(`licensing.${key}Label`)}
                </div>
                <div style={{ color: '#fff', fontSize: '0.85rem', lineHeight: 1.6, fontWeight: 600 }}>
                  {t(`licensing.${key}Value`)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <style jsx>{`
          @media (max-width: 1024px) {
            .lic-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 480px) {
            .lic-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    </>
  );
}
