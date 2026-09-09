'use client';

import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { CheckCircle2, Lock, Clock, Loader2 } from 'lucide-react';
import { regionName } from '@/lib/serviceRegions';
import { useServiceRegions } from '@/components/providers/ServiceRegionsProvider';
import { useLeadContext } from '@/lib/leadContext';
import Reveal from '@/components/ui/Reveal';

export default function ContactSection() {
  const t = useTranslations('contact');
  const params = useParams();
  const pathname = usePathname();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
  // This form is shared across every business page (home, printers,
  // printer-parts, eco-inks, equipment, sourcing) via a single
  // useTranslations('contact') namespace. "Number of Printers Needed" only
  // makes sense on the printer-refurbishment funnel — Sourcing (electronics)
  // and Equipment (office furniture/hardware) get a neutral quantity label
  // instead, so the lead form doesn't ask an out-of-context question on its
  // own primary CTA destination.
  const isPrinterFunnel = !pathname.includes('/sourcing') && !pathname.includes('/equipment');
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const { leadContext, dismiss: dismissLeadContext } = useLeadContext();
  const defaultMessage = leadContext ? (isAr ? leadContext.messageAr : leadContext.messageEn) : '';
  const defaultQuantity = leadContext?.quantity || '1';
  const successRef = useRef<HTMLDivElement>(null);
  // `country` stores the English country name so leads read consistently in
  // the admin panel whichever language the visitor used.
  const serviceRegions = useServiceRegions();
  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    country: serviceRegions[0].nameEn,
    city: '',
    quantity: '1',
    message: '',
    website: '',
  });

  // Move focus to the confirmation once the form is replaced, so a screen
  // reader / keyboard user is taken to the result instead of being left on a
  // submit button that no longer exists.
  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          message: form.message.trim() || defaultMessage,
          quantity: form.quantity || defaultQuantity,
        }),
      });
      if (res.ok) {
        setStatus('success');
      } else if (res.status === 429) {
        setStatus('error');
        setErrorMsg(isAr ? 'محاولات كثيرة جدًا. يرجى المحاولة مرة أخرى بعد دقيقة.' : 'Too many attempts. Please try again in a minute.');
      } else {
        setStatus('error');
        setErrorMsg('');
      }
    } catch { setStatus('error'); setErrorMsg(''); }
  };

  // No outline:none here — the global :focus-visible ring in globals.css is a
  // deliberately engineered two-ring halo (a single accent color failed 3:1
  // contrast on one of the two backgrounds this site uses); inputs keep it
  // instead of substituting a border-color swap.
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 18px', borderRadius: 'var(--radius-md)',
    border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)',
    color: '#fff', fontSize: '0.95rem',
    fontFamily: isAr ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-inter), sans-serif',
    minHeight: '48px',
  };

  return (
    <section id="contact" className="section contact-section" style={{
      background: 'linear-gradient(135deg,var(--bg-darker) 0%,var(--primary) 60%,var(--bg-darker) 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div className="contact-accent" style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(141,184,51,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '64px', alignItems: 'center' }}>
          {/* Left */}
          <Reveal from="start" style={{ textAlign: isAr ? 'right' : 'left' }}>
            <span className="section-tag section-tag--on-dark">{t('tag')}</span>
            <h2 style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>{t('title')}</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', marginBottom: '32px' }}>{t('subtitle')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                <span style={{ display: 'flex' }}><Lock size={18} color="var(--accent)" /></span>
                {/* 0.65 not 0.5 — this section's gradient passes through the
                    lighter deep-forest midpoint, where 0.5 computes to ~4.27:1
                    (fails WCAG 1.4.3's 4.5:1); 0.65 clears it with margin. */}
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>{t('form.privacy')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                <span style={{ display: 'flex' }}><Clock size={18} color="var(--accent)" /></span>
                {/* 0.65 not 0.5 — this section's gradient passes through the
                    lighter deep-forest midpoint, where 0.5 computes to ~4.27:1
                    (fails WCAG 1.4.3's 4.5:1); 0.65 clears it with margin. */}
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>{t('form.response')}</span>
              </div>
            </div>
          </Reveal>

          {/* Right */}
          <Reveal from="end" delay={150} className="glass-dark" style={{ padding: 'clamp(24px, 5vw, 40px) clamp(20px, 4vw, 32px)' }}>
            {status === 'success' ? (
              <div role="status" ref={successRef} tabIndex={-1} style={{ textAlign: 'center', padding: '40px 0', outline: 'none' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                  <CheckCircle2 size={48} color="var(--accent)" strokeWidth={1.5} />
                </div>
                <p style={{ color: 'var(--accent)', fontSize: '1.1rem', fontWeight: 600 }}>{t('form.success')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Honeypot: hidden from real visitors, tempting to bots that auto-fill every field.
                    Clipped to 1x1px in place rather than pushed off-canvas with a huge negative
                    offset — that older technique still contributes to the page's scrollable area,
                    and under RTL a mobile browser can expand the whole layout viewport to reach it. */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
                  style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0, opacity: 0 }}
                  value={form.website}
                  onChange={e => setForm(f => ({ ...f, website: e.target.value }))} />
                {leadContext && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(141,184,51,0.15)',
                    border: '1px solid rgba(141,184,51,0.3)',
                    color: '#fff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    flexDirection: isAr ? 'row-reverse' : 'row',
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
                      <span>{isAr ? leadContext.badgeAr : leadContext.badgeEn}</span>
                    </span>
                    <button
                      type="button"
                      onClick={dismissLeadContext}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255,255,255,0.6)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        padding: '2px 6px',
                        lineHeight: 1,
                      }}
                      aria-label={isAr ? 'إلغاء التحديد' : 'Clear selection'}
                    >
                      ✕
                    </button>
                  </div>
                )}
                <label htmlFor="contact-name" className="sr-only">{t('form.name')}</label>
                <input id="contact-name" style={inputStyle} placeholder={t('form.name')} required aria-required="true" autoComplete="name" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                <label htmlFor="contact-company" className="sr-only">{t('form.company')}</label>
                <input id="contact-company" style={inputStyle} placeholder={t('form.company')} required aria-required="true" autoComplete="organization" value={form.company}
                  onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                <div className="contact-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label htmlFor="contact-phone" className="sr-only">{t('form.phone')}</label>
                    <input id="contact-phone" style={inputStyle} placeholder={t('form.phone')} type="tel" required aria-required="true" autoComplete="tel" value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="sr-only">{t('form.email')}</label>
                    <input id="contact-email" style={inputStyle} placeholder={t('form.email')} type="email" autoComplete="email" value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                </div>
                <div className="contact-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label htmlFor="contact-country" className="sr-only">{t('form.country')}</label>
                    <select id="contact-country" style={{ ...inputStyle, cursor: 'pointer' }} value={form.country}
                      onChange={e => setForm(f => ({ ...f, country: e.target.value }))}>
                      {serviceRegions.map(r => (
                        <option key={r.code} value={r.nameEn} style={{ color: '#000' }}>{regionName(r, locale)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contact-city" className="sr-only">{t('form.city')}</label>
                    <input id="contact-city" style={inputStyle} placeholder={t('form.city')} autoComplete="address-level2" value={form.city}
                      onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-quantity" style={{ display: 'block', color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', textAlign: isAr ? 'right' : 'left' }}>{isPrinterFunnel ? t('form.quantity') : t('form.quantityGeneric')}</label>
                  <select id="contact-quantity" style={{ ...inputStyle, cursor: 'pointer' }} value={form.quantity || defaultQuantity}
                    onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}>
                    {[1,2,3,5,10,20].map(n => <option key={n} value={n} style={{ color: '#000' }}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-message" className="sr-only">{t('form.message')}</label>
                  <textarea id="contact-message" rows={3} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                    placeholder={t('form.message')}
                    value={form.message || defaultMessage}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px', minHeight: '48px' }}
                  disabled={status === 'loading'} aria-busy={status === 'loading'}>
                  {status === 'loading'
                    ? <><Loader2 size={18} style={{ animation: 'ui-loading-spin 1s linear infinite' }} aria-hidden="true" /> {t('form.submit')}</>
                    : t('form.submit')}
                </button>
                {status === 'error' && <p role="alert" style={{ color: '#FF8A80', fontSize: '0.85rem', textAlign: 'center' }}>{errorMsg || t('form.error')}</p>}
              </form>
            )}
          </Reveal>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .contact-accent {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .contact-form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
