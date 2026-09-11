'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { CheckCircle2, MapPin, Mail, Phone, Clock, ShieldCheck, Zap, Loader2, AlertCircle } from 'lucide-react';
import { SITE_EMAIL } from '@/lib/siteContact';
import { officeRegions, regionName, regionHub } from '@/lib/serviceRegions';
import { useServiceRegions } from '@/components/providers/ServiceRegionsProvider';
import { useLeadContext, CATEGORY_CONFIG } from '@/lib/leadContext';
import Reveal from '@/components/ui/Reveal';
import PhoneInput from '@/components/ui/PhoneInput';
import {
  validateEmail,
  validatePhone,
  formatFullPhone,
  findCountryConfig,
} from '@/lib/formValidation';

// `phone` is Admin -> Settings -> Phone Number; the translated copy is only
// the fallback for when that setting is blank.
export default function ContactPageClient({ email, phone }: { email?: string; phone?: string }) {
  const t = useTranslations('contact');
  const tp = useTranslations('contactPage');
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const { leadContext, categoryFromPath, dismiss: dismissLeadContext } = useLeadContext();
  const defaultMessage = leadContext ? (isAr ? leadContext.messageAr : leadContext.messageEn) : '';
  const defaultQuantity = leadContext?.quantity || '1';
  const activeCategory = leadContext?.category || categoryFromPath;
  const categoryConfig = CATEGORY_CONFIG[activeCategory];
  const successRef = useRef<HTMLDivElement>(null);
  const serviceRegions = useServiceRegions();
  const initialCountry = serviceRegions[0]?.nameEn || 'Saudi Arabia';
  const initialDialCode = findCountryConfig(initialCountry).dialCode;

  const [dialCode, setDialCode] = useState(initialDialCode);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    industry: '',
    country: initialCountry,
    city: '',
    message: '',
    quantity: '1',
    _hp_company_fax: '',
  });

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  const handleCountryChange = (countryName: string) => {
    setForm(f => ({ ...f, country: countryName }));
    const cfg = findCountryConfig(countryName);
    if (cfg && cfg.dialCode !== dialCode) {
      setDialCode(cfg.dialCode);
      if (form.phone) {
        setPhoneError(validatePhone(form.phone, cfg.dialCode, locale));
      }
    }
  };

  const handleDialCodeChange = (newDialCode: string) => {
    setDialCode(newDialCode);
    if (form.phone) {
      setPhoneError(validatePhone(form.phone, newDialCode, locale));
    }
  };

  const handlePhoneChange = (newPhone: string) => {
    setForm(f => ({ ...f, phone: newPhone }));
    if (phoneError) {
      setPhoneError(validatePhone(newPhone, dialCode, locale));
    }
  };

  const handleEmailChange = (newEmail: string) => {
    setForm(f => ({ ...f, email: newEmail }));
    if (emailError) {
      setEmailError(validateEmail(newEmail, false, locale));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation before submission
    const pErr = validatePhone(form.phone, dialCode, locale);
    // Email and city are optional here, matching every other lead form and
    // the API (which requires only name, company and phone).
    const eErr = validateEmail(form.email, false, locale);

    if (pErr || eErr) {
      setPhoneError(pErr);
      setEmailError(eErr);
      return;
    }

    setStatus('loading');
    setErrorMsg('');
    try {
      const fullPhone = formatFullPhone(dialCode, form.phone);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          phone: fullPhone,
          message: form.message.trim() || defaultMessage,
          quantity: form.quantity || defaultQuantity,
          category: activeCategory,
          queryItem: leadContext ? (isAr ? leadContext.badgeAr : leadContext.badgeEn) : undefined,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setStatus('success');
      } else if (res.status === 429) {
        setStatus('error');
        setErrorMsg(isAr ? 'محاولات كثيرة جدًا. يرجى المحاولة مرة أخرى بعد دقيقة.' : (data?.error || 'Too many attempts. Please try again in a minute.'));
      } else {
        setStatus('error');
        setErrorMsg(data?.error || (isAr ? 'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.' : 'Failed to send message. Please try again.'));
      }
    } catch {
      setStatus('error');
      setErrorMsg(isAr ? 'خطأ في الاتصال بالشبكة. يرجى التحقق من اتصالك.' : 'Network connection error. Please check your connection.');
    }
  };

  // No outline:none here — the global :focus-visible ring in globals.css is a
  // deliberately engineered two-ring halo (a single accent color failed 3:1
  // contrast on one of the two backgrounds this site uses); inputs keep it
  // instead of substituting a border/background swap.
  const inputStyle: React.CSSProperties = {
    width: '100%', maxWidth: '100%', boxSizing: 'border-box', padding: '16px 20px', borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--light-grey)', background: 'var(--bg-secondary)',
    color: 'var(--text-primary)', fontSize: 'var(--text-base)',
    fontFamily: isAr ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-inter), sans-serif',
  };

  return (
    <main style={{ background: '#FFFFFF', minHeight: '100vh', paddingTop: 'var(--page-top)', overflowX: 'clip' }}>

      {/* Page Header */}
      <div className="container" style={{ textAlign: 'center', marginBottom: '80px' }}>
        <span className="section-tag" style={{ margin: '0 auto 16px' }}>{tp('title')}</span>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: 'var(--primary)', marginBottom: '24px', letterSpacing: '-0.02em' }}>
          {t('title')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-md)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          {tp('subtitle')}
        </p>
      </div>

      <div className="container">
        <div className="contact-grid-outer" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 'clamp(32px, 5vw, 64px)', paddingBottom: 'clamp(60px, 10vh, 120px)', alignItems: 'start' }}>
          
          {/* Left Column - Contact Information */}
          <Reveal from="start" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            
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
                          padding: '4px 8px', borderRadius: 'var(--radius-sm)', background: 'rgba(141,184,51,0.14)', color: 'var(--accent-text)', border: '1px solid rgba(141,184,51,0.3)',
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
                    <span aria-hidden="true" style={{ fontFamily: 'var(--font-ibm-plex-mono), monospace', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.06em', color: r.presence === 'office' ? 'var(--accent-text)' : 'var(--text-tertiary)' }}>{r.code}</span>{regionName(r, locale)}
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
                    <a href={`mailto:${email || SITE_EMAIL}`} style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none' }}>{email || SITE_EMAIL}</a>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(141,184,51,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone color="var(--accent)" size={24} />
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>{tp('phoneLabel')}</p>
                    <a href={`tel:${(phone?.trim() || tp('phoneValue')).replace(/[^\d+]/g, '')}`} dir="ltr" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none' }}>{phone?.trim() || tp('phoneValue')}</a>
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

          </Reveal>

          {/* Right Column - The Form */}
          <Reveal from="end" delay={150} style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(28px, 5vw, 48px) clamp(16px, 4vw, 40px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.05)',
            border: '1px solid var(--light-grey)',
            position: 'relative',
            maxWidth: '100%',
            boxSizing: 'border-box',
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
                {/* Honeypot: hidden from real visitors, tempting to bots that auto-fill every field. */}
                <input type="text" name="_hp_company_fax" tabIndex={-1} autoComplete="new-password" aria-hidden="true" aria-label="Fax"
                  style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0, opacity: 0 }}
                  value={form._hp_company_fax}
                  onChange={e => setForm(f => ({ ...f, _hp_company_fax: e.target.value }))} />
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>{isAr ? 'أرسل رسالة' : 'Send a Message'}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{isAr ? 'املأ النموذج أدناه وسنعاود التواصل معك قريباً.' : 'Fill out the form below and we will get back to you shortly.'}</p>

                {leadContext && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(141,184,51,0.12)',
                    border: '1px solid rgba(141,184,51,0.3)',
                    color: 'var(--primary)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    marginBottom: '8px',
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
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        padding: '2px 6px',
                      }}
                      aria-label={isAr ? 'إلغاء التحديد' : 'Clear selection'}
                    >
                      ✕
                    </button>
                  </div>
                )}
                
                <div className="form-row" style={{ gap: '20px' }}>
                  <div>
                    <label htmlFor="contact-page-name" className="sr-only">{t('form.name')}</label>
                    <input id="contact-page-name" style={inputStyle} placeholder={`${t('form.name')} *`} required aria-required="true" autoComplete="name" value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label htmlFor="contact-page-company" className="sr-only">{t('form.company')}</label>
                    <input id="contact-page-company" style={inputStyle} placeholder={`${t('form.company')} *`} required aria-required="true" autoComplete="organization" value={form.company}
                      onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                  </div>
                </div>

                <div className="form-row" style={{ gap: '20px' }}>
                  <div>
                    <label htmlFor="contact-page-email" className="sr-only">{t('form.email')}</label>
                    <input
                      id="contact-page-email"
                      style={{
                        ...inputStyle,
                        border: emailError ? '1px solid #DC2626' : inputStyle.border,
                      }}
                      placeholder={t('form.email')}
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={e => handleEmailChange(e.target.value)}
                      onBlur={() => setEmailError(validateEmail(form.email, false, locale))}
                      aria-invalid={Boolean(emailError)}
                    />
                    {emailError && (
                      <div
                        role="alert"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginTop: '6px',
                          color: '#DC2626',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          textAlign: isAr ? 'right' : 'left',
                          flexDirection: isAr ? 'row-reverse' : 'row',
                        }}
                      >
                        <AlertCircle size={14} style={{ flexShrink: 0 }} />
                        <span>{emailError}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="contact-page-phone" className="sr-only">{t('form.phone')}</label>
                    <PhoneInput
                      id="contact-page-phone"
                      theme="light"
                      locale={locale}
                      dialCode={dialCode}
                      onDialCodeChange={handleDialCodeChange}
                      value={form.phone}
                      onChange={handlePhoneChange}
                      error={phoneError}
                      placeholder={`${t('form.phone')} *`}
                    />
                  </div>
                </div>

                <div className="form-row" style={{ gap: '20px' }}>
                  <div>
                    <label htmlFor="contact-page-country" className="sr-only">{t('form.country')}</label>
                    <select id="contact-page-country" style={{ ...inputStyle, cursor: 'pointer' }} value={form.country}
                      onChange={e => handleCountryChange(e.target.value)}>
                      {serviceRegions.map(r => (
                        <option key={r.code} value={r.nameEn}>{regionName(r, locale)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contact-page-city" className="sr-only">{t('form.city')}</label>
                    <input id="contact-page-city" style={inputStyle} placeholder={t('form.city')} value={form.city} autoComplete="address-level2"
                      onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-page-industry" className="sr-only">{t('form.industry')}</label>
                  <input id="contact-page-industry" style={inputStyle} placeholder={t('form.industry')} value={form.industry}
                    onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} />
                </div>

                <div>
                  <label htmlFor="contact-page-message" className="sr-only">{t('form.message')}</label>
                  <textarea id="contact-page-message" style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                    placeholder={t('form.message')}
                    value={form.message || defaultMessage}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor="contact-page-quantity" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{isAr ? categoryConfig.quantityLabelAr : categoryConfig.quantityLabelEn}</label>
                  <select id="contact-page-quantity" style={{ ...inputStyle, cursor: 'pointer' }} value={form.quantity || defaultQuantity}
                    onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}>
                    {categoryConfig.options.map(n => <option key={n} value={n} style={{ color: '#000' }}>{n}</option>)}
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
          </Reveal>
        </div>
      </div>
      <style jsx>{`
        .form-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 20px; min-width: 0; }
        .form-row > * { min-width: 0; max-width: 100%; }
        .office-card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(26,61,43,0.08); border-color: rgba(141,184,51,0.4) !important; }
        @media (max-width: 768px) {
          .form-row { grid-template-columns: minmax(0, 1fr); gap: 16px; }
          .office-grid { grid-template-columns: minmax(0, 1fr) !important; }
        }
      `}</style>
    </main>
  );
}
