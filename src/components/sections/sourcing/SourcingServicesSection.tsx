'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Reveal from '@/components/ui/Reveal';
import { ShieldCheck, ClipboardCheck, Search, Layers, Ship, FileCheck } from 'lucide-react';

const SERVICE_KEYS = ['verification', 'audit', 'qc', 'consolidation', 'freight', 'customs'] as const;

const ICONS: Record<typeof SERVICE_KEYS[number], React.ReactNode> = {
  verification: <ShieldCheck size={26} color="#fff" strokeWidth={1.5} />,
  audit: <Search size={26} color="#fff" strokeWidth={1.5} />,
  qc: <ClipboardCheck size={26} color="#fff" strokeWidth={1.5} />,
  consolidation: <Layers size={26} color="#fff" strokeWidth={1.5} />,
  freight: <Ship size={26} color="#fff" strokeWidth={1.5} />,
  customs: <FileCheck size={26} color="#fff" strokeWidth={1.5} />,
};

export default function SourcingServicesSection() {
  const t = useTranslations('sourcingServices');
  const params = useParams();
  const isAr = params.locale === 'ar';

  return (
    <section id="sourcing-services" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          <span className="section-tag">{t('tag')}</span>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,3.5rem)', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>{t('title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', maxWidth: '600px', margin: '0 auto' }}>{t('subtitle')}</p>
        </div>
        <div className="ss-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(16px, 3vw, 24px)' }}>
          {SERVICE_KEYS.map((key, i) => (
            <Reveal key={key} delay={(i % 3) * 100} threshold={0.1}>
            <div className="card-lift service-card" style={{ height: '100%',
              padding: 'clamp(20px, 4vw, 28px)', borderRadius: 'var(--radius-2xl)', background: '#fff',
              boxShadow: '0 4px 24px rgba(26,61,43,0.06)', border: '1px solid rgba(141,184,51,0.1)',
              textAlign: isAr ? 'right' : 'left', cursor: 'default',
              ['--lift-shadow' as string]: '0 16px 40px rgba(26,61,43,0.12)',
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg,var(--primary),#4A5E2A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
                marginLeft: isAr ? 'auto' : '0', marginRight: isAr ? '0' : 'auto',
              }}>
                {ICONS[key]}
              </div>
              <h3 style={{ color: 'var(--primary)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px' }}>{t(`items.${key}.name`)}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7 }}>{t(`items.${key}.desc`)}</p>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (hover: hover) {
          .service-card:hover { border-color: rgba(141, 184, 51, 0.35); }
        }
        @media (max-width: 768px) {
          .ss-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
