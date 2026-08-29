'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useDialogA11y } from '@/lib/useDialogA11y';

// Printers and sourcing are run as two separate businesses, so the only way
// between them is the entry gate on the landing page. `?gate=1` is what asks
// the landing page to put the chooser back up (see src/app/[locale]/page.tsx);
// without it the gate stays dismissed for the rest of the session and sourcing
// would be unreachable once a visitor picked printers.
export const gateHref = (locale: string) => `/${locale}?gate=1`;

export default function Navbar() {
  const t = useTranslations('nav');
  const tSourcing = useTranslations('navSourcing');
  const params = useParams();
  const pathname = usePathname();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
  const isSourcing = pathname.startsWith(`/${locale}/sourcing`);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileOverlayRef = useDialogA11y<HTMLDivElement>(mobileOpen, () => setMobileOpen(false));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Deliberately no cross-links between the two sets: the printers nav does not
  // offer sourcing, and the sourcing nav does not offer printers. Switching
  // tracks goes back through the gate, via the logo.
  const printerLinks = [
    { href: gateHref(locale), label: t('home') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/sustainability`, label: t('sustainability') },
    { href: `/${locale}/eco-inks`, label: t('ecoInks') },
    { href: `/${locale}/industries`, label: t('industries') },
    { href: `/${locale}/printer-parts`, label: t('printerParts') },
    { href: `/${locale}/equipment`, label: t('officeEquipment') },
    { href: `/${locale}/faq`, label: t('faq') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  // The sourcing site is a single page, so these are in-page anchors — apart
  // from Home, which goes back to the gate, mirroring the printers nav. Without
  // it the only way back on mobile is the logo, which is easy to miss.
  const sourcingLinks = [
    { href: gateHref(locale), label: t('home') },
    { href: `/${locale}/sourcing#sourcing-process`, label: tSourcing('process') },
    { href: `/${locale}/sourcing#sourcing-categories`, label: tSourcing('categories') },
    { href: `/${locale}/sourcing#sourcing-services`, label: tSourcing('services') },
    { href: `/${locale}/sourcing#sourcing-why`, label: tSourcing('why') },
    { href: `/${locale}/sourcing#contact`, label: tSourcing('contact') },
  ];

  const navLinks = isSourcing ? sourcingLinks : printerLinks;

  const otherLocale = isAr ? 'en' : 'ar';
  
  // Logic to switch locale while preserving path
  const segments = pathname.split('/');
  segments[1] = otherLocale;
  const switchPath = segments.join('/');

  return (
    <>
      <nav
        ref={navRef}
        id="main-nav"
        style={{
          position: 'fixed',
          // Was `top: 16px/24px` (a reflow on every scroll-threshold crossing) —
          // pinned at top:0 and moved via transform, which is compositor-only.
          top: 0,
          left: '50%',
          transform: `translate(-50%, ${scrolled ? '16px' : '24px'})`,
          width: 'calc(100% - 48px)',
          maxWidth: '1400px',
          zIndex: 1000,
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 32px',
          // The links group is `flex: 1`, so without a gap its edge sits flush
          // against the language pill and the last link ("Contact") reads as
          // part of it. This keeps the three groups apart at every width; the
          // centred links then always have at least this much breathing room.
          gap: '24px',
          transition: 'transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: 'transform',
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(32px) saturate(200%)',
          WebkitBackdropFilter: 'blur(32px) saturate(200%)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          borderRadius: '100px',
          boxShadow: scrolled ? '0 20px 40px rgba(0, 0, 0, 0.08)' : '0 10px 30px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Logo — the way back to the gate, and so the only route between the
            printers and sourcing sides. A plain <a>, like every other link in
            this nav: a soft navigation from /{locale} to /{locale}?gate=1 keeps
            the already-dismissed EntryGate instance mounted, so React preserves
            its closed state and the chooser never reappears. A full load
            remounts it. */}
        <a
          href={gateHref(locale)}
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <Image
            src="/FNG_LOGO.png"
            alt="FNG — Future Next Gen"
            width={240}
            height={96}
            style={{
              objectFit: 'contain',
              height: '56px',
              width: 'auto',
            }}
            className="nav-logo-img"
            priority
          />
        </a>

        {/* Center Nav Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          flex: 1,
          justifyContent: 'center',
          // A flex item defaults to min-width:auto, so this container refused to
          // shrink below its links and pushed the CTA out past the nav's rounded
          // edge instead. These let it give way first. The labels are editable
          // from Admin → Settings, so overly long ones stay contained rather
          // than breaking the bar apart.
          minWidth: 0,
          overflow: 'hidden',
        }}
          className="nav-links-desktop"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                color: '#4B5563',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'color 180ms ease',
                position: 'relative',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#4B5563')}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Side */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexShrink: 0,
        }}>
          {/* Language Toggle */}
          <Link
            href={switchPath}
            className="nav-lang-desktop"
            style={{
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 24px',
              borderRadius: '999px',
              border: '1px solid rgba(17, 24, 39, 0.1)',
              background: 'rgba(255, 255, 255, 0.5)',
              color: '#111827',
              fontSize: '0.9rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 200ms ease',
              letterSpacing: '0.05em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.color = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(17, 24, 39, 0.1)';
              e.currentTarget.style.color = '#111827';
            }}
          >
            {t('lang')}
          </Link>

          {/* CTA */}
          <a
            href={isSourcing ? `/${locale}/sourcing#contact` : `/${locale}/contact`}
            className="nav-cta-desktop"
            style={{
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 28px',
              borderRadius: '999px',
              background: 'var(--accent)',
              color: '#FFFFFF',
              fontSize: '0.9rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(141, 184, 51, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(141,184,51,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(141, 184, 51, 0.3)';
            }}
          >
            {isSourcing ? tSourcing('cta') : t('getFreePrinter')}
          </a>

          {/* Mobile Hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-overlay"
            style={{
              display: 'none',
              flexDirection: 'column',
              gap: '5px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '12px',
              minWidth: '48px',
              minHeight: '48px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{
              width: '22px',
              height: '2px',
              background: '#111827',
              transition: 'all 300ms ease',
              transform: mobileOpen ? 'rotate(45deg) translateY(7px)' : 'none',
            }} />
            <span style={{
              width: '22px',
              height: '2px',
              background: '#111827',
              transition: 'all 300ms ease',
              opacity: mobileOpen ? 0 : 1,
            }} />
            <span style={{
              width: '22px',
              height: '2px',
              background: '#111827',
              transition: 'all 300ms ease',
              transform: mobileOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
            }} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        ref={mobileOverlayRef}
        id="mobile-nav-overlay"
        role="dialog"
        aria-modal="true"
        aria-label={isAr ? 'قائمة التنقل' : 'Navigation menu'}
        tabIndex={-1}
        className="mobile-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          transition: 'all 400ms cubic-bezier(0.22, 1, 0.36, 1)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'all' : 'none',
          transform: mobileOpen ? 'translateX(0)' : (isAr ? 'translateX(100%)' : 'translateX(-100%)'),
          padding: '100px 32px 48px',
          overflowY: 'auto',
        }}
      >
        {navLinks.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            style={{
              color: '#111827',
              textDecoration: 'none',
              fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
              fontWeight: 700,
              transition: `all 300ms ease ${i * 40}ms`,
              opacity: mobileOpen ? 1 : 0,
              transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)',
              padding: '8px 0',
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {link.label}
          </a>
        ))}

        {/* No language toggle here: it lives in the bar itself at every size,
            the way it does on desktop, so changing language does not require
            opening the menu first. Removing the duplicate also shortens this
            list, which has to fit a phone screen. */}

        {/* CTA in mobile overlay */}
        <a
          href={isSourcing ? `/${locale}/sourcing#contact` : `/${locale}/contact`}
          onClick={() => setMobileOpen(false)}
          style={{
            padding: '16px 32px',
            borderRadius: '999px',
            background: 'var(--accent)',
            color: '#FFFFFF',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: '1rem',
            minHeight: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '280px',
            boxShadow: '0 4px 12px rgba(141,184,51,0.3)',
          }}
        >
          {isSourcing ? tSourcing('cta') : t('getFreePrinter')}
        </a>
      </div>

      <style jsx>{`
        /* Between the hamburger breakpoint and ~1360px the English printers nav
           — nine links plus a long CTA — is wider than the pill containing it,
           so the CTA spilled past the rounded edge and the links ran into the
           language pill. Tighten spacing across this band rather than dropping
           to the hamburger, which would cost the desktop nav on ordinary
           1280px laptops. The Arabic nav and the five-link sourcing nav both
           fit without this, but sharing the rule keeps them consistent. */
        @media (min-width: 1100px) and (max-width: 1360px) {
          #main-nav {
            padding: 0 20px !important;
            gap: 16px !important;
          }
          .nav-links-desktop {
            gap: 10px !important;
          }
          .nav-links-desktop a {
            font-size: 0.76rem !important;
          }
          /* :global() — see the note on the mobile rule below. */
          #main-nav :global(.nav-lang-desktop) {
            padding: 0 14px !important;
            font-size: 0.8rem !important;
          }
          .nav-cta-desktop {
            padding: 0 16px !important;
            font-size: 0.78rem !important;
          }
        }
        /* The overlay centres its items, but once they are taller than the
           screen — nine printer links plus the language toggle and CTA come to
           870px against an 812px phone — centring overflows both ends equally:
           the first link slid up behind the floating nav bar and the CTA fell
           below the fold, with neither reachable by scrolling. "safe" falls
           back to flex-start exactly when that happens, so the list starts
           below the bar and the rest scrolls normally. Browsers without it drop
           the declaration and keep the plain centring set inline, which is fine
           on the shorter sourcing menu. */
        #mobile-nav-overlay {
          justify-content: safe center !important;
          gap: 18px !important;
        }
        /* Hamburger below 1100px, not 1024px: even fully tightened, the nine
           English printer links plus the CTA do not fit under ~1100. */
        @media (max-width: 1099px) {
          .nav-links-desktop {
            display: none !important;
          }
          .nav-cta-desktop {
            display: none !important;
          }
          /* The language pill stays in the bar at every size, so switching
             language never costs a trip through the menu. It is deliberately
             not repeated inside the overlay. :global() because this class sits
             on a next/link <Link> rather than an element styled-jsx compiles,
             so a plain selector is emitted as .nav-lang-desktop.jsx-xxx and
             never matches. */
          #main-nav :global(.nav-lang-desktop) {
            height: 38px !important;
            padding: 0 16px !important;
            font-size: 0.8rem !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          #main-nav {
            width: calc(100% - 32px) !important;
            padding: 0 20px !important;
            height: 68px !important;
            /* The centre links group is the flex-1 spacer holding the two ends
               apart; hidden, it stops laying out at all and the hamburger
               collapses back against the logo, leaving the bar's whole right
               half empty. space-between restores the split, and stays correct
               under RTL. */
            justify-content: space-between !important;
          }
          /* :global() for the same reason — this class is on a next/image
             <Image>. Unscoped, the logo kept its 56px desktop height inside a
             56px bar. */
          #main-nav :global(.nav-logo-img) {
            height: 44px !important;
          }
        }
        @media (max-width: 768px) {
          #main-nav {
            width: calc(100% - 24px) !important;
            padding: 0 16px !important;
            height: 60px !important;
            top: 12px !important;
          }
          #main-nav :global(.nav-logo-img) {
            height: 38px !important;
          }
        }
        @media (max-width: 480px) {
          #main-nav {
            width: calc(100% - 16px) !important;
            padding: 0 12px !important;
            height: 56px !important;
            top: 8px !important;
            border-radius: 20px !important;
          }
          #main-nav :global(.nav-logo-img) {
            height: 32px !important;
          }
        }
      `}</style>
    </>
  );
}
