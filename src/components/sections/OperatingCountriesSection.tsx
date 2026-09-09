'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { MapPin } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import FlagIcon from '@/components/ui/FlagIcon';
import { regionName, regionHub } from '@/lib/serviceRegions';
import { useServiceRegions } from '@/components/providers/ServiceRegionsProvider';

/**
 * "We do business in these countries" trust band — placed directly above
 * ContactSection on the pages that sell into a genuinely cross-border
 * audience (Sourcing, Printers). Reads the same live region list as the
 * footer/contact form, so it never drifts from what Admin -> Regions says.
 */
export default function OperatingCountriesSection() {
  const t = useTranslations('operatingCountries');
  const params = useParams();
  const locale = params.locale as string;
  const regions = useServiceRegions();

  return (
    <section className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <Reveal style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 56px)' }}>
          <span className="section-tag">{t('tag')}</span>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,3rem)', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>{t('title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', maxWidth: '680px', margin: '0 auto' }}>{t('subtitle')}</p>
        </Reveal>

        <div className="oc-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${regions.length}, 1fr)`, gap: '20px' }}>
          {regions.map((r, i) => (
            <Reveal key={r.code} delay={i * 80} from="scale" threshold={0.2}>
              <div className="card-lift" style={{
                background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--light-grey)',
                padding: 'clamp(20px, 3vw, 28px) clamp(12px, 2vw, 20px)', textAlign: 'center', height: '100%',
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                  <FlagIcon code={r.code} size={44} />
                </div>
                <h3 style={{ color: 'var(--primary)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>
                  {regionName(r, locale)}
                </h3>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                  color: 'var(--text-secondary)', fontSize: '0.76rem', marginBottom: '12px',
                }}>
                  <MapPin size={12} color="var(--accent-text)" style={{ flexShrink: 0 }} />
                  {regionHub(r, locale)}
                </div>
                <span style={{
                  display: 'inline-block', padding: '3px 10px', borderRadius: 'var(--radius-pill)',
                  fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.03em',
                  color: r.presence === 'office' ? 'var(--accent-text)' : 'var(--text-tertiary)',
                  background: r.presence === 'office' ? 'rgba(141,184,51,0.12)' : 'var(--bg-secondary)',
                  border: `1px solid ${r.presence === 'office' ? 'rgba(141,184,51,0.3)' : 'var(--light-grey)'}`,
                }}>
                  {r.presence === 'office' ? t('officeLabel') : t('marketLabel')}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          .oc-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .oc-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
