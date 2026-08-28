'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { UserCheck, BadgeCheck, ShieldCheck, CheckCircle2, ExternalLink } from 'lucide-react';

const POINT_KEYS = ['accountability', 'verified', 'compliance'] as const;
const POINT_ICONS = {
  accountability: <UserCheck size={24} color="#8DB833" strokeWidth={1.5} />,
  verified: <BadgeCheck size={24} color="#8DB833" strokeWidth={1.5} />,
  compliance: <ShieldCheck size={24} color="#8DB833" strokeWidth={1.5} />,
};

// Each card previews the document it links to. The Saudi pair are PDFs, so the
// preview is a WebP rendered from page one; the China licence is already an
// image, so the preview is just a smaller copy of it.
const LICENSES = [
  {
    key: 'saudiCr',
    preview: '/documents/preview-saudi-cr.webp',
    href: '/documents/saudi-commercial-registration.pdf',
  },
  {
    key: 'fng',
    preview: '/documents/preview-fng-licence.webp',
    href: '/documents/fng-trading-licence.pdf',
  },
  {
    key: 'china',
    preview: '/documents/preview-china-license.webp',
    href: '/documents/china-business-license.webp',
  },
] as const;

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
              <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.75rem)', fontWeight: 800, color: '#1A3D2B', marginBottom: '16px' }}>{t('title')}</h2>
              <p style={{ color: '#555', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', lineHeight: 1.7 }}>{t('subtitle')}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {POINT_KEYS.map((key) => (
                <div
                  key={key}
                  className="glass"
                  style={{ padding: '20px 24px', display: 'flex', gap: '16px', alignItems: 'flex-start', flexDirection: isAr ? 'row-reverse' : 'row', textAlign: isAr ? 'right' : 'left', background: 'rgba(247,248,245,0.9)', transition: 'all 350ms cubic-bezier(0.34,1.56,0.64,1)', cursor: 'default' }}
                  // These are full-width rows rather than tiles, so they nudge
                  // along the reading direction instead of lifting — a vertical
                  // hop on a stacked list reads as the row coming loose.
                  onMouseEnter={e => { e.currentTarget.style.transform = isAr ? 'translateX(-6px)' : 'translateX(6px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(26,61,43,0.09)'; e.currentTarget.style.background = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'rgba(247,248,245,0.9)'; }}
                >
                  <div style={{ flexShrink: 0, width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(141,184,51,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {POINT_ICONS[key]}
                  </div>
                  <div>
                    <h3 style={{ color: '#1A3D2B', fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>{t(`points.${key}.title`)}</h3>
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

      <section id="sourcing-licensing" className="section" style={{ background: '#F7F8F5' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 56px)' }}>
            <span className="section-tag">{t('licensing.tag')}</span>
            <h2 style={{ fontSize: 'clamp(1.4rem,3.5vw,2.5rem)', fontWeight: 800, color: '#0F2A1C', marginBottom: '12px' }}>{t('licensing.title')}</h2>
            <p style={{ color: '#4B5563', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>{t('licensing.subtitle')}</p>
          </div>
          <div className="lic-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(16px, 2vw, 24px)' }}>
            {LICENSES.map(({ key, preview, href }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="lic-card"
                style={{
                  display: 'flex', flexDirection: 'column', textDecoration: 'none',
                  background: '#fff', borderRadius: '14px', overflow: 'hidden',
                  border: '1px solid rgba(15,42,28,0.1)',
                  textAlign: isAr ? 'right' : 'left',
                  transition: 'border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease',
                }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '297 / 210', background: '#EDEFEA', borderBottom: '1px solid rgba(15,42,28,0.08)' }}>
                  <Image
                    src={preview}
                    alt=""
                    fill
                    sizes="(max-width: 720px) 92vw, (max-width: 1024px) 46vw, 30vw"
                    style={{ objectFit: 'contain' }}
                  />
                </div>

                <div style={{ padding: 'clamp(16px, 2vw, 22px)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexDirection: isAr ? 'row-reverse' : 'row', marginBottom: '8px' }}>
                    <CheckCircle2 size={18} color="#8DB833" strokeWidth={2} style={{ flexShrink: 0 }} />
                    <h3 style={{ color: '#0F2A1C', fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                      {t(`licensing.${key}Label`)}
                    </h3>
                  </div>

                  <p style={{ color: '#4B5563', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                    {t(`licensing.${key}Value`)}
                  </p>

                  {/* Only the China licence carries a registered entity and a
                      credit code; the Saudi cards stop at the authority. */}
                  {key === 'china' && (
                    <>
                      <p style={{ color: '#0F2A1C', fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.6, margin: '12px 0 0' }}>
                        {t('licensing.chinaEntity')}
                      </p>
                      <div style={{ color: '#6B7280', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '12px' }}>
                        {t('licensing.usccLabel')}
                      </div>
                      <div style={{ color: '#0F2A1C', fontSize: '0.85rem', fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace', marginTop: '2px' }}>
                        {t('licensing.usccValue')}
                      </div>
                    </>
                  )}

                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    flexDirection: isAr ? 'row-reverse' : 'row',
                    alignSelf: isAr ? 'flex-end' : 'flex-start',
                    color: '#5C7F1F', fontSize: '0.85rem', fontWeight: 700,
                    marginTop: 'auto', paddingTop: '20px',
                  }}>
                    {t('licensing.viewDocument')}
                    <ExternalLink size={14} strokeWidth={2} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
        <style jsx>{`
          .lic-card:hover {
            border-color: #8DB833;
            box-shadow: 0 12px 28px rgba(15, 42, 28, 0.1);
            transform: translateY(-2px);
          }
          @media (max-width: 1024px) {
            .lic-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 720px) {
            .lic-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    </>
  );
}
