'use client';

import { useTranslations } from 'next-intl';
import { useRef, useEffect, useState } from 'react';

function StatCounter({ value, unit, label }: { value: string; unit: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const western = value.replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
  const numVal = parseInt(western.replace(/[^\d]/g, '')) || 0;
  const [count, setCount] = useState(0);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!vis) return;
    let cur = 0; const inc = numVal / 50;
    const iv = setInterval(() => { cur += inc; if (cur >= numVal) { setCount(numVal); clearInterval(iv); } else setCount(Math.floor(cur)); }, 40);
    return () => clearInterval(iv);
  }, [vis, numVal]);
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 800, color: '#8DB833', fontFamily: 'Inter,sans-serif', lineHeight: 1 }}>
        {count.toLocaleString()}<span style={{ fontSize: '0.5em', marginInlineStart: '4px' }}>{unit}</span>
      </div>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: '8px', fontWeight: 500 }}>{label}</div>
    </div>
  );
}

export default function SustainabilitySection() {
  const t = useTranslations('sustainability');
  const milestones = ['2021','2022','2023','2024','2025','2030'] as const;
  const stats = ['co2','trees','plastic'] as const;
  return (
    <section id="sustainability" className="section" style={{ background: 'linear-gradient(135deg,#0F2A1C 0%,#1A3D2B 50%,#0F2A1C 100%)', position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          <span className="section-tag">{t('tag')}</span>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,3.5rem)', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>{t('title')}</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(0.9rem,2vw,1.1rem)', maxWidth: '550px', margin: '0 auto' }}>{t('subtitle')}</p>
        </div>
        <div className="sd-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'clamp(16px,4vw,40px)', marginBottom: 'clamp(40px,8vw,80px)' }}>
          {stats.map(s => (<div key={s} className="glass-dark" style={{ padding: 'clamp(20px,4vw,32px) clamp(16px,3vw,24px)' }}><StatCounter value={t(`stats.${s}.value`)} unit={t(`stats.${s}.unit`)} label={t(`stats.${s}.label`)} /></div>))}
        </div>
        <div style={{ position: 'relative', padding: '40px 0' }}>
          <div className="sd-line" style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,rgba(141,184,51,0.3),transparent)' }} />
          <div className="sd-items" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', position: 'relative' }}>
            {milestones.map(yr => (<div key={yr} style={{ textAlign: 'center', flex: '1 1 100px', minWidth: '80px' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#8DB833', margin: '0 auto 10px', border: '3px solid #0F2A1C', boxShadow: '0 0 0 2px rgba(141,184,51,0.3)' }} /><div style={{ color: '#8DB833', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>{yr}</div><div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', lineHeight: 1.4, maxWidth: '120px', margin: '0 auto' }}>{t(`milestones.${yr}`)}</div></div>))}
          </div>
        </div>
      </div>
      <style jsx>{`@media(max-width:768px){.sd-stats{grid-template-columns:1fr!important}.sd-line{display:none!important}.sd-items{flex-direction:column!important;align-items:flex-start!important;gap:24px!important;padding-left:24px!important;border-left:2px solid rgba(141,184,51,0.3)!important}}`}</style>
    </section>
  );
}
