'use client';

import { useTranslations } from 'next-intl';
import { useRef, useEffect, useState } from 'react';
import { Printer, Leaf, TrendingUp } from 'lucide-react';
import { useParams } from 'next/navigation';
import Reveal from '@/components/ui/Reveal';
import SpotlightCard from '@/components/ui/SpotlightCard';
import AnimatedBeam from '@/components/ui/AnimatedBeam';

const STEPS = ['get', 'print', 'scale'] as const;
const ICONS = [
  <Printer key="printer" size={28} color="#fff" strokeWidth={1.5} />,
  <Leaf key="leaf" size={28} color="#fff" strokeWidth={1.5} />,
  <TrendingUp key="trend" size={28} color="#fff" strokeWidth={1.5} />
];

export default function HowItWorksSection() {
  const t = useTranslations('howItWorks');
  const params = useParams();
  const isAr = params.locale === 'ar';
  const ref = useRef<HTMLDivElement>(null);
  const [linesDrawn, setLinesDrawn] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLinesDrawn(true);
      return;
    }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setLinesDrawn(true); obs.disconnect(); }
    }, { threshold: 0.2 });
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="section" style={{ background: 'var(--bg-secondary)', isolation: 'isolate' }}>
      <div className="container" ref={ref}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          <span className="section-tag">{t('tag')}</span>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,3.5rem)', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>{t('title')}</h2>
        </div>
        <div className="hiw-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 'clamp(16px, 3vw, 32px)', position: 'relative' }}>
          {STEPS.map((s,i) => (
            <Reveal key={s} delay={i * 150} style={{ display: 'flex' }}>
              <SpotlightCard
                className="card-lift"
                spotlightColor="rgba(141, 184, 51, 0.16)"
                borderRadius="var(--radius-2xl)"
                style={{
                  textAlign: 'center', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 3vw, 28px)', borderRadius: 'var(--radius-2xl)', background: '#fff',
                  boxShadow: '0 4px 24px rgba(26,61,43,0.06)', border: '1px solid rgba(141,184,51,0.14)', width: '100%',
                }}
              >
                <div style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 900, color: 'rgba(141,184,51,0.18)', fontFamily: 'var(--font-inter),sans-serif', lineHeight: 1, marginBottom: '12px' }}>
                  {t(`steps.${s}.number`)}
                </div>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: 'linear-gradient(135deg,var(--primary),#4A5E2A)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                  animation: 'floating-subtle 3.5s ease-in-out infinite',
                  animationDelay: `${i * 0.4}s`,
                }}>
                  {ICONS[i]}
                </div>
                <h3 style={{ color: 'var(--primary)', fontSize: 'clamp(1.05rem, 2.5vw, 1.3rem)', fontWeight: 700, marginBottom: '10px' }}>{t(`steps.${s}.title`)}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: '300px', margin: '0 auto' }}>{t(`steps.${s}.desc`)}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
        <div className="connector-lines" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '-14px', position: 'relative', zIndex: -1, padding: '0 10%' }}>
          <AnimatedBeam duration={4} reverse={isAr} colorFrom="var(--accent)" colorTo="var(--olive-green)" />
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
