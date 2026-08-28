'use client';

import { useTranslations } from 'next-intl';
import { Leaf, RefreshCcw, Wind } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { useIsClient } from '@/lib/useIsClient';

function AnimatedStat({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const isMounted = useIsClient();

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let cur = 0; const inc = target / 60;
    const iv = setInterval(() => { 
      cur += inc; 
      if (cur >= target) { 
        setCount(target); 
        clearInterval(iv); 
      } else {
        setCount(Math.floor(cur)); 
      }
    }, 33);
    return () => clearInterval(iv);
  }, [started, target]);

  const displayedCount = isMounted ? count : target;

  return (
    <div ref={ref} style={{ background: '#fff', padding: 'clamp(24px, 4vw, 40px)', borderRadius: '24px', border: '1px solid #EEEEEE', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
      <div style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 900, color: 'var(--accent)', lineHeight: 1, marginBottom: '12px', fontFamily: 'var(--font-inter), sans-serif' }}>
        {displayedCount.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: 'clamp(0.9rem, 2vw, 1.2rem)', fontWeight: 700, color: 'var(--primary)' }}>{label}</div>
    </div>
  );
}

export default function SustainabilityPageClient() {
  const t = useTranslations('sustainability');
  return (
    <main style={{ background: 'var(--bg-secondary)', minHeight: '100vh', paddingTop: 'clamp(100px, 14vh, 160px)', paddingBottom: 'clamp(48px, 8vh, 120px)' }}>
      <div className="container" style={{ textAlign: 'center', marginBottom: 'clamp(40px, 8vw, 80px)' }}>
        <span className="section-tag" style={{ margin: '0 auto 16px' }}>{t('tag')}</span>
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)', fontWeight: 900, color: 'var(--primary)', marginBottom: '24px', letterSpacing: '-0.02em' }}>{t('title')}</h1>
        <p style={{ color: '#4B5563', fontSize: 'clamp(0.95rem, 2vw, 1.2rem)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>{t('subtitle')}</p>
      </div>
      <div className="container" style={{ marginBottom: 'clamp(40px, 8vw, 80px)' }}>
        <div className="sp-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'clamp(16px, 3vw, 32px)' }}>
          <AnimatedStat target={124} suffix=" tons" label={t('stats.co2.label')} />
          <AnimatedStat target={2500} suffix=" trees" label={t('stats.trees.label')} />
          <AnimatedStat target={85} suffix="%" label={t('stats.plastic.label')} />
        </div>
      </div>
      <div className="container">
        <div style={{ background: 'linear-gradient(135deg, #1A3D2B, #0F2A1C)', padding: 'clamp(24px, 5vw, 64px)', borderRadius: 'clamp(16px, 3vw, 32px)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(141,184,51,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, color: '#fff', marginBottom: 'clamp(24px, 5vw, 48px)', textAlign: 'center', position: 'relative', zIndex: 2 }}>The Eco Inks Cycle</h2>
          <div className="sp-cycle" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'clamp(20px, 4vw, 40px)', position: 'relative', zIndex: 2 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 'clamp(56px, 8vw, 80px)', height: 'clamp(56px, 8vw, 80px)', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Leaf size={32} color="var(--accent)" />
              </div>
              <h3 style={{ color: '#fff', fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: 700, marginBottom: '12px' }}>Bio-Derived</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontSize: '0.9rem' }}>We use plant-based resins and sustainable sourcing instead of petroleum bases for all our toner powders.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 'clamp(56px, 8vw, 80px)', height: 'clamp(56px, 8vw, 80px)', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Wind size={32} color="var(--accent)" />
              </div>
              <h3 style={{ color: '#fff', fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: 700, marginBottom: '12px' }}>Zero VOC</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontSize: '0.9rem' }}>Our toners emit zero Volatile Organic Compounds, ensuring safe and clean air quality in your office.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 'clamp(56px, 8vw, 80px)', height: 'clamp(56px, 8vw, 80px)', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <RefreshCcw size={32} color="var(--accent)" />
              </div>
              <h3 style={{ color: '#fff', fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: 700, marginBottom: '12px' }}>Closed-Loop</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontSize: '0.9rem' }}>We collect all empty cartridges directly from your office. Plastics are melted down and reused for new supplies.</p>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`@media(max-width:768px){.sp-stats{grid-template-columns:1fr!important}.sp-cycle{grid-template-columns:1fr!important}}`}</style>
    </main>
  );
}
