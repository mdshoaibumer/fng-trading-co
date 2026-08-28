'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { CheckCircle2, MapPin, Mail, Phone, Clock, ShieldCheck, Zap } from 'lucide-react';

export default function ContactPageClient() {
  const t = useTranslations('contact');
  const tp = useTranslations('contactPage');
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', industry: '', city: '', message: '', quantity: '1' });

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
    width: '100%', padding: '16px 20px', borderRadius: '16px',
    border: '1px solid #E5E7EB', background: '#F9FAFB',
    color: '#111827', fontSize: '1rem', outline: 'none',
    transition: 'all 200ms ease',
    fontFamily: isAr ? 'IBM Plex Sans Arabic, sans-serif' : 'Inter, sans-serif',
  };

  return (
    <main style={{ background: '#FFFFFF', minHeight: '100vh', paddingTop: '120px' }}>
      
      {/* Page Header */}
      <div className="container" style={{ textAlign: 'center', marginBottom: '80px' }}>
        <span className="section-tag" style={{ margin: '0 auto 16px' }}>{tp('title')}</span>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: '#1A3D2B', marginBottom: '24px', letterSpacing: '-0.02em' }}>
          {t('title')}
        </h1>
        <p style={{ color: '#4B5563', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          {tp('subtitle')}
        </p>
      </div>

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '64px', paddingBottom: '120px' }}>
          
          {/* Left Column - Contact Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            
            {/* Benefits Section */}
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1A3D2B', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Zap color="#8DB833" />
                {tp('benefits.title')}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#F7F8F5', borderRadius: '16px', border: '1px solid rgba(141,184,51,0.1)' }}>
                    <CheckCircle2 color="#8DB833" size={20} />
                    <span style={{ fontWeight: 600, color: '#1A3D2B', fontSize: '1.05rem' }}>
                      {tp(`benefits.item${num}` as Parameters<typeof tp>[0])}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1A3D2B', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin color="#8DB833" />
                {tp('locations')}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ padding: '24px', background: '#F7F8F5', borderRadius: '20px', border: '1px solid #EEEEEE' }}>
                  <h4 style={{ fontWeight: 700, color: '#1A3D2B', fontSize: '1.1rem', marginBottom: '8px' }}>{tp('hq')}</h4>
                  <p style={{ color: '#555', lineHeight: 1.6 }}>{tp('hqAddress')}</p>
                </div>
                <div style={{ padding: '24px', background: '#F7F8F5', borderRadius: '20px', border: '1px solid #EEEEEE' }}>
                  <h4 style={{ fontWeight: 700, color: '#1A3D2B', fontSize: '1.1rem', marginBottom: '8px' }}>{tp('uae')}</h4>
                  <p style={{ color: '#555', lineHeight: 1.6 }}>{tp('uaeAddress')}</p>
                </div>
              </div>
            </div>

            {/* Direct Contact */}
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1A3D2B', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone color="#8DB833" />
                {tp('contactInfo')}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(141,184,51,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail color="#8DB833" size={24} />
                  </div>
                  <div>
                    <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '4px' }}>{tp('emailLabel')}</p>
                    <p style={{ color: '#1A3D2B', fontWeight: 700, fontSize: '1.1rem' }}>{tp('emailValue')}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(141,184,51,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone color="#8DB833" size={24} />
                  </div>
                  <div>
                    <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '4px' }}>{tp('phoneLabel')}</p>
                    <p style={{ color: '#1A3D2B', fontWeight: 700, fontSize: '1.1rem' }}>{tp('phoneValue')}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(141,184,51,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock color="#8DB833" size={24} />
                  </div>
                  <div>
                    <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '4px' }}>{tp('hoursLabel')}</p>
                    <p style={{ color: '#1A3D2B', fontWeight: 700, fontSize: '1.1rem' }}>{tp('hoursValue')}</p>
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
            border: '1px solid #EEEEEE',
            position: 'relative'
          }}>
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '60px 0', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                  <CheckCircle2 size={64} color="#8DB833" strokeWidth={1.5} />
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1A3D2B', marginBottom: '12px' }}>Request Received</h3>
                <p style={{ color: '#555', fontSize: '1.1rem', lineHeight: 1.6 }}>{t('form.success')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1A3D2B', marginBottom: '8px' }}>Send a Message</h3>
                <p style={{ color: '#555', marginBottom: '24px' }}>Fill out the form below and we will get back to you shortly.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <input style={inputStyle} placeholder={t('form.name')} required value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    onFocus={e => { e.target.style.borderColor = '#8DB833'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB'; }} />
                  <input style={inputStyle} placeholder={t('form.company')} required value={form.company}
                    onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                    onFocus={e => { e.target.style.borderColor = '#8DB833'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB'; }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <input style={inputStyle} placeholder={t('form.email')} type="email" required value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    onFocus={e => { e.target.style.borderColor = '#8DB833'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB'; }} />
                  <input style={inputStyle} placeholder={t('form.phone')} type="tel" required value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    onFocus={e => { e.target.style.borderColor = '#8DB833'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB'; }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <input style={inputStyle} placeholder={t('form.city')} value={form.city} required
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    onFocus={e => { e.target.style.borderColor = '#8DB833'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB'; }} />
                  <input style={inputStyle} placeholder={t('form.industry')} value={form.industry} required
                    onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                    onFocus={e => { e.target.style.borderColor = '#8DB833'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB'; }} />
                </div>

                <textarea style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder={t('form.message')} value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  onFocus={e => { e.target.style.borderColor = '#8DB833'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB'; }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', color: '#555', fontWeight: 600 }}>{t('form.quantity')}</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.quantity}
                    onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}>
                    {[1, 2, 3, 5, 10, 20, '50+'].map(n => <option key={n} value={n} style={{ color: '#000' }}>{n}</option>)}
                  </select>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px', padding: '18px', fontSize: '1.1rem', borderRadius: '16px' }}
                  disabled={status === 'loading'}>
                  {status === 'loading' ? '...' : t('form.submit')}
                </button>
                
                {status === 'error' && <p style={{ color: '#C0392B', fontSize: '0.9rem', textAlign: 'center', marginTop: '8px' }}>{t('form.error')}</p>}
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
                  <ShieldCheck size={16} color="#8DB833" />
                  <span style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>{t('form.privacy')}</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
