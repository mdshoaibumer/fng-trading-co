'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { ShieldCheck, Truck, BadgeCheck } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SpotlightCard from '@/components/ui/SpotlightCard';
import BorderBeam from '@/components/ui/BorderBeam';

// Replaces the previous testimonial cards, which carried invented names and
// content-free quotes ("Highly recommended.") under a "Trust & Credibility"
// eyebrow — the exact shape a B2B buyer reads as fake. These three are
// guarantees FNG actually stands behind, so the section earns trust with
// specifics instead of asserting it. Kept bilingual in-component because they
// are fixed operational commitments, not editable marketing copy.
export default function TrustSection() {
  const t = useTranslations('trust');
  const params = useParams();
  const isAr = params.locale === 'ar';
  const certs = isAr ? [
    'السجل التجاري: 1010724885',
    'الرقم الضريبي ZATCA: 310382948200003',
    'الفوترة الإلكترونية المرحلة ٢',
    'معايير فحص المصنع المعتمدة',
  ] : [
    'Saudi CR: 1010724885',
    'ZATCA VAT: 310382948200003',
    'E-Invoicing Fatoora Phase II',
    'Factory Refurbishment Standards',
  ];

  const guarantees = [
    {
      icon: ShieldCheck,
      titleEn: '12-Month Warranty', titleAr: 'ضمان 12 شهراً',
      descEn: 'Every refurbished unit is inspected, cleaned and load-tested, then backed by a full one-year FNG warranty.',
      descAr: 'كل وحدة مُجددة يتم فحصها وتنظيفها واختبارها تحت الحِمل، ثم تُدعم بضمان FNG كامل لمدة عام.',
    },
    {
      icon: Truck,
      titleEn: '48-Hour Delivery & Install', titleAr: 'توصيل وتركيب خلال 48 ساعة',
      descEn: 'Delivered and set up at your office within two working days across Saudi Arabia — no downtime while you switch.',
      descAr: 'التوصيل والتركيب في مكتبك خلال يومَي عمل في جميع أنحاء المملكة — دون توقّف أثناء الانتقال.',
    },
    {
      icon: BadgeCheck,
      titleEn: 'Registered & Licensed', titleAr: 'مُسجّلة ومُرخّصة',
      descEn: 'A fully licensed Saudi trading company with verified import operations from China — real paperwork, real accountability.',
      descAr: 'شركة تجارية سعودية مرخّصة بالكامل مع عمليات استيراد موثّقة من الصين — أوراق حقيقية ومسؤولية حقيقية.',
    },
  ];

  return (
    <section id="trust" className="section" style={{ background: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div className="trust-ambient-blob" style={{
        position: 'absolute', bottom: '-15%', [isAr ? 'right' : 'left']: '-8%', width: '520px', height: '520px',
        background: 'radial-gradient(circle, rgba(47,109,176,0.05) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          <span className="section-tag">{t('tag')}</span>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,3.5rem)', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>{t('title')}</h2>
        </div>
        <div className="trust-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))', gap: 'clamp(16px, 3vw, 24px)', marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          {guarantees.map((g, i) => {
            const Icon = g.icon;
            // Same start/scale/end trio FreePrinterSection uses for its own
            // row of cards — a deliberate alternation, not the single 'up'
            // fade every other grid on the page defaults to.
            const directions = ['start', 'scale', 'end'] as const;
            return (
              <Reveal key={i} delay={i * 120} from={directions[i % 3]} style={{ display: 'flex' }}>
              <SpotlightCard
                className="card-lift"
                spotlightColor="rgba(141, 184, 51, 0.18)"
                borderRadius="var(--radius-lg)"
                style={{
                  padding: 'clamp(24px, 4vw, 32px) clamp(20px, 3vw, 28px)', borderRadius: 'var(--radius-lg)', background: '#fff', height: '100%', width: '100%',
                  border: '1px solid var(--light-grey)', borderBottom: '3px solid var(--primary)',
                  boxShadow: 'var(--shadow-sm)',
                  textAlign: isAr ? 'right' : 'left',
                  position: 'relative',
                }}
              >
                {i === 0 && <BorderBeam size={220} duration={8} colorFrom="var(--accent)" colorTo="var(--olive-green)" />}
                <div style={{
                  width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, rgba(26,61,43,0.08), rgba(141,184,51,0.10))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px',
                  border: '1px solid rgba(141,184,51,0.14)',
                  marginInlineStart: 0, marginInlineEnd: 'auto',
                  animation: 'floating-subtle 3.5s ease-in-out infinite',
                  animationDelay: `${i * 0.3}s`,
                }}>
                  <Icon size={24} color="var(--accent-text)" strokeWidth={1.8} />
                </div>
                <h3 style={{ color: 'var(--primary)', fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '8px' }}>
                  {isAr ? g.titleAr : g.titleEn}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7, margin: 0 }}>
                  {isAr ? g.descAr : g.descEn}
                </p>
              </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {certs.map((c, i) => (
            <Reveal key={c} delay={300 + i * 90} from="scale">
              {/* A brief ring-pulse once each badge lands, timed to start after
                  Reveal's own 700ms fade+scale finishes — reads as the badge
                  "confirming" itself rather than just appearing, which fits
                  what this row is actually claiming (verified, not decorative). */}
              <div className="cert-badge-stamp" style={{
                padding: '8px 16px', borderRadius: 'var(--radius-pill)',
                background: 'var(--bg-secondary)', border: '1px solid rgba(47,109,176,0.2)',
                color: 'var(--info-strong)', fontSize: 'var(--text-xs)', fontWeight: 600,
                fontFamily: 'var(--font-mono)', letterSpacing: '0.05em',
                animationDelay: `${300 + i * 90 + 650}ms`,
              }}>
                {c}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .trust-grid { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: no-preference) {
          .trust-ambient-blob { animation: trustBlobDrift 18s ease-in-out infinite; }
        }
        @keyframes trustBlobDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(3%, -4%) scale(1.1); }
        }
      `}</style>
      <style jsx global>{`
        @media (prefers-reduced-motion: no-preference) {
          .cert-badge-stamp {
            animation: certBadgeStamp 900ms ease-out both;
          }
        }
        @keyframes certBadgeStamp {
          0% { box-shadow: 0 0 0 0 rgba(47,109,176,0.4); border-color: rgba(47,109,176,0.5); }
          70% { box-shadow: 0 0 0 8px rgba(47,109,176,0); }
          100% { box-shadow: 0 0 0 0 rgba(47,109,176,0); border-color: rgba(47,109,176,0.2); }
        }
      `}</style>
    </section>
  );
}
