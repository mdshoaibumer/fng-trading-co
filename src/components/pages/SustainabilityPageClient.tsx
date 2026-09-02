'use client';

import { useTranslations } from 'next-intl';
import { Leaf, RefreshCcw, Wind } from 'lucide-react';
import CountUp from '@/components/ui/CountUp';
import Reveal from '@/components/ui/Reveal';

/**
 * Stat card. The counting itself lives in <CountUp>, which — unlike the
 * hand-rolled setInterval version this replaced — drives the count on
 * requestAnimationFrame with an ease-out, renders the final figure on the
 * server so it survives without JS, and stops animating for visitors who ask
 * for reduced motion.
 */
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <Reveal style={{ display: 'flex' }}>
      <div className="card-lift" style={{ background: '#fff', padding: 'clamp(24px, 4vw, 40px)', borderRadius: '24px', border: '1px solid var(--light-grey)', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', width: '100%' }}>
        <CountUp
          value={value}
          style={{ display: 'block', fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 900, color: 'var(--accent)', lineHeight: 1, marginBottom: '12px', fontFamily: 'var(--font-inter), sans-serif' }}
        />
        <div style={{ fontSize: 'clamp(0.9rem, 2vw, 1.2rem)', fontWeight: 700, color: 'var(--primary)' }}>{label}</div>
      </div>
    </Reveal>
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
          <StatCard value={`124 ${t('stats.co2.unit')}`} label={t('stats.co2.label')} />
          <StatCard value={`2,500 ${t('stats.trees.unit')}`} label={t('stats.trees.label')} />
          <StatCard value="85%" label={t('stats.plastic.label')} />
        </div>
      </div>
      <div className="container">
        <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--bg-darker))', padding: 'clamp(24px, 5vw, 64px)', borderRadius: 'clamp(16px, 3vw, 32px)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(141,184,51,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, color: '#fff', marginBottom: 'clamp(24px, 5vw, 48px)', textAlign: 'center', position: 'relative', zIndex: 2 }}>{t('cycle.title')}</h2>
          <div className="sp-cycle" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'clamp(20px, 4vw, 40px)', position: 'relative', zIndex: 2 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 'clamp(56px, 8vw, 80px)', height: 'clamp(56px, 8vw, 80px)', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Leaf size={32} color="var(--accent)" />
              </div>
              <h3 style={{ color: '#fff', fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: 700, marginBottom: '12px' }}>{t('cycle.bio.title')}</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontSize: '0.9rem' }}>{t('cycle.bio.desc')}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 'clamp(56px, 8vw, 80px)', height: 'clamp(56px, 8vw, 80px)', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Wind size={32} color="var(--accent)" />
              </div>
              <h3 style={{ color: '#fff', fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: 700, marginBottom: '12px' }}>{t('cycle.voc.title')}</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontSize: '0.9rem' }}>{t('cycle.voc.desc')}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 'clamp(56px, 8vw, 80px)', height: 'clamp(56px, 8vw, 80px)', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <RefreshCcw size={32} color="var(--accent)" />
              </div>
              <h3 style={{ color: '#fff', fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: 700, marginBottom: '12px' }}>{t('cycle.loop.title')}</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontSize: '0.9rem' }}>{t('cycle.loop.desc')}</p>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`@media(max-width:768px){.sp-stats{grid-template-columns:1fr!important}.sp-cycle{grid-template-columns:1fr!important}}`}</style>
    </main>
  );
}
