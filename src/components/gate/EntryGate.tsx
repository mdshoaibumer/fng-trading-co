'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useDialogA11y } from '@/lib/useDialogA11y';
import { markGateSeen } from '@/lib/entryGate';

// Gate-only photography. The catalog keeps its own cutout of the M428fdw
// under /printers/... for the product pages — these two exist just to give
// the gate a matched pair of full-bleed shots.
const PRINTER_IMAGE = '/gate-printer.webp';
const SOURCING_IMAGE = '/sourcing-ship.webp';

// Both panels frame their photo identically: fill the square, then grade the
// lower edge into the card so the shot reads as part of the panel rather than
// a rectangle pasted onto it.
function PanelPhoto({ src }: { src: string }) {
  return (
    <div style={{
      position: 'relative', width: '100%', aspectRatio: '1 / 1', borderRadius: '12px',
      overflow: 'hidden', background: 'linear-gradient(135deg, rgba(141,184,51,0.18), rgba(74,144,217,0.12))',
      marginBottom: '20px', border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <Image
        src={src}
        alt=""
        width={1000}
        height={1333}
        priority
        sizes="(max-width: 768px) 90vw, 45vw"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(15,42,28,0.55) 0%, rgba(15,42,28,0.12) 30%, transparent 60%)',
      }} />
    </div>
  );
}

