'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Printer,
  Droplets,
  Cog,
  Monitor,
  Building2,
  HelpCircle,
  Phone,
  ChevronDown,
  MessageSquare,
} from 'lucide-react';
import { useDialogA11y } from '@/lib/useDialogA11y';
import { homeHref, isCurrentPage, scrollToTop } from '@/lib/navigation';
import { markGateSeen } from '@/lib/entryGate';

export const gateHref = (locale: string) => `/${locale}?gate=1`;

export default function Navbar() {
  const t = useTranslations('nav');
  const tSourcing = useTranslations('navSourcing');
  const params = useParams();
  const rawPathname = usePathname();
  const locale = (params?.locale as string) || 'en';
  const pathname = rawPathname || `/${locale}`;
  const isAr = locale === 'ar';
  const isSourcing = pathname.startsWith(`/${locale}/sourcing`);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'fleet' | 'company' | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const mobileOverlayRef = useDialogA11y<HTMLDivElement>(mobileOpen, () => setMobileOpen(false));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
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

  // Reset dropdown when pathname changes (React-blessed state-during-render pattern)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setActiveDropdown(null);
  }

  const handleDropdownEnter = (menu: 'fleet' | 'company') => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const toggleDropdown = (menu: 'fleet' | 'company') => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  const otherLocale = isAr ? 'en' : 'ar';

  const [hash, setHash] = useState('');
  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [pathname]);

  const segments = pathname.split('/');
  segments[1] = otherLocale;
  const switchPath = segments.join('/') + hash;

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    markGateSeen();
    if (isCurrentPage(pathname, href)) {
      e.preventDefault();
      scrollToTop();
    }
  };

  // Sourcing track links (single-page section anchors)
  const sourcingLinks = [
    { href: homeHref(locale, true), label: t('home'), isHome: true },
    { href: `/${locale}/sourcing#sourcing-process`, label: tSourcing('process') },
    { href: `/${locale}/sourcing#sourcing-categories`, label: tSourcing('categories') },
    { href: `/${locale}/sourcing#sourcing-systems`, label: tSourcing('systems') },
    { href: `/${locale}/sourcing#sourcing-services`, label: tSourcing('services') },
    { href: `/${locale}/sourcing#sourcing-why`, label: tSourcing('why') },
    { href: `/${locale}/sourcing#contact`, label: tSourcing('contact') },
  ];

  // Fleet & Hardware submenu items
  const fleetItems = [
    {
      href: `/${locale}/printers`,
      label: t('printers'),
      desc: t('printersDesc'),
      icon: Printer,
      iconBg: 'rgba(26, 61, 43, 0.08)',
      iconColor: 'var(--primary)',
    },
    {
      href: `/${locale}/eco-inks`,
      label: t('ecoInks'),
      desc: t('ecoInksDesc'),
      icon: Droplets,
      iconBg: 'rgba(16, 185, 129, 0.1)',
      iconColor: '#059669',
    },
    {
      href: `/${locale}/printer-parts`,
      label: t('printerParts'),
      desc: t('printerPartsDesc'),
      icon: Cog,
      iconBg: 'rgba(217, 119, 6, 0.1)',
      iconColor: '#D97706',
    },
    {
      href: `/${locale}/equipment`,
      label: t('officeEquipment'),
      desc: t('officeEquipmentDesc'),
      icon: Monitor,
      iconBg: 'rgba(37, 99, 235, 0.1)',
      iconColor: '#2563EB',
    },
  ];

  // Company submenu items
  const companyItems = [
    {
      href: `/${locale}/about`,
      label: t('about'),
      desc: t('aboutDesc'),
      icon: Building2,
      iconBg: 'rgba(26, 61, 43, 0.08)',
      iconColor: 'var(--primary)',
    },
    {
      href: `/${locale}/faq`,
      label: t('faq'),
      desc: t('faqDesc'),
      icon: HelpCircle,
      iconBg: 'rgba(99, 102, 241, 0.1)',
      iconColor: '#4F46E5',
    },
    {
      href: `/${locale}/contact`,
      label: t('contact'),
      desc: t('contactDesc'),
      icon: Phone,
      iconBg: 'rgba(16, 185, 129, 0.1)',
      iconColor: '#059669',
    },
  ];

  // Check section active states for the printer track
  const isFleetActive =
    pathname.startsWith(`/${locale}/printers`) ||
    pathname.startsWith(`/${locale}/eco-inks`) ||
    pathname.startsWith(`/${locale}/printer-parts`) ||
    pathname.startsWith(`/${locale}/equipment`);

  const isIndustriesActive = pathname.startsWith(`/${locale}/industries`);
  const isSustainabilityActive = pathname.startsWith(`/${locale}/sustainability`);

  const isCompanyActive =
    pathname.startsWith(`/${locale}/about`) ||
    pathname.startsWith(`/${locale}/faq`) ||
    pathname.startsWith(`/${locale}/contact`);

  // Keyboard navigation for dropdown menu
  const handleDropdownKeyDown = useCallback(
    (e: React.KeyboardEvent, menu: 'fleet' | 'company') => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDropdown(menu);
      } else if (e.key === 'ArrowDown' && activeDropdown !== menu) {
        e.preventDefault();
        setActiveDropdown(menu);
      }
    },
    [activeDropdown]
  );

  return (
    <>
      <nav
        ref={navRef}
        id="main-nav"
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: `translate(-50%, ${scrolled ? '14px' : '22px'})`,
          width: 'calc(100% - 48px)',
          maxWidth: '1420px',
          zIndex: 1000,
          viewTransitionName: 'persistent-nav',
          height: scrolled ? '66px' : '76px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          gap: '20px',
          transition:
            'transform 350ms var(--ease-primary), box-shadow 350ms var(--ease-primary), height 350ms var(--ease-primary), background 350ms ease, border-color 350ms ease',
          willChange: 'transform',
          background: scrolled ? 'rgba(255, 255, 255, 0.90)' : 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(28px) saturate(190%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          border: '1px solid rgba(255, 255, 255, 0.85)',
          borderRadius: '22px',
          boxShadow: scrolled
            ? '0 20px 45px -12px rgba(13, 40, 24, 0.10), 0 0 0 1px rgba(0, 0, 0, 0.04)'
            : '0 12px 36px -10px rgba(13, 40, 24, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.03)',
        }}
      >
        {/* Brand Logo */}
        <a
          href={gateHref(locale)}
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            flexShrink: 0,
          }}
          aria-label="FNG Trading Co Home"
        >
          <Image
            src="/FNG_LOGO.png"
            alt="FNG — Future Next Gen"
            width={240}
            height={96}
            style={{
              objectFit: 'contain',
              height: scrolled ? '46px' : '52px',
              width: 'auto',
              transformOrigin: isAr ? 'right center' : 'left center',
              transition: 'height 350ms var(--ease-primary)',
            }}
            className="nav-logo-img"
            priority
          />
        </a>

        {/* Center Desktop Navigation */}
        <div
          className="nav-links-desktop"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
            flex: 1,
            justifyContent: 'center',
            minWidth: 0,
          }}
        >
          {isSourcing ? (
            // Sourcing track anchors
            sourcingLinks.map((link) => {
              const active = !link.href.includes('#') && isCurrentPage(pathname, link.href);
              const baseColor = active ? 'var(--accent-text)' : '#374151';
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  transitionTypes={['nav-lateral']}
                  onClick={link.isHome ? (e) => handleHomeClick(e, link.href) : undefined}
                  aria-current={active ? 'page' : undefined}
                  className="nav-link-item"
                  style={{
                    color: baseColor,
                    textDecoration: 'none',
                    fontSize: '0.92rem',
                    fontWeight: active ? 700 : 600,
                    transition: 'color 180ms ease',
                    position: 'relative',
                    whiteSpace: 'nowrap',
                    padding: '8px 2px',
                  }}
                >
                  {link.label}
                  {active && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'var(--accent-text)',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </Link>
              );
            })
          ) : (
            // Printer Track: Refined Navigation with Home & 4 Pillars
            <>
              {/* Home Link */}
              <Link
                href={homeHref(locale, false)}
                onClick={(e) => handleHomeClick(e, homeHref(locale, false))}
                style={{
                  color: isCurrentPage(pathname, homeHref(locale, false)) ? 'var(--accent-text)' : '#374151',
                  textDecoration: 'none',
                  fontSize: '0.92rem',
                  fontWeight: isCurrentPage(pathname, homeHref(locale, false)) ? 700 : 600,
                  transition: 'color 180ms ease',
                  position: 'relative',
                  whiteSpace: 'nowrap',
                  padding: '8px 4px',
                }}
                className="nav-link-item"
              >
                {t('home')}
                {isCurrentPage(pathname, homeHref(locale, false)) && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'var(--accent-text)',
                      borderRadius: '2px',
                    }}
                  />
                )}
              </Link>

              {/* Pillar 1: Fleet & Hardware Dropdown */}
              <div
                className="nav-dropdown-anchor"
                onMouseEnter={() => handleDropdownEnter('fleet')}
                onMouseLeave={handleDropdownLeave}
                style={{ position: 'relative' }}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={activeDropdown === 'fleet'}
                  onClick={() => toggleDropdown('fleet')}
                  onKeyDown={(e) => handleDropdownKeyDown(e, 'fleet')}
                  className="nav-item-trigger"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 4px',
                    fontSize: '0.92rem',
                    fontWeight: isFleetActive ? 700 : 600,
                    color: isFleetActive ? 'var(--accent-text)' : '#374151',
                    fontFamily: 'inherit',
                    position: 'relative',
                    transition: 'color 180ms ease',
                    flexDirection: isAr ? 'row-reverse' : 'row',
                  }}
                >
                  <span>{t('fleetHardware')}</span>
                  <ChevronDown
                    size={15}
                    style={{
                      transform: activeDropdown === 'fleet' ? 'rotate(180deg)' : 'none',
                      transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
                      color: isFleetActive ? 'var(--accent-text)' : '#6B7280',
                    }}
                  />
                  {isFleetActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'var(--accent-text)',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </button>

                {/* Fleet Flyout Card */}
                {activeDropdown === 'fleet' && (
                  <div
                    role="menu"
                    className="nav-flyout-card"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      [isAr ? 'right' : 'left']: '50%',
                      transform: isAr ? 'translateX(50%)' : 'translateX(-50%)',
                      width: '340px',
                      background: 'rgba(255, 255, 255, 0.98)',
                      backdropFilter: 'blur(32px)',
                      WebkitBackdropFilter: 'blur(32px)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '18px',
                      padding: '10px',
                      boxShadow: '0 24px 50px -12px rgba(13, 40, 24, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      zIndex: 1010,
                      animation: 'navDropdownFadeIn 180ms ease-out',
                    }}
                  >
                    {fleetItems.map((item) => {
                      const Icon = item.icon;
                      const active = pathname.startsWith(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={() => setActiveDropdown(null)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 12px',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            background: active ? 'rgba(26, 61, 43, 0.05)' : 'transparent',
                            transition: 'background 160ms ease, transform 160ms ease',
                            flexDirection: isAr ? 'row-reverse' : 'row',
                            textAlign: isAr ? 'right' : 'left',
                          }}
                          className="flyout-item"
                        >
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '10px',
                              background: item.iconBg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Icon size={20} color={item.iconColor} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                color: active ? 'var(--accent-text)' : '#111827',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                lineHeight: 1.3,
                              }}
                            >
                              {item.label}
                            </div>
                            <div
                              style={{
                                color: '#6B7280',
                                fontSize: '0.76rem',
                                lineHeight: 1.3,
                                marginTop: '2px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {item.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Pillar 2: Industries */}
              <Link
                href={`/${locale}/industries`}
                transitionTypes={['nav-lateral']}
                style={{
                  color: isIndustriesActive ? 'var(--accent-text)' : '#374151',
                  textDecoration: 'none',
                  fontSize: '0.92rem',
                  fontWeight: isIndustriesActive ? 700 : 600,
                  transition: 'color 180ms ease',
                  position: 'relative',
                  whiteSpace: 'nowrap',
                  padding: '8px 4px',
                }}
                className="nav-link-item"
              >
                {t('industries')}
                {isIndustriesActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'var(--accent-text)',
                      borderRadius: '2px',
                    }}
                  />
                )}
              </Link>

              {/* Pillar 3: Sustainability */}
              <Link
                href={`/${locale}/sustainability`}
                transitionTypes={['nav-lateral']}
                style={{
                  color: isSustainabilityActive ? 'var(--accent-text)' : '#374151',
                  textDecoration: 'none',
                  fontSize: '0.92rem',
                  fontWeight: isSustainabilityActive ? 700 : 600,
                  transition: 'color 180ms ease',
                  position: 'relative',
                  whiteSpace: 'nowrap',
                  padding: '8px 4px',
                }}
                className="nav-link-item"
              >
                {t('sustainability')}
                {isSustainabilityActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'var(--accent-text)',
                      borderRadius: '2px',
                    }}
                  />
                )}
              </Link>

              {/* Pillar 4: Company Dropdown */}
              <div
                className="nav-dropdown-anchor"
                onMouseEnter={() => handleDropdownEnter('company')}
                onMouseLeave={handleDropdownLeave}
                style={{ position: 'relative' }}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={activeDropdown === 'company'}
                  onClick={() => toggleDropdown('company')}
                  onKeyDown={(e) => handleDropdownKeyDown(e, 'company')}
                  className="nav-item-trigger"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 4px',
                    fontSize: '0.92rem',
                    fontWeight: isCompanyActive ? 700 : 600,
                    color: isCompanyActive ? 'var(--accent-text)' : '#374151',
                    fontFamily: 'inherit',
                    position: 'relative',
                    transition: 'color 180ms ease',
                    flexDirection: isAr ? 'row-reverse' : 'row',
                  }}
                >
                  <span>{t('company')}</span>
                  <ChevronDown
                    size={15}
                    style={{
                      transform: activeDropdown === 'company' ? 'rotate(180deg)' : 'none',
                      transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
                      color: isCompanyActive ? 'var(--accent-text)' : '#6B7280',
                    }}
                  />
                  {isCompanyActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'var(--accent-text)',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </button>

                {/* Company Flyout Card */}
                {activeDropdown === 'company' && (
                  <div
                    role="menu"
                    className="nav-flyout-card"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      [isAr ? 'right' : 'left']: '50%',
                      transform: isAr ? 'translateX(50%)' : 'translateX(-50%)',
                      width: '320px',
                      background: 'rgba(255, 255, 255, 0.98)',
                      backdropFilter: 'blur(32px)',
                      WebkitBackdropFilter: 'blur(32px)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '18px',
                      padding: '10px',
                      boxShadow: '0 24px 50px -12px rgba(13, 40, 24, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      zIndex: 1010,
                      animation: 'navDropdownFadeIn 180ms ease-out',
                    }}
                  >
                    {companyItems.map((item) => {
                      const Icon = item.icon;
                      const active = pathname.startsWith(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={() => setActiveDropdown(null)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 12px',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            background: active ? 'rgba(26, 61, 43, 0.05)' : 'transparent',
                            transition: 'background 160ms ease, transform 160ms ease',
                            flexDirection: isAr ? 'row-reverse' : 'row',
                            textAlign: isAr ? 'right' : 'left',
                          }}
                          className="flyout-item"
                        >
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '10px',
                              background: item.iconBg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Icon size={20} color={item.iconColor} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                color: active ? 'var(--accent-text)' : '#111827',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                lineHeight: 1.3,
                              }}
                            >
                              {item.label}
                            </div>
                            <div
                              style={{
                                color: '#6B7280',
                                fontSize: '0.76rem',
                                lineHeight: 1.3,
                                marginTop: '2px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {item.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Desktop Action Cluster */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0,
            flexDirection: isAr ? 'row-reverse' : 'row',
          }}
        >
          {/* Language Switcher */}
          <Link
            href={switchPath}
            className="nav-lang-btn"
            style={{
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 16px',
              borderRadius: '12px',
              border: '1px solid rgba(17, 24, 39, 0.1)',
              background: 'rgba(255, 255, 255, 0.65)',
              color: '#374151',
              fontSize: '0.86rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 200ms ease',
              letterSpacing: isAr ? '0' : '0.02em',
            }}
          >
            {t('lang')}
          </Link>

          {/* Sourcing Cross-Track Switcher (Green Highlighted Pill) */}
          <a
            href={isSourcing ? `/${locale}` : `/${locale}/sourcing`}
            onClick={isSourcing ? markGateSeen : undefined}
            className="nav-sourcing-btn"
            style={{
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '0 20px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--accent)',
              color: 'var(--deep-forest)',
              fontSize: '0.88rem',
              fontWeight: 700,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'all 200ms var(--ease-spring)',
              boxShadow: '0 4px 12px rgba(141, 184, 51, 0.35)',
              flexDirection: isAr ? 'row-reverse' : 'row',
            }}
          >
            <span>{isSourcing ? t('refurbishedPrinters') : t('sourcing')}</span>
            <span aria-hidden="true" style={{ fontSize: '1rem', lineHeight: 1 }}>
              {isAr ? '←' : '→'}
            </span>
          </a>

          {/* Primary Enterprise CTA (Hero Focal Action) */}
          <a
            href={isSourcing ? `/${locale}/sourcing#contact` : `/${locale}/contact`}
            className="nav-primary-cta"
            style={{
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 22px',
              borderRadius: '12px',
              background: 'var(--accent)',
              color: 'var(--deep-forest)',
              fontSize: '0.88rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 200ms var(--ease-spring)',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 14px rgba(141, 184, 51, 0.35)',
            }}
          >
            {isSourcing ? tSourcing('cta') : t('getFreePrinter')}
          </a>

          {/* Mobile Hamburger Toggle */}
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
              padding: '8px',
              minWidth: '44px',
              minHeight: '44px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                width: '22px',
                height: '2px',
                background: '#111827',
                transition: 'all 300ms ease',
                transform: mobileOpen ? 'rotate(45deg) translateY(7px)' : 'none',
              }}
            />
            <span
              style={{
                width: '22px',
                height: '2px',
                background: '#111827',
                transition: 'all 300ms ease',
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                width: '22px',
                height: '2px',
                background: '#111827',
                transition: 'all 300ms ease',
                transform: mobileOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Overlay Menu */}
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
          justifyContent: 'flex-start',
          gap: '20px',
          transition:
            'opacity 350ms var(--ease-ink), transform 350ms var(--ease-ink), visibility 0s linear ' +
            (mobileOpen ? '0s' : '350ms'),
          opacity: mobileOpen ? 1 : 0,
          visibility: mobileOpen ? 'visible' : 'hidden',
          pointerEvents: mobileOpen ? 'all' : 'none',
          transform: mobileOpen ? 'translateX(0)' : isAr ? 'translateX(100%)' : 'translateX(-100%)',
          padding: '96px 24px 40px',
          overflowY: 'auto',
        }}
      >
        {/* Top Mobile Utilities: WhatsApp hotline & Language */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '360px',
            paddingBottom: '16px',
            borderBottom: '1px solid #E5E7EB',
            flexDirection: isAr ? 'row-reverse' : 'row',
          }}
        >
          <a
            href="https://wa.me/966593380390"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#059669',
              fontSize: '0.88rem',
              fontWeight: 700,
              textDecoration: 'none',
              flexDirection: isAr ? 'row-reverse' : 'row',
            }}
          >
            <MessageSquare size={16} />
            <span>+966 59 338 0390</span>
          </a>

          <Link
            href={switchPath}
            onClick={() => setMobileOpen(false)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              color: '#111827',
              fontSize: '0.84rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            {t('lang')}
          </Link>
        </div>

        {/* Mobile Categorized Grid: Fleet & Hardware */}
        {!isSourcing && (
          <div style={{ width: '100%', maxWidth: '360px' }}>
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '10px',
                textAlign: isAr ? 'right' : 'left',
              }}
            >
              {t('fleetHardware')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {fleetItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      background: '#F9FAFB',
                      border: '1px solid #E5E7EB',
                      textDecoration: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      textAlign: isAr ? 'right' : 'left',
                    }}
                  >
                    <Icon size={18} color={item.iconColor} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Primary Link List */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '360px',
            gap: '12px',
            textAlign: isAr ? 'right' : 'left',
          }}
        >
          {isSourcing ? (
            sourcingLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  setMobileOpen(false);
                  if (link.isHome) handleHomeClick(e, link.href);
                }}
                style={{
                  color: '#111827',
                  textDecoration: 'none',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  padding: '8px 0',
                }}
              >
                {link.label}
              </Link>
            ))
          ) : (
            <>
              <Link
                href={homeHref(locale, false)}
                onClick={(e) => {
                  setMobileOpen(false);
                  handleHomeClick(e, homeHref(locale, false));
                }}
                style={{
                  color: isCurrentPage(pathname, homeHref(locale, false)) ? 'var(--accent-text)' : '#111827',
                  textDecoration: 'none',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  padding: '8px 0',
                }}
              >
                {t('home')}
              </Link>
              <Link
                href={`/${locale}/industries`}
                onClick={() => setMobileOpen(false)}
                style={{
                  color: '#111827',
                  textDecoration: 'none',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  padding: '6px 0',
                }}
              >
                {t('industries')}
              </Link>
              <Link
                href={`/${locale}/sustainability`}
                onClick={() => setMobileOpen(false)}
                style={{
                  color: '#111827',
                  textDecoration: 'none',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  padding: '6px 0',
                }}
              >
                {t('sustainability')}
              </Link>
              <Link
                href={`/${locale}/about`}
                onClick={() => setMobileOpen(false)}
                style={{
                  color: '#111827',
                  textDecoration: 'none',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  padding: '6px 0',
                }}
              >
                {t('about')}
              </Link>
              <Link
                href={`/${locale}/faq`}
                onClick={() => setMobileOpen(false)}
                style={{
                  color: '#111827',
                  textDecoration: 'none',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  padding: '6px 0',
                }}
              >
                {t('faq')}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Actions Container */}
        <div
          style={{
            marginTop: 'auto',
            width: '100%',
            maxWidth: '360px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            paddingTop: '20px',
          }}
        >
          <a
            href={isSourcing ? `/${locale}` : `/${locale}/sourcing`}
            onClick={() => {
              setMobileOpen(false);
              if (isSourcing) markGateSeen();
            }}
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--accent)',
              color: 'var(--deep-forest)',
              fontWeight: 800,
              textDecoration: 'none',
              fontSize: '0.94rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(141, 184, 51, 0.35)',
              flexDirection: isAr ? 'row-reverse' : 'row',
            }}
          >
            <span>{isSourcing ? t('refurbishedPrinters') : t('sourcing')}</span>
            <span aria-hidden="true" style={{ fontSize: '1rem', lineHeight: 1 }}>
              {isAr ? '←' : '→'}
            </span>
          </a>

          <a
            href={isSourcing ? `/${locale}/sourcing#contact` : `/${locale}/contact`}
            onClick={() => setMobileOpen(false)}
            style={{
              padding: '15px',
              borderRadius: '12px',
              background: 'var(--accent)',
              color: 'var(--deep-forest)',
              fontWeight: 800,
              textDecoration: 'none',
              fontSize: '0.98rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(141, 184, 51, 0.35)',
            }}
          >
            {isSourcing ? tSourcing('cta') : t('getFreePrinter')}
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes navDropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .nav-link-item:hover,
        .nav-item-trigger:hover {
          color: var(--accent-text) !important;
        }

        .flyout-item:hover {
          background: rgba(26, 61, 43, 0.05) !important;
          transform: translateX(2px);
        }

        :global([dir="rtl"]) .flyout-item:hover {
          transform: translateX(-2px) !important;
        }

        .nav-lang-btn:hover {
          border-color: rgba(17, 24, 39, 0.3) !important;
          color: #111827 !important;
          background: rgba(255, 255, 255, 0.95) !important;
        }

        .nav-sourcing-btn:hover {
          transform: translateY(-1px) scale(1.03);
          box-shadow: 0 8px 22px rgba(141, 184, 51, 0.5) !important;
        }

        .nav-primary-cta:hover {
          transform: translateY(-1px) scale(1.02);
          box-shadow: 0 8px 24px rgba(141, 184, 51, 0.45) !important;
        }

        /* Desktop Collapse point: 1024px */
        @media (max-width: 1024px) {
          .nav-links-desktop,
          .nav-lang-btn,
          .nav-sourcing-btn,
          .nav-primary-cta {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          #main-nav {
            height: 64px !important;
            padding: 0 18px !important;
            border-radius: 18px !important;
          }
        }

        @media (max-width: 768px) {
          #main-nav {
            width: calc(100% - 24px) !important;
            padding: 0 16px !important;
            height: 60px !important;
            transform: translate(-50%, 12px) !important;
          }
          #main-nav :global(.nav-logo-img) {
            height: 40px !important;
          }
        }

        @media (max-width: 480px) {
          #main-nav {
            width: calc(100% - 16px) !important;
            padding: 0 14px !important;
            height: 56px !important;
            transform: translate(-50%, 8px) !important;
            border-radius: 16px !important;
          }
          #main-nav :global(.nav-logo-img) {
            height: 34px !important;
          }
        }
      `}</style>
    </>
  );
}
