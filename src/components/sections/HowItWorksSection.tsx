'use client';

import { useTranslations } from 'next-intl';
import { useRef, useEffect, useState } from 'react';
import { Printer, Leaf, TrendingUp } from 'lucide-react';

const STEPS = ['get', 'print', 'scale'] as const;
const ICONS = [
  <Printer key="printer" size={28} color="#fff" strokeWidth={1.5} />,
  <Leaf key="leaf" size={28} color="#fff" strokeWidth={1.5} />,
  <TrendingUp key="trend" size={28} color="#fff" strokeWidth={1.5} />
];

export default function HowItWorksSection() {
  const t = useTranslations('howItWorks');
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container" ref={ref}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          <span className="section-tag">{t('tag')}</span>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,3.5rem)', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>{t('title')}</h2>
        </div>
        <div className="hiw-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 'clamp(16px, 3vw, 32px)', position: 'relative' }}>
          {STEPS.map((s,i) => (
            <div key={s} style={{
              textAlign: 'center', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 3vw, 28px)', borderRadius: '20px', background: '#fff',
              boxShadow: '0 4px 24px rgba(26,61,43,0.06)', border: '1px solid rgba(141,184,51,0.1)',
              opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)',
              transition: `all 600ms cubic-bezier(0.22,1,0.36,1) ${i * 150}ms`,
            }}>
              <div style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 900, color: 'rgba(141,184,51,0.15)', fontFamily: 'var(--font-inter),sans-serif', lineHeight: 1, marginBottom: '12px' }}>
                {t(`steps.${s}.number`)}
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg,var(--primary),#4A5E2A)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                {ICONS[i]}
              </div>
              <h3 style={{ color: 'var(--primary)', fontSize: 'clamp(1.05rem, 2.5vw, 1.3rem)', fontWeight: 700, marginBottom: '10px' }}>{t(`steps.${s}.title`)}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: '300px', margin: '0 auto' }}>{t(`steps.${s}.desc`)}</p>
            </div>
          ))}
        </div>
        <div className="connector-lines" style={{ display: 'flex', justifyContent: 'center', gap: '0', marginTop: '-20px', position: 'relative', zIndex: -1 }}>
          {[0,1].map(i => (
            <div key={i} style={{
              width: '30%', height: '2px',
              background: visible ? 'linear-gradient(90deg,transparent,var(--accent),transparent)' : 'transparent',
              transition: `all 800ms ease ${600 + i * 200}ms`,
            }} />
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .connector-lines { display: none !important; }
          .hiw-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
