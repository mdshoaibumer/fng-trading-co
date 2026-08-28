'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { CheckCircle2, Lock, Clock } from 'lucide-react';

export default function ContactSection() {
  const t = useTranslations('contact');
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [form, setForm] = useState({ name: '', company: '', phone: '', city: '', quantity: '1', website: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch { setStatus('error'); }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 18px', borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)',
    color: '#fff', fontSize: '0.95rem', outline: 'none',
    transition: 'border-color 200ms ease',
    fontFamily: isAr ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-inter), sans-serif',
    minHeight: '48px',
  };

  return (
    <section id="contact" className="section contact-section" style={{
      background: 'linear-gradient(135deg,#0F2A1C 0%,#1A3D2B 60%,#0F2A1C 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div className="contact-accent" style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(141,184,51,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '64px', alignItems: 'center' }}>
          {/* Left */}
          <div style={{ textAlign: isAr ? 'right' : 'left' }}>
            <span className="section-tag">{t('tag')}</span>
            <h2 style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>{t('title')}</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', marginBottom: '32px' }}>{t('subtitle')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                <span style={{ display: 'flex' }}><Lock size={18} color="var(--accent)" /></span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{t('form.privacy')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                <span style={{ display: 'flex' }}><Clock size={18} color="var(--accent)" /></span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{t('form.response')}</span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="glass-dark" style={{ padding: 'clamp(24px, 5vw, 40px) clamp(20px, 4vw, 32px)' }}>
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
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
                <label htmlFor="contact-name" className="sr-only">{t('form.name')}</label>
                <input id="contact-name" style={inputStyle} placeholder={t('form.name')} required value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')} />
                <label htmlFor="contact-company" className="sr-only">{t('form.company')}</label>
                <input id="contact-company" style={inputStyle} placeholder={t('form.company')} required value={form.company}
                  onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                  onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')} />
                <label htmlFor="contact-phone" className="sr-only">{t('form.phone')}</label>
                <input id="contact-phone" style={inputStyle} placeholder={t('form.phone')} type="tel" required value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')} />
                <div className="contact-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label htmlFor="contact-city" className="sr-only">{t('form.city')}</label>
                    <input id="contact-city" style={inputStyle} placeholder={t('form.city')} value={form.city}
                      onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                      onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')} />
                  </div>
                  <div>
                    <label htmlFor="contact-quantity" className="sr-only">{t('form.quantity')}</label>
                    <select id="contact-quantity" style={{ ...inputStyle, cursor: 'pointer' }} value={form.quantity}
                      onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}>
                      {[1,2,3,5,10,20].map(n => <option key={n} value={n} style={{ color: '#000' }}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px', minHeight: '48px' }}
                  disabled={status === 'loading'}>
                  {status === 'loading' ? '...' : t('form.submit')}
                </button>
                {status === 'error' && <p style={{ color: '#C0392B', fontSize: '0.85rem', textAlign: 'center' }}>{t('form.error')}</p>}
              </form>
            )}
          </div>
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
