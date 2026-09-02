'use client';

import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Globe, Mail } from 'lucide-react';
import { SITE_EMAIL } from '@/lib/siteContact';
import { homeHref, isCurrentPage, scrollToTop } from '@/lib/navigation';
import { markGateSeen } from '@/lib/entryGate';
import { regionName } from '@/lib/serviceRegions';
import { useServiceRegions } from '@/components/providers/ServiceRegionsProvider';

export default function Footer({ email }: { email?: string }) {
  const t = useTranslations('footer');
  const params = useParams();
  const pathname = usePathname();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
  const serviceRegions = useServiceRegions();
  const isSourcing = pathname.startsWith(`/${locale}/sourcing`);

  // Mirrors the Navbar's split: the sourcing side never links into the printers
  // business and vice versa, so the footer cannot quietly reintroduce the
  // cross-links the nav deliberately drops. Home is the top of this track's
  // home page (scroll-to-top when already there), same as in the Navbar.
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    markGateSeen();
    if (isCurrentPage(pathname, href)) {
      e.preventDefault();
      scrollToTop();
    }
  };

  const quickLinks = isSourcing
    ? [
        { href: homeHref(locale, true), label: isAr ? 'الرئيسية' : 'Home', isHome: true },
        { href: `/${locale}/sourcing#sourcing-process`, label: isAr ? 'آلية العمل' : 'Process' },
        { href: `/${locale}/sourcing#sourcing-categories`, label: isAr ? 'الفئات' : 'Categories' },
        { href: `/${locale}/sourcing#sourcing-services`, label: isAr ? 'الخدمات' : 'Services' },
        { href: `/${locale}/sourcing#sourcing-why`, label: isAr ? 'لماذا نحن' : 'Why Us' },
        { href: `/${locale}/sourcing#contact`, label: isAr ? 'تواصل معنا' : 'Contact' },
      ]
    : [
        { href: homeHref(locale, false), label: isAr ? 'الرئيسية' : 'Home', isHome: true },
        { href: `/${locale}/about`, label: isAr ? 'من نحن' : 'About' },
        { href: `/${locale}/sustainability`, label: isAr ? 'الاستدامة' : 'Sustainability' },
        { href: `/${locale}/eco-inks`, label: isAr ? 'أحبار إيكو' : 'Eco Inks' },
        { href: `/${locale}/industries`, label: isAr ? 'القطاعات' : 'Industries' },
        { href: `/${locale}/printer-parts`, label: isAr ? 'قطع الطابعات' : 'Printer Parts' },
        { href: `/${locale}/faq`, label: isAr ? 'الأسئلة الشائعة' : 'FAQ' },
        { href: `/${locale}/contact`, label: isAr ? 'تواصل معنا' : 'Contact' },
      ];

  return (
    <footer
      id="footer"
      className="footer-root"
      style={{
        background: 'linear-gradient(180deg, var(--bg-darker) 0%, #0D0D0D 100%)',
        padding: '64px 0 32px',
        borderTop: '1px solid rgba(141, 184, 51, 0.2)',
      }}
    >
      <div className="container">
        <div className="footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '48px',
          marginBottom: '48px',
        }}>
          {/* Brand */}
          <div style={{ textAlign: isAr ? 'right' : 'left' }}>
            <Image
              src="/FNG_LOGO.png"
              alt="FNG — Refurbished Office Equipment"
              width={300}
              height={120}
              className="footer-logo"
              style={{
                objectFit: 'contain',
                height: '110px',
                width: 'auto',
                marginBottom: '16px',
                marginLeft: isAr ? 'auto' : '0',
                marginRight: isAr ? '0' : 'auto',
              }}
            />
            <p style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              maxWidth: '300px',
              marginLeft: isAr ? 'auto' : '0',
              marginRight: isAr ? '0' : 'auto',
            }}>
              {t('tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div style={{ textAlign: isAr ? 'right' : 'left' }}>
            <h4 style={{
              color: '#fff',
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '16px',
              fontWeight: 700,
            }}>
              {isAr ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={link.isHome ? (e) => handleHomeClick(e, link.href) : undefined}
                  style={{
                    color: 'rgba(255,255,255,0.5)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'color 180ms ease',
                    padding: '4px 0',
                    minHeight: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isAr ? 'flex-end' : 'flex-start',
                    flexDirection: isAr ? 'row-reverse' : 'row',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div style={{ textAlign: isAr ? 'right' : 'left' }}>
            <h4 style={{
              color: '#fff',
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '16px',
              fontWeight: 700,
            }}>
              {isAr ? 'تواصل معنا' : 'Contact'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.5, flexDirection: isAr ? 'row-reverse' : 'row', textAlign: isAr ? 'right' : 'left' }}>
                <MapPin size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  {isAr ? 'نعمل في: ' : 'Operating in: '}
                  {serviceRegions.map((r) => regionName(r, locale)).join(isAr ? '، ' : ', ')}
                </span>
              </span>
              {/* Country-code strip — a quick visual read of the footprint.
                  ISO codes rather than flag emoji: Windows renders those as
                  two plain letters, so they would look broken on stage. */}
              <div aria-hidden="true" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', flexDirection: isAr ? 'row-reverse' : 'row' }}>
                {serviceRegions.map((r) => (
                  <span key={r.code} title={regionName(r, locale)} style={{
                    fontFamily: 'var(--font-ibm-plex-mono), monospace', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em',
                    padding: '3px 7px', borderRadius: '6px',
                    color: r.presence === 'office' ? 'var(--accent)' : 'rgba(255,255,255,0.55)',
                    background: r.presence === 'office' ? 'rgba(141,184,51,0.12)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${r.presence === 'office' ? 'rgba(141,184,51,0.35)' : 'rgba(255,255,255,0.1)'}`,
                  }}>{r.code}</span>
                ))}
              </div>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-all', flexDirection: isAr ? 'row-reverse' : 'row', textAlign: isAr ? 'right' : 'left' }}>
                <Globe size={16} color="var(--accent)" style={{ flexShrink: 0 }} /> www.fngtradingco.com
              </span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-all', flexDirection: isAr ? 'row-reverse' : 'row', textAlign: isAr ? 'right' : 'left' }}>
                <Mail size={16} color="var(--accent)" style={{ flexShrink: 0 }} /> {email || SITE_EMAIL}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom" style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <span style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.8rem',
          }}>
            {t('copyright')}
          </span>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href={`/${locale}/privacy-policy`} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textDecoration: 'none' }}>
              {t('links.privacy')}
            </a>
            <a href={`/${locale}/terms`} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textDecoration: 'none' }}>
              {t('links.terms')}
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .footer-root {
            padding: 48px 0 24px !important;
          }
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            margin-bottom: 32px !important;
          }
          .footer-logo {
            height: 72px !important;
          }
          .footer-bottom {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }
        }
        @media (max-width: 480px) {
          .footer-root {
            padding: 40px 0 20px !important;
          }
          .footer-logo {
            height: 56px !important;
          }
          .footer-grid {
            gap: 28px !important;
          }
        }
      `}</style>
    </footer>
  );
}
