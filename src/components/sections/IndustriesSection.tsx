'use client';

import { useTranslations } from 'next-intl';
import { HeartPulse, GraduationCap, Building, Scale, ShoppingCart, Landmark, Ruler, Truck, X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDialogA11y } from '@/lib/useDialogA11y';

const INDUSTRIES = ['healthcare', 'education', 'realEstate', 'legal', 'retail', 'government', 'architecture', 'logistics'] as const;
type Industry = typeof INDUSTRIES[number];

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

export default function IndustriesSection() {
  const t = useTranslations('industries');
  const params = useParams();
  const isAr = params.locale === 'ar';
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const closeModal = () => setSelectedIndustry(null);
  const modalRef = useDialogA11y<HTMLDivElement>(selectedIndustry !== null, closeModal);

  useEffect(() => {
    if (selectedIndustry) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedIndustry]);

  return (
    <section id="industries" className="section" style={{ background: '#fff', position: 'relative' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          <span className="section-tag">{t('tag')}</span>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,3.5rem)', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>{t('title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', maxWidth: '550px', margin: '0 auto' }}>{t('subtitle')}</p>
        </div>
        <div className="industries-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '24px' }}>
          {INDUSTRIES.map((ind) => (
            <div key={ind} role="button" tabIndex={0} aria-haspopup="dialog"
              aria-label={t(`items.${ind}.name`)}
              style={{
              padding: 'clamp(20px, 4vw, 32px) clamp(16px, 3vw, 24px)', borderRadius: '16px', background: '#fff', border: '1px solid var(--light-grey)',
              transition: 'all 350ms cubic-bezier(0.34,1.56,0.64,1)', cursor: 'pointer',
              textAlign: isAr ? 'right' : 'left',
            }}
              onClick={() => setSelectedIndustry(ind)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedIndustry(ind); } }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(26,61,43,0.1)'; e.currentTarget.style.borderColor = 'rgba(141,184,51,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--light-grey)'; }}
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
          ))}
        </div>
      </div>

      {/* Modal */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: selectedIndustry ? 1 : 0, pointerEvents: selectedIndustry ? 'auto' : 'none',
        transition: 'opacity 400ms ease', padding: '16px',
      }}
      onClick={closeModal}
      >
        <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="industry-modal-title" tabIndex={-1} className="modal-content" style={{
          width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto',
          background: '#fff', borderRadius: '24px',
          boxShadow: '0 40px 100px rgba(26, 61, 43, 0.15)', overflow: 'hidden', position: 'relative',
          transform: selectedIndustry ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
          transition: 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)',
          border: '1px solid rgba(141, 184, 51, 0.2)',
          direction: isAr ? 'rtl' : 'ltr'
        }}
        onClick={(e) => e.stopPropagation()}
        >
          {selectedIndustry && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="modal-header" style={{
                background: 'linear-gradient(135deg, var(--primary), #4A5E2A)',
                padding: 'clamp(24px, 5vw, 40px) clamp(24px, 5vw, 48px)', color: '#fff', position: 'relative',
                textAlign: isAr ? 'right' : 'left'
              }}>
                <button onClick={closeModal} aria-label={isAr ? 'إغلاق' : 'Close'} style={{
                  position: 'absolute', top: '16px', [isAr ? 'left' : 'right']: '16px',
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', width: '44px', height: '44px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                  <X size={20} />
                </button>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '16px',
                  background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px', border: '1px solid rgba(255,255,255,0.2)',
                  marginLeft: isAr ? 'auto' : '0',
                  marginRight: isAr ? '0' : 'auto',
                }}>
                  {(() => { const icon = ICONS[selectedIndustry]; return <icon.type {...icon.props} color="#fff" size={28} />; })()}
                </div>
                <h3 id="industry-modal-title" style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, marginBottom: '8px' }}>
                  {t(`items.${selectedIndustry}.name`)}
                </h3>
                <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', opacity: 0.9, maxWidth: '80%', marginLeft: isAr ? 'auto' : '0', marginRight: isAr ? '0' : 'auto' }}>
                  {t(`items.${selectedIndustry}.desc`)}
                </p>
              </div>

              <div className="modal-body" style={{ padding: 'clamp(24px, 5vw, 48px)', background: 'var(--bg-secondary)' }}>
                <div className="modal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                  <div style={{
                    background: '#fff', padding: 'clamp(20px, 4vw, 32px)', borderRadius: '24px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid var(--light-grey)',
                    textAlign: isAr ? 'right' : 'left'
                  }}>
                    <div style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: 'var(--accent)', lineHeight: 1, marginBottom: '12px' }}>
                      {t(`items.${selectedIndustry}.details.stat`)}
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary)' }}>
                      {t(`items.${selectedIndustry}.details.statLabel`)}
                    </div>
                  </div>
                  <div style={{
                    background: '#fff', padding: 'clamp(20px, 4vw, 32px)', borderRadius: '24px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid var(--light-grey)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px',
                    textAlign: isAr ? 'right' : 'left'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.95rem', color: '#4B5563', fontWeight: 500 }}>
                        {t(`items.${selectedIndustry}.details.benefit1`)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.95rem', color: '#4B5563', fontWeight: 500 }}>
                        {t(`items.${selectedIndustry}.details.benefit2`)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="modal-cta" style={{ marginTop: 'clamp(24px, 5vw, 48px)', display: 'flex', justifyContent: isAr ? 'flex-start' : 'flex-end' }}>
                  <a href={isAr ? '/ar/contact' : '/en/contact'} onClick={() => setSelectedIndustry(null)} className="modal-cta-btn" style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    background: 'var(--accent)', color: '#fff', padding: '16px 32px',
                    borderRadius: '999px', fontWeight: 700, textDecoration: 'none',
                    transition: 'transform 200ms ease, box-shadow 200ms ease',
                    boxShadow: '0 8px 24px rgba(141,184,51,0.3)', minHeight: '52px',
                    flexDirection: isAr ? 'row-reverse' : 'row'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(141,184,51,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(141,184,51,0.3)'; }}
                  >
                    <span>{isAr ? 'تواصل معنا' : 'Get Started'}</span>
                    <ArrowRight size={20} style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .industries-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
          .modal-content {
            border-radius: 16px !important;
            max-height: 85vh !important;
          }
          .modal-grid {
            grid-template-columns: 1fr !important;
          }
          .modal-cta {
            justify-content: center !important;
          }
          .modal-cta-btn {
            width: 100% !important;
            justify-content: center !important;
          }
        }
        @media (max-width: 480px) {
          .industries-grid {
            grid-template-columns: 1fr !important;
          }
          .modal-content {
            border-radius: 12px !important;
          }
        }
      `}</style>
    </section>
  );
}