export default function EntryGate() {
  const t = useTranslations('gate');
  const tNav = useTranslations('nav');
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
  const otherLocale = isAr ? 'en' : 'ar';
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(true);
  const markSeen = markGateSeen;

  const dismiss = () => {
    markSeen();
    setOpen(false);
    // Drop the ?gate=1 that asked for this chooser, so the URL matches what is
    // actually on screen and the Navbar's logo — which links to ?gate=1 — stays
    // a real URL change that can bring the chooser back. replaceState rather
    // than router.replace: this must not refetch the route, which would tear
    // the gate out of the tree mid-fade.
    if (window.location.search) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const dialogRef = useDialogA11y<HTMLDivElement>(open, dismiss);

  // Scroll lock, plus a flag the stylesheet uses to take the floating chrome
  // (nav bar, WhatsApp button) off the screen entirely while the chooser is
  // up. They sit behind this overlay and are invisible anyway — until a view
  // transition runs. Both carry a view-transition-name, which lifts them out
  // of the page and into the transition layer above it, so switching language
  // on the chooser made the nav bar flash into view over the top and then
  // vanish again. An element that is display:none is never captured, so there
  // is nothing to lift.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const root = document.documentElement;
    if (open) root.setAttribute('data-gate-open', '');
    else root.removeAttribute('data-gate-open');
    return () => {
      document.body.style.overflow = '';
      root.removeAttribute('data-gate-open');
    };
  }, [open]);

  // Closing only fades the gate out (opacity/pointerEvents) so the 500ms
  // transition can play. Unmount for real once the fade finishes, so a
  // full-screen fixed overlay isn't left sitting in the DOM — invisible but
  // still laid out — for the rest of the visit.
  useEffect(() => {
    if (open) return;
    const timer = setTimeout(() => setMounted(false), 550);
    return () => clearTimeout(timer);
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t('eyebrow')}
      tabIndex={-1}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'linear-gradient(160deg, var(--bg-darker) 0%, var(--primary) 55%, #12301F 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 500ms cubic-bezier(0.22, 1, 0.36, 1)',
        overflowY: 'auto', padding: 'clamp(24px, 6vw, 48px) clamp(16px, 5vw, 24px)',
      }}
    >
      <div style={{
        position: 'absolute', top: '-10%', [isAr ? 'right' : 'left']: '-10%',
        width: 'clamp(300px, 50vw, 700px)', height: 'clamp(300px, 50vw, 700px)',
        background: 'radial-gradient(circle, rgba(141,184,51,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Keeps ?gate=1 on the way across. Without it this switched to a bare
          /ar, and the landing page only re-opens the chooser for gate=1 or a
          visitor who has never answered it — so for anyone with the cookie
          already set, changing language here silently dismissed the gate and
          dropped them on the printers page instead of the chooser they were
          looking at. Answering the chooser is what markGateSeen is for; a
          language switch is not an answer, so it deliberately isn't called.

          Kept as a <Link>. This was briefly a plain <a> to rule out a
          hydration mismatch seen when the toggle is clicked before the page
          finishes hydrating — but a full document load repaints the body,
          which is white, so every language switch flashed white between the
          two dark chooser screens. A visible flash on every switch is a worse
          problem than a recoverable, dev-only hydration warning that React
          silently re-renders past, so the client transition stays. */}
      <Link
        href={`/${otherLocale}?gate=1`}
        style={{
          position: 'absolute', top: 'clamp(16px, 3vw, 24px)', [isAr ? 'left' : 'right']: 'clamp(16px, 3vw, 24px)',
          zIndex: 3, height: '40px', padding: '0 20px', borderRadius: '999px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          color: '#fff', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em',
          textDecoration: 'none', transition: 'all 200ms ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#fff'; }}
      >
        {tNav('lang')}
      </Link>

      <div style={{ position: 'relative', width: '100%', maxWidth: '1100px', margin: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(28px, 5vw, 48px)' }}>
          <span style={{
            display: 'inline-block', color: 'var(--accent)', fontFamily: 'var(--font-ibm-plex-mono), monospace',
            fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: '14px',
          }}>
            {t('eyebrow')}
          </span>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.75rem)', fontWeight: 800, color: '#fff', margin: 0,
            fontFamily: isAr ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-inter), sans-serif',
          }}>
            {t('title')}
          </h1>
        </div>

        <div className="gate-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(16px, 3vw, 32px)' }}>
          {/* Printers panel */}
          <a
            href={`/${locale}`}
            onClick={(e) => { e.preventDefault(); dismiss(); }}
            aria-label={`${t('printers.title')} — ${t('printers.cta')}`}
            className="glass-dark gate-card"
            style={{
              display: 'flex', flexDirection: 'column', textDecoration: 'none', cursor: 'pointer',
              padding: 'clamp(20px, 3vw, 28px)', textAlign: isAr ? 'right' : 'left',
            }}
          >
            <PanelPhoto src={PRINTER_IMAGE} />
            <span className="section-tag" style={{ marginBottom: '10px' }}>{t('printers.tag')}</span>
            <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>
              {t('printers.title')}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '20px', flex: 1 }}>
              {t('printers.desc')}
            </p>
            <span className="btn-primary" style={{ alignSelf: isAr ? 'flex-end' : 'flex-start' }}>
              {t('printers.cta')}
              <Arrow size={18} />
            </span>
          </a>

          {/* Sourcing panel */}
          <a
            href={`/${locale}/sourcing`}
            onClick={markSeen}
            aria-label={`${t('sourcing.title')} — ${t('sourcing.cta')}`}
            className="glass-dark gate-card"
            style={{
              display: 'flex', flexDirection: 'column', textDecoration: 'none', cursor: 'pointer',
              padding: 'clamp(20px, 3vw, 28px)', textAlign: isAr ? 'right' : 'left',
            }}
          >
            <PanelPhoto src={SOURCING_IMAGE} />
            <span className="section-tag" style={{ marginBottom: '10px' }}>{t('sourcing.tag')}</span>
            <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>
              {t('sourcing.title')}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '20px', flex: 1 }}>
              {t('sourcing.desc')}
            </p>
            <span className="btn-primary" style={{ alignSelf: isAr ? 'flex-end' : 'flex-start' }}>
              {t('sourcing.cta')}
              <Arrow size={18} />
            </span>
          </a>
        </div>
      </div>

      <style jsx>{`
        .gate-card:hover { border-color: var(--accent-glow); }
        @media (max-width: 768px) {
          .gate-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
