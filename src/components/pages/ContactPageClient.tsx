'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { CheckCircle2, MapPin, Mail, Phone, Clock, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { SITE_EMAIL } from '@/lib/siteContact';
import { officeRegions, regionName, regionHub } from '@/lib/serviceRegions';
import { useServiceRegions } from '@/components/providers/ServiceRegionsProvider';

export default function ContactPageClient({ email }: { email?: string }) {
  const t = useTranslations('contact');
  const tp = useTranslations('contactPage');
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const successRef = useRef<HTMLDivElement>(null);
  const serviceRegions = useServiceRegions();
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', industry: '', country: serviceRegions[0].nameEn, city: '', message: '', quantity: '1', website: '' });

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
        body: JSON.stringify(form),
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

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '16px 20px', borderRadius: 'var(--radius-lg)',
    border: '1px solid #E5E7EB', background: '#F9FAFB',
    color: '#111827', fontSize: 'var(--text-base)', outline: 'none',
    transition: 'all 200ms ease',
    fontFamily: isAr ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-inter), sans-serif',
  };

  return (
    <main style={{ background: '#FFFFFF', minHeight: '100vh', paddingTop: 'var(--page-top)' }}>
      
      {/* Page Header */}
      <div className="container" style={{ textAlign: 'center', marginBottom: '80px' }}>
        <span className="section-tag" style={{ margin: '0 auto 16px' }}>{tp('title')}</span>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: 'var(--primary)', marginBottom: '24px', letterSpacing: '-0.02em' }}>
          {t('title')}
        </h1>
        <p style={{ color: '#4B5563', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          {tp('subtitle')}
        </p>
      </div>

      <div className="container">
        <div className="contact-grid-outer" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))', gap: 'clamp(40px, 6vw, 64px)', paddingBottom: '120px' }}>
          
          {/* Left Column - Contact Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            
            {/* Benefits Section */}
            <div>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Zap color="var(--accent)" />
                {tp('benefits.title')}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(141,184,51,0.1)' }}>
                    <CheckCircle2 color="var(--accent)" size={20} />
                    <span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '1.05rem' }}>
                      {tp(`benefits.item${num}` as Parameters<typeof tp>[0])}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin color="var(--accent)" />
                {tp('locations')}
              </h3>
              {/* One card per country with an FNG office, then a chip row for
                  every market served. Both come from the live region list
                  (Admin -> Regions); the address lines live in
                  messages/*.json (contactPage.*), keyed by country code, so a
                  country added in Admin shows its hub city until a matching
                  address key is translated. */}
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px', textAlign: isAr ? 'right' : 'left' }}>{tp('offices')}</p>
              <div className="office-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                {officeRegions(serviceRegions).map((r) => {
                  const addressKey = ({ SA: 'hqAddress', AE: 'uaeAddress', CN: 'cnAddress', OM: 'omAddress' } as Record<string, string>)[r.code];
                  const titleKey = ({ SA: 'hq', AE: 'uae', CN: 'cn', OM: 'om' } as Record<string, string>)[r.code];
                  return (
                    <div key={r.code} className="office-card" style={{
                      padding: '20px 22px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--light-grey)',
                      textAlign: isAr ? 'right' : 'left', transition: 'transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <span aria-hidden="true" style={{
                          fontFamily: 'var(--font-ibm-plex-mono), monospace', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em',
                          padding: '4px 8px', borderRadius: 'var(--radius-sm)', background: 'rgba(141,184,51,0.14)', color: '#5C7F1F', border: '1px solid rgba(141,184,51,0.3)',
                        }}>{r.code}</span>
                        <h4 style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.02rem', margin: 0 }}>
                          {titleKey ? tp(titleKey as Parameters<typeof tp>[0]) : regionName(r, locale)}
                        </h4>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9rem', margin: 0 }}>
                        {addressKey ? tp(addressKey as Parameters<typeof tp>[0]) : regionHub(r, locale)}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px', textAlign: isAr ? 'right' : 'left' }}>{tp('markets')}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {serviceRegions.map((r) => (
                  <span key={r.code} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: 'var(--radius-pill)',
                    background: r.presence === 'office' ? 'rgba(141,184,51,0.12)' : 'var(--bg-secondary)',
                    border: `1px solid ${r.presence === 'office' ? 'rgba(141,184,51,0.4)' : 'var(--light-grey)'}`,
                    color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 600,
                  }}>
                    <span aria-hidden="true" style={{ fontFamily: 'var(--font-ibm-plex-mono), monospace', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.06em', color: r.presence === 'office' ? '#5C7F1F' : '#6B7280' }}>{r.code}</span>{regionName(r, locale)}
                  </span>
                ))}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '12px', textAlign: isAr ? 'right' : 'left' }}>{tp('marketsNote')}</p>
            </div>

            {/* Direct Contact */}
            <div>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone color="var(--accent)" />
                {tp('contactInfo')}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(141,184,51,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail color="var(--accent)" size={24} />
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>{tp('emailLabel')}</p>
                    <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem' }}>{email || SITE_EMAIL}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(141,184,51,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone color="var(--accent)" size={24} />
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>{tp('phoneLabel')}</p>
                    <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem' }}>{tp('phoneValue')}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(141,184,51,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock color="var(--accent)" size={24} />
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>{tp('hoursLabel')}</p>
                    <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem' }}>{tp('hoursValue')}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - The Form */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '32px',
            padding: '48px 40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.05)',
            border: '1px solid var(--light-grey)',
            position: 'relative'
          }}>
            {status === 'success' ? (
              <div role="status" ref={successRef} tabIndex={-1} style={{ textAlign: 'center', padding: '60px 0', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', outline: 'none' }}>
                <div style={{ fontSize: '3rem', marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                  <CheckCircle2 size={64} color="var(--accent)" strokeWidth={1.5} />
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>{isAr ? 'تم استلام طلبك' : 'Request Received'}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>{t('form.success')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Honeypot: hidden from real visitors, tempting to bots that auto-fill every field.
                    Clipped to 1x1px in place rather than pushed off-canvas with a huge negative
                    offset — that older technique still contributes to the page's scrollable area,
                    and under RTL a mobile browser can expand the whole layout viewport to reach it. */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
                  style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0, opacity: 0 }}
                  value={form.website}
                  onChange={e => setForm(f => ({ ...f, website: e.target.value }))} />
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>{isAr ? 'أرسل رسالة' : 'Send a Message'}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{isAr ? 'املأ النموذج أدناه وسنعاود التواصل معك قريباً.' : 'Fill out the form below and we will get back to you shortly.'}</p>
                
                <div className="form-row" style={{ gap: '20px' }}>
                  <div>
                    <label htmlFor="contact-page-name" className="sr-only">{t('form.name')}</label>
                    <input id="contact-page-name" style={inputStyle} placeholder={t('form.name')} required aria-required="true" autoComplete="name" value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = '#fff'; }}
                      onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB'; }} />
                  </div>
                  <div>
                    <label htmlFor="contact-page-company" className="sr-only">{t('form.company')}</label>
                    <input id="contact-page-company" style={inputStyle} placeholder={t('form.company')} required aria-required="true" autoComplete="organization" value={form.company}
                      onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                      onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = '#fff'; }}
                      onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB'; }} />
                  </div>
                </div>

                <div className="form-row" style={{ gap: '20px' }}>
                  <div>
                    <label htmlFor="contact-page-email" className="sr-only">{t('form.email')}</label>
                    <input id="contact-page-email" style={inputStyle} placeholder={t('form.email')} type="email" required aria-required="true" autoComplete="email" value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = '#fff'; }}
                      onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB'; }} />
                  </div>
                  <div>
                    <label htmlFor="contact-page-phone" className="sr-only">{t('form.phone')}</label>
                    <input id="contact-page-phone" style={inputStyle} placeholder={t('form.phone')} type="tel" required aria-required="true" autoComplete="tel" value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = '#fff'; }}
                      onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB'; }} />
                  </div>
                </div>

                <div className="form-row" style={{ gap: '20px' }}>
                  <div>
                    <label htmlFor="contact-page-country" className="sr-only">{t('form.country')}</label>
                    <select id="contact-page-country" style={{ ...inputStyle, cursor: 'pointer' }} value={form.country}
                      onChange={e => setForm(f => ({ ...f, country: e.target.value }))}>
                      {serviceRegions.map(r => (
                        <option key={r.code} value={r.nameEn}>{regionName(r, locale)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contact-page-city" className="sr-only">{t('form.city')}</label>
                    <input id="contact-page-city" style={inputStyle} placeholder={t('form.city')} value={form.city} required aria-required="true" autoComplete="address-level2"
                      onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                      onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = '#fff'; }}
                      onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB'; }} />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-page-industry" className="sr-only">{t('form.industry')}</label>
                  <input id="contact-page-industry" style={inputStyle} placeholder={t('form.industry')} value={form.industry} required
                    onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                    onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB'; }} />
                </div>

                <div>
                  <label htmlFor="contact-page-message" className="sr-only">{t('form.message')}</label>
                  <textarea id="contact-page-message" style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder={t('form.message')} value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB'; }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor="contact-page-quantity" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{t('form.quantity')}</label>
                  <select id="contact-page-quantity" style={{ ...inputStyle, cursor: 'pointer' }} value={form.quantity}
                    onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}>
                    {[1, 2, 3, 5, 10, 20, '50+'].map(n => <option key={n} value={n} style={{ color: '#000' }}>{n}</option>)}
                  </select>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px', padding: '18px', fontSize: '1.1rem', borderRadius: 'var(--radius-lg)' }}
                  disabled={status === 'loading'} aria-busy={status === 'loading'}>
                  {status === 'loading'
                    ? <><Loader2 size={20} style={{ animation: 'ui-loading-spin 1s linear infinite' }} aria-hidden="true" /> {t('form.submit')}</>
                    : t('form.submit')}
                </button>

                {status === 'error' && <p role="alert" style={{ color: '#C0392B', fontSize: '0.9rem', textAlign: 'center', marginTop: '8px' }}>{errorMsg || t('form.error')}</p>}
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
                  <ShieldCheck size={16} color="var(--accent)" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{t('form.privacy')}</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .office-card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(26,61,43,0.08); border-color: rgba(141,184,51,0.4) !important; }
        @media (max-width: 768px) {
          .form-row { grid-template-columns: 1fr; }
          .office-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
