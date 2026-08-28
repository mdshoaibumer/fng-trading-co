'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Globe, Mail } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';

  return (
    <footer
      id="footer"
      className="footer-root"
      style={{
        background: 'linear-gradient(180deg, #0F2A1C 0%, #0D0D0D 100%)',
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
              {[
                { href: `/${locale}#hero`, label: isAr ? 'الرئيسية' : 'Home' },
                { href: `/${locale}/about`, label: isAr ? 'من نحن' : 'About' },
                { href: `/${locale}/sustainability`, label: isAr ? 'الاستدامة' : 'Sustainability' },
                { href: `/${locale}/eco-inks`, label: isAr ? 'أحبار إيكو' : 'Eco Inks' },
                { href: `/${locale}/industries`, label: isAr ? 'القطاعات' : 'Industries' },
                { href: `/${locale}/printer-parts`, label: isAr ? 'قطع الطابعات' : 'Printer Parts' },
                { href: `/${locale}/faq`, label: isAr ? 'الأسئلة الشائعة' : 'FAQ' },
                { href: `/${locale}/contact`, label: isAr ? 'تواصل معنا' : 'Contact' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
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
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#8DB833')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                >
                  {link.label}
                </a>
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
                <MapPin size={16} color="#8DB833" style={{ flexShrink: 0, marginTop: '2px' }} /> {isAr ? 'نخدم مناطق: الرياض، جدة، الدمام، والمدينة المنورة' : 'Serving: Riyadh, Jeddah, Dammam, & Al Madinah'}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-all', flexDirection: isAr ? 'row-reverse' : 'row', textAlign: isAr ? 'right' : 'left' }}>
                <Globe size={16} color="#8DB833" style={{ flexShrink: 0 }} /> www.fngtradingco.com
              </span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-all', flexDirection: isAr ? 'row-reverse' : 'row', textAlign: isAr ? 'right' : 'left' }}>
                <Mail size={16} color="#8DB833" style={{ flexShrink: 0 }} /> Support@fngtradingco.com
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
            color: 'rgba(255,255,255,0.35)',
            fontSize: '0.8rem',
          }}>
            {t('copyright')}
          </span>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href={`/${locale}/privacy-policy`} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', textDecoration: 'none' }}>
              {t('links.privacy')}
            </a>
            <a href={`/${locale}/terms`} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', textDecoration: 'none' }}>
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
