'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useDialogA11y } from '@/lib/useDialogA11y';

export default function Navbar() {
  const t = useTranslations('nav');
  const params = useParams();
  const pathname = usePathname();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
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

  const navLinks = [
    { href: `/${locale}#hero`, label: t('home') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/sustainability`, label: t('sustainability') },
    { href: `/${locale}/eco-inks`, label: t('ecoInks') },
    { href: `/${locale}/industries`, label: t('industries') },
    { href: `/${locale}/sourcing`, label: t('sourcing') },
    { href: `/${locale}/printer-parts`, label: t('printerParts') },
    { href: `/${locale}/equipment`, label: t('officeEquipment') },
    { href: `/${locale}/faq`, label: t('faq') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

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
          top: scrolled ? '16px' : '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 48px)',
          maxWidth: '1400px',
          zIndex: 1000,
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 32px',
          transition: 'all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(32px) saturate(200%)',
          WebkitBackdropFilter: 'blur(32px) saturate(200%)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          borderRadius: '100px',
          boxShadow: scrolled ? '0 20px 40px rgba(0, 0, 0, 0.08)' : '0 10px 30px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Logo */}
        <Link
          href={`/${locale}`}
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
        </Link>

        {/* Center Nav Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          flex: 1,
          justifyContent: 'center',
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
              onMouseEnter={(e) => (e.currentTarget.style.color = '#8DB833')}
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
              e.currentTarget.style.borderColor = '#8DB833';
              e.currentTarget.style.color = '#8DB833';
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
            href={`/${locale}/contact`}
            className="nav-cta-desktop"
            style={{
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 28px',
              borderRadius: '999px',
              background: '#8DB833',
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
            {t('getFreePrinter')}
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

        {/* Language toggle in mobile overlay */}
        <Link
          href={`/${otherLocale}`}
          onClick={() => setMobileOpen(false)}
          style={{
            padding: '12px 32px',
            borderRadius: '999px',
            border: '2px solid rgba(17, 24, 39, 0.15)',
            background: 'transparent',
            color: '#111827',
            fontSize: '1rem',
            fontWeight: 700,
            textDecoration: 'none',
            marginTop: '8px',
            minHeight: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {t('lang')}
        </Link>

        {/* CTA in mobile overlay */}
        <a
          href={`/${locale}/contact`}
          onClick={() => setMobileOpen(false)}
          style={{
            padding: '16px 32px',
            borderRadius: '999px',
            background: '#8DB833',
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
          {t('getFreePrinter')}
        </a>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .nav-links-desktop {
            display: none !important;
          }
          .nav-cta-desktop {
            display: none !important;
          }
          .nav-lang-desktop {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          #main-nav {
            width: calc(100% - 32px) !important;
            padding: 0 20px !important;
            height: 68px !important;
          }
          .nav-logo-img {
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
          .nav-logo-img {
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
          .nav-logo-img {
            height: 32px !important;
          }
        }
      `}</style>
    </>
  );
}
