'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Printer, Leaf, TrendingUp, Droplet } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import CountUp from '@/components/ui/CountUp';

export default function FreePrinterSection() {
  const t = useTranslations('freePrinter');
  const params = useParams();
  const isAr = params.locale === 'ar';
  return (
    <section id="free-printer" className="section" style={{ background: '#FFFFFF' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          <span className="section-tag">{t('tag')}</span>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,3.5rem)', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>{t('title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 2vw, 1.15rem)', maxWidth: '500px', margin: '0 auto' }}>{t('subtitle')}</p>
        </div>
        <div className="fp-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'clamp(16px, 3vw, 32px)', marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          <Reveal delay={0} from="start" className="glass" style={{ padding: 'clamp(20px, 4vw, 40px) clamp(16px, 3vw, 32px)', textAlign: isAr ? 'right' : 'center', background: 'rgba(247,248,245,0.8)' }}>
            <CountUp
              value={isAr ? '٥٠٠ ＋' : '500+'}
              durationMs={2000}
              style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 800, color: 'var(--accent-text)', fontFamily: 'var(--font-inter),sans-serif', lineHeight: 1 }}
            />
            <p style={{ color: '#6B7C3F', fontSize: '0.95rem', fontWeight: 600, marginTop: '8px', marginBottom: '16px', textAlign: isAr ? 'right' : 'center' }}>{t('earn.counter')}</p>
            <h3 style={{ color: 'var(--primary)', fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', marginBottom: '12px', textAlign: isAr ? 'right' : 'center' }}>{t('earn.title')}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '280px', margin: isAr ? '0 0 0 auto' : '0 auto', textAlign: isAr ? 'right' : 'center' }}>{t('earn.desc')}</p>
          </Reveal>
          <Reveal delay={120} from="scale" className="glass" style={{ padding: 'clamp(20px, 4vw, 40px) clamp(16px, 3vw, 32px)', textAlign: 'center', background: 'rgba(232,240,228,0.5)', border: '2px solid rgba(141,184,51,0.2)' }}>
            <h3 style={{ color: 'var(--primary)', fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', marginBottom: '24px' }}>{t('model.title')}</h3>
            {['step1','step2','step3'].map((s,i) => (
              <div key={s}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '12px 16px', background: i===0?'rgba(141,184,51,0.15)':'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: 'var(--text-xl)', display: 'flex' }}>
                    {i === 0 && <Printer size={22} color="var(--accent)" />}
                    {i === 1 && <Leaf size={22} color="var(--accent)" />}
                    {i === 2 && <TrendingUp size={22} color="var(--accent)" />}
                  </span>
                  <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>{t(`model.${s}` as 'model.step1')}</span>
                </div>
                {i < 2 && <div style={{ width: '2px', height: '20px', background: 'linear-gradient(180deg,var(--accent),rgba(141,184,51,0.2))', margin: '0 auto' }} />}
              </div>
            ))}
          </Reveal>
          <Reveal delay={240} from="end" className="glass" style={{ padding: 'clamp(20px, 4vw, 40px) clamp(16px, 3vw, 32px)', textAlign: 'center', background: 'rgba(247,248,245,0.8)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),#4A5E2A)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Droplet size={28} color="#fff" />
            </div>
            <h3 style={{ color: 'var(--primary)', fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', marginBottom: '12px' }}>{t('pay.title')}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '280px', margin: '0 auto' }}>{t('pay.desc')}</p>
          </Reveal>
        </div>
        <div style={{ overflow: 'hidden', padding: '24px 0', borderTop: '1px solid #EEE', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '60px', background: 'linear-gradient(90deg,#fff,transparent)', zIndex: 2 }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '60px', background: 'linear-gradient(270deg,#fff,transparent)', zIndex: 2 }} />
          <div className="ticker-track">
            {/* Industries served, not named clients — reuses the same real
                categories from the Industries page (messages.industries.items)
                rather than inventing company names FNG can't actually back. */}
            {(() => {
              const industries = isAr
                ? ['الرعاية الصحية والمستشفيات', 'التعليم والمدارس', 'العقارات والمقاولات', 'الشؤون القانونية والمالية', 'التجزئة والمطاعم', 'الجهات الحكومية', 'الهندسة والتصميم', 'الخدمات اللوجستية والشحن']
                : ['Healthcare & Clinics', 'Education', 'Real Estate', 'Legal & Finance', 'Retail & F&B', 'Government & Public Sector', 'Architecture & Design', 'Logistics & Operations'];
              // Whole list repeated once (not each item doubled in place) — the
              // ticker animates translateX(-50%), so this exact repetition is
              // what makes the loop seam invisible.
              return [...industries, ...industries];
            })().map((partner, i) => (
              <div key={i} style={{ 
                padding: '0 24px', 
                height: '44px', 
                borderRadius: 'var(--radius-md)', 
                background: 'var(--bg-secondary)', 
                border: '1px solid #EAECE6', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'var(--primary)', 
                fontSize: '0.8rem', 
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {partner}
              </div>
            ))}
          </div>
          <style jsx>{`.ticker-track{display:flex;gap:32px;animation:ticker 20s linear infinite;width:max-content}@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}@media(max-width:768px){.fp-grid{grid-template-columns:1fr!important}}`}</style>
        </div>
      </div>
    </section>
  );
}
