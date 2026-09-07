'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useDialogA11y } from '@/lib/useDialogA11y';
import { homeHref, isCurrentPage, scrollToTop } from '@/lib/navigation';
import { markGateSeen } from '@/lib/entryGate';

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

  // The two link sets stay separate — the printers nav lists only printer
  // pages, the sourcing nav only sourcing anchors. The one crossing point is
  // the Sourcing pill next to the CTA (see below): the logo/gate route was the
  // only way across, and nothing about a logo tells a visitor that a second
  // business lives behind it.
  //
  // Home is a plain link to this track's home page. When that page is already
  // on screen it scrolls back to the top instead of reloading (see
  // handleHomeClick) — it never re-opens the chooser.
  const printerLinks = [
    { href: homeHref(locale, false), label: t('home'), isHome: true },
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
  // from Home, which is the top of the sourcing page itself.
  const sourcingLinks = [
    { href: homeHref(locale, true), label: t('home'), isHome: true },
    { href: `/${locale}/sourcing#sourcing-process`, label: tSourcing('process') },
    { href: `/${locale}/sourcing#sourcing-categories`, label: tSourcing('categories') },
    { href: `/${locale}/sourcing#sourcing-services`, label: tSourcing('services') },
    { href: `/${locale}/sourcing#sourcing-why`, label: tSourcing('why') },
    { href: `/${locale}/sourcing#contact`, label: tSourcing('contact') },
  ];

  const navLinks = isSourcing ? sourcingLinks : printerLinks;

  // Home on the page you are already on: scroll to the top rather than doing
  // a full navigation. Anywhere else, remember the chooser as answered so the
  // home page renders straight away instead of greeting the visitor again.
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    markGateSeen();
    if (isCurrentPage(pathname, href)) {
      e.preventDefault();
      scrollToTop();
    }
  };

  // Where the bar gives up and hands everything to the hamburger. The two
  // navs are very different widths, so one shared number short-changes one of
  // them: the printers nav carries nine English links plus two pills and a
  // long CTA and needs ~1280px, while the sourcing nav's six short links leave
  // ~285px spare at that width. Keeping sourcing at its original 1100px stops
  // the printers nav's requirement from collapsing a nav that fits fine.
  const collapseAt = isSourcing ? 1099 : 1279;

  const otherLocale = isAr ? 'en' : 'ar';

  // Preserve the in-page hash when switching language, so a reader deep in the
  // single-page sourcing site (whose nav is all #anchors) stays on the same
  // section instead of being dropped at the top of the translated page. Hash is
  // client-only — it fills in after mount and updates as the visitor moves
  // between anchors.
  const [hash, setHash] = useState('');
  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [pathname]);

  // Logic to switch locale while preserving path (and hash)
  const segments = pathname.split('/');
  segments[1] = otherLocale;
  const switchPath = segments.join('/') + hash;

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
          // Pulls the bar out of the page's view-transition snapshot so it
          // stays put while content slides underneath it. See the
          // persistent-nav rules in globals.css.
          viewTransitionName: 'persistent-nav',
          // Condenses once past the fold. The bar is position:fixed, so its
          // own height change cannot reflow the page behind it — it is one
          // transition on a threshold crossing, not a per-scroll-frame value.
          height: scrolled ? '68px' : '80px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 32px',
          // The links group is `flex: 1`, so without a gap its edge sits flush
          // against the language pill and the last link ("Contact") reads as
          // part of it. This keeps the three groups apart at every width; the
          // centred links then always have at least this much breathing room.
          gap: '24px',
          transition: 'transform 400ms var(--ease-primary), box-shadow 400ms var(--ease-primary), height 400ms var(--ease-primary)',
          willChange: 'transform',
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(32px) saturate(200%)',
          WebkitBackdropFilter: 'blur(32px) saturate(200%)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          borderRadius: 'var(--radius-pill)',
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
              // Scale rather than a second height animation: the logo shrinking
              // with the bar is the whole effect, and a transform costs the
              // compositor nothing while a height would relayout the nav's
              // flex row alongside it.
              transform: scrolled ? 'scale(0.82)' : 'scale(1)',
              transformOrigin: isAr ? 'right center' : 'left center',
              transition: 'transform 400ms var(--ease-primary)',
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
          {navLinks.map((link) => {
            // Anchor links (#…) all resolve to the same page path, so only
            // flag whole-page links as current — a scrollspy would be needed
            // to light up individual sourcing sections and is out of scope.
            const active = !link.href.includes('#') && isCurrentPage(pathname, link.href);
            const baseColor = active ? 'var(--accent-text)' : '#4B5563';
            return (
            <Link
              key={link.href}
              href={link.href}
              // Sibling pages: a cross-fade, not a slide. Typed explicitly
              // because PageTransition leaves the untyped default at 'none'.
              transitionTypes={['nav-lateral']}
              onClick={link.isHome ? (e) => handleHomeClick(e, link.href) : undefined}
              aria-current={active ? 'page' : undefined}
              style={{
                color: baseColor,
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: active ? 700 : 600,
                transition: 'color 180ms ease',
                position: 'relative',
                whiteSpace: 'nowrap',
                borderBottom: active ? '2px solid var(--accent-text)' : '2px solid transparent',
                paddingBottom: '3px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = baseColor)}
            >
              {link.label}
            </Link>
          );})}
        </div>

        {/* Right Side */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexShrink: 0,
        }}>
          {/* Language Toggle. A <Link>, not a plain <a>: a full document load
              repaints the white body between pages, which flashed on every
              language switch. See the note on the chooser's toggle. */}
          <Link
            href={switchPath}
            className="nav-lang-desktop"
            style={{
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 24px',
              borderRadius: 'var(--radius-pill)',
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
              borderRadius: 'var(--radius-pill)',
              background: 'var(--accent)',
              color: 'var(--deep-forest)',
              fontSize: '0.9rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 200ms var(--ease-spring)',
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

          {/* The crossing point between the two tracks, sitting after the CTA —
              so it is to its right in English and, because the bar mirrors
              with the document direction, to its left in Arabic. Carries the
              same solid accent fill as the CTA rather than an outline, so the
              two read as a matched pair.
              Present on both sides and pointing at the other one: sourcing
              from the printers nav, refurbished printers from the sourcing
              nav. Before this the logo/gate was the only route across, and
              nothing about a logo tells a visitor a second business is behind
              it — which was as true landing on sourcing as it was here.
              Going to the printers home marks the gate answered, the same
              choice the chooser's "Explore Printers" records: without that, a
              visitor who deep-linked straight to /sourcing would get the
              chooser thrown up in front of the page they just asked for. */}
          <a
            href={isSourcing ? `/${locale}` : `/${locale}/sourcing`}
            onClick={isSourcing ? markGateSeen : undefined}
            className="nav-sourcing-desktop"
            style={{
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '0 24px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--accent)',
              color: 'var(--deep-forest)',
              fontSize: '0.9rem',
              fontWeight: 700,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'all 200ms var(--ease-spring)',
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
            {isSourcing ? t('refurbishedPrinters') : t('sourcing')}
            <span aria-hidden="true" style={{ fontSize: 'var(--text-base)', lineHeight: 1 }}>{isAr ? '←' : '→'}</span>
          </a>

          {/* Mobile Hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={isAr ? 'فتح القائمة' : 'Toggle menu'}
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
          transition: 'opacity 400ms var(--ease-ink), transform 400ms var(--ease-ink), visibility 0s linear ' + (mobileOpen ? '0s' : '400ms'),
          opacity: mobileOpen ? 1 : 0,
          // visibility (not just pointer-events) so the closed menu's links are
          // not focusable / read by screen readers. Delayed on close so the
          // fade-out still plays.
          visibility: mobileOpen ? 'visible' : 'hidden',
          pointerEvents: mobileOpen ? 'all' : 'none',
          transform: mobileOpen ? 'translateX(0)' : (isAr ? 'translateX(100%)' : 'translateX(-100%)'),
          padding: '100px 32px 48px',
          overflowY: 'auto',
        }}
      >
        {navLinks.map((link, i) => {
          const active = !link.href.includes('#') && isCurrentPage(pathname, link.href);
          return (
          <Link
            key={link.href}
            href={link.href}
            transitionTypes={['nav-lateral']}
            onClick={(e) => { setMobileOpen(false); if (link.isHome) handleHomeClick(e, link.href); }}
            aria-current={active ? 'page' : undefined}
            style={{
              color: active ? 'var(--accent-text)' : '#111827',
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
          </Link>
        );})}

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
            borderRadius: 'var(--radius-pill)',
            background: 'var(--accent)',
            color: 'var(--deep-forest)',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: 'var(--text-base)',
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

        {/* The desktop pill is hidden under 1280px, so the crossing point has
            to exist here too or the other track is unreachable on a phone. */}
        <a
          href={isSourcing ? `/${locale}` : `/${locale}/sourcing`}
          onClick={() => { setMobileOpen(false); if (isSourcing) markGateSeen(); }}
          style={{
            padding: '16px 32px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--accent)',
            color: 'var(--deep-forest)',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: 'var(--text-base)',
            minHeight: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            maxWidth: '280px',
            boxShadow: '0 4px 12px rgba(141,184,51,0.3)',
          }}
        >
          {isSourcing ? t('refurbishedPrinters') : t('sourcing')}
          <span aria-hidden="true">{isAr ? '←' : '→'}</span>
        </a>
      </div>

      <style jsx>{`
        /* Between the hamburger breakpoint and ~1440px the English printers nav
           — nine links plus the Sourcing pill and a long CTA — is wider than
           the bar containing it, so the CTA spilled past the rounded edge and
           the links ran into the language pill. Tighten spacing across this
           band rather than dropping to the hamburger, which would cost the
           desktop nav on ordinary 1280px laptops. The Arabic nav and the
           five-link sourcing nav both fit without this, but sharing the rule
           keeps them consistent. */
        @media (min-width: ${collapseAt + 1}px) and (max-width: 1440px) {
          #main-nav {
            padding: 0 20px !important;
            gap: 16px !important;
          }
          .nav-links-desktop {
            gap: 10px !important;
          }
          /* :global(a) — these are next/link <Link>s now, which styled-jsx
             cannot scope (see the note on .nav-lang-desktop below). */
          .nav-links-desktop :global(a) {
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
          .nav-sourcing-desktop {
            padding: 0 12px !important;
            font-size: 0.78rem !important;
          }
          /* The arrow is affordance, not information — the first thing the
             pill can give back when the row is short of room. */
          .nav-sourcing-desktop :global(span) {
            display: none !important;
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
        /* Hamburger below collapseAt (1280px on printers, 1100px on
           sourcing — see the note where it is defined). The nine English
           printer links need ~619px even fully tightened, and the right-hand
           group (language pill + cross-link pill + CTA) takes the rest of the
           bar. Measured: at 1150px the printers row fit with exactly zero
           slack BEFORE the cross-link pill existed, and the pill costs 120px;
           trimming it inside the band buys back ~36px, so that row needs
           ~1280px to fit with real slack. Below the cutoff the whole set, both
           pills included, lives in the overlay instead of being silently
           clipped by the links container's overflow:hidden. */
        @media (max-width: ${collapseAt}px) {
          .nav-links-desktop {
            display: none !important;
          }
          .nav-cta-desktop {
            display: none !important;
          }
          .nav-sourcing-desktop {
            display: none !important;
          }
          /* The language pill stays in the bar at every size, so switching
             language never costs a trip through the menu. It is deliberately
             not repeated inside the overlay. :global() because this class sits
             on a next/link <Link> rather than an element styled-jsx compiles,
             so a plain selector is emitted as .nav-lang-desktop.jsx-xxx and
             never matches. */
          #main-nav :global(.nav-lang-desktop) {
            height: 44px !important;
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
            border-radius: var(--radius-2xl) !important;
          }
          #main-nav :global(.nav-logo-img) {
            height: 32px !important;
          }
        }
      `}</style>
    </>
  );
}
