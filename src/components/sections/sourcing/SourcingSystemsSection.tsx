'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Reveal from '@/components/ui/Reveal';
import { Router, Cable, FileCheck, Radio, ShieldCheck } from 'lucide-react';

type SystemsItem = {
  key: string;
  /** Always present — falls back to the only shot we have when a subcategory
   *  is missing either its hero or detail photo (bulk_utp_ftp, otdr). */
  primary: string;
  /** Swapped in on hover; omitted for the two subcategories above. */
  secondary?: string;
};

type SystemsGroup = {
  key: 'activeNetworking' | 'passiveNetworking';
  icon: typeof Router;
  lifestyle: string;
  items: SystemsItem[];
};

const IMG_BASE = '/sourcing-systems';

const GROUPS: SystemsGroup[] = [
  {
    key: 'activeNetworking',
    icon: Router,
    lifestyle: `${IMG_BASE}/active-networking/lifestyle.webp`,
    items: [
      { key: 'routers', primary: `${IMG_BASE}/active-networking/routers-hero.webp`, secondary: `${IMG_BASE}/active-networking/routers-detail.webp` },
      { key: 'switches', primary: `${IMG_BASE}/active-networking/switches-hero.webp`, secondary: `${IMG_BASE}/active-networking/switches-detail.webp` },
      { key: 'wirelessAccessPoints', primary: `${IMG_BASE}/active-networking/wireless-access-points-hero.webp`, secondary: `${IMG_BASE}/active-networking/wireless-access-points-detail.webp` },
      { key: 'wanModems', primary: `${IMG_BASE}/active-networking/wan-modems-hero.webp`, secondary: `${IMG_BASE}/active-networking/wan-modems-detail.webp` },
      { key: 'ipPbx', primary: `${IMG_BASE}/active-networking/ip-pbx-hero.webp`, secondary: `${IMG_BASE}/active-networking/ip-pbx-detail.webp` },
      { key: 'antennas', primary: `${IMG_BASE}/active-networking/antennas-hero.webp`, secondary: `${IMG_BASE}/active-networking/antennas-detail.webp` },
      { key: 'sfpTransceivers', primary: `${IMG_BASE}/active-networking/sfp-transceivers-hero.webp`, secondary: `${IMG_BASE}/active-networking/sfp-transceivers-detail.webp` },
    ],
  },
  {
    key: 'passiveNetworking',
    icon: Cable,
    lifestyle: `${IMG_BASE}/passive-networking/lifestyle.webp`,
    items: [
      { key: 'fibreOpticCable', primary: `${IMG_BASE}/passive-networking/fibre-optic-cable-hero.webp`, secondary: `${IMG_BASE}/passive-networking/fibre-optic-cable-detail.webp` },
      { key: 'copperPatchCords', primary: `${IMG_BASE}/passive-networking/copper-patch-cords-hero.webp`, secondary: `${IMG_BASE}/passive-networking/copper-patch-cords-detail.webp` },
      { key: 'bulkUtpFtp', primary: `${IMG_BASE}/passive-networking/bulk-utp-ftp-detail.webp` },
      { key: 'rj45Connectors', primary: `${IMG_BASE}/passive-networking/rj45-connectors-hero.webp`, secondary: `${IMG_BASE}/passive-networking/rj45-connectors-detail.webp` },
      { key: 'faceplates', primary: `${IMG_BASE}/passive-networking/faceplates-hero.webp`, secondary: `${IMG_BASE}/passive-networking/faceplates-detail.webp` },
      { key: 'networkCabinets', primary: `${IMG_BASE}/passive-networking/network-cabinets-hero.webp`, secondary: `${IMG_BASE}/passive-networking/network-cabinets-detail.webp` },
      { key: 'serverRacks', primary: `${IMG_BASE}/passive-networking/server-racks-hero.webp`, secondary: `${IMG_BASE}/passive-networking/server-racks-detail.webp` },
      { key: 'cableTrunking', primary: `${IMG_BASE}/passive-networking/cable-trunking-hero.webp`, secondary: `${IMG_BASE}/passive-networking/cable-trunking-detail.webp` },
      { key: 'pvcConduit', primary: `${IMG_BASE}/passive-networking/pvc-conduit-hero.webp`, secondary: `${IMG_BASE}/passive-networking/pvc-conduit-detail.webp` },
      { key: 'cableTesters', primary: `${IMG_BASE}/passive-networking/cable-testers-hero.webp`, secondary: `${IMG_BASE}/passive-networking/cable-testers-detail.webp` },
      { key: 'otdr', primary: `${IMG_BASE}/passive-networking/otdr-hero.webp` },
    ],
  },
];

const COMPLIANCE_KEYS = ['hs', 'citc', 'saber'] as const;
const COMPLIANCE_ICONS: Record<typeof COMPLIANCE_KEYS[number], React.ReactNode> = {
  hs: <FileCheck size={22} color="var(--accent-text)" strokeWidth={1.8} />,
  citc: <Radio size={22} color="var(--accent-text)" strokeWidth={1.8} />,
  saber: <ShieldCheck size={22} color="var(--accent-text)" strokeWidth={1.8} />,
};

export default function SourcingSystemsSection() {
  const t = useTranslations('sourcingSystems');
  const params = useParams();
  const isAr = params.locale === 'ar';

  return (
    <section id="sourcing-systems" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 56px)' }}>
          <span className="section-tag">{t('tag')}</span>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,3.5rem)', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>{t('title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', maxWidth: '700px', margin: '0 auto' }}>{t('subtitle')}</p>
        </div>

        {GROUPS.map((group, gi) => {
          const GroupIcon = group.icon;
          return (
            <div key={group.key} style={{ marginBottom: 'clamp(40px, 6vw, 64px)' }}>
              <div className="ssys-group-header" style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(20px, 4vw, 40px)',
                alignItems: 'center', marginBottom: 'clamp(24px, 4vw, 36px)',
              }}>
                <Reveal from={isAr ? 'end' : 'start'} style={{ order: isAr ? 2 : 1, textAlign: isAr ? 'right' : 'left' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg,rgba(26,61,43,0.08),rgba(141,184,51,0.08))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px',
                    border: '1px solid rgba(141,184,51,0.12)', marginInlineStart: 0, marginInlineEnd: 'auto',
                  }}>
                    <GroupIcon size={24} color="var(--accent)" strokeWidth={1.5} />
                  </div>
                  <h3 style={{ color: 'var(--primary)', marginBottom: '8px' }}>{t(`groups.${group.key}.name`)}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>{t(`groups.${group.key}.desc`)}</p>
                </Reveal>
                <Reveal from="scale" delay={100} style={{ order: isAr ? 1 : 2 }}>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                    <Image
                      src={group.lifestyle}
                      alt={t(`groups.${group.key}.name`)}
                      fill
                      sizes="(max-width: 900px) 100vw, 45vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </Reveal>
              </div>

              <div className="ssys-items-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
                {group.items.map((item, i) => (
                  <Reveal key={item.key} delay={(i % 4) * 70} from="scale" threshold={0.1}>
                    <div className="ssys-card card-lift" style={{
                      height: '100%', borderRadius: 'var(--radius-lg)', background: '#fff',
                      border: '1px solid var(--light-grey)', overflow: 'hidden', cursor: 'default',
                    }}>
                      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3' }}>
                        <Image
                          src={item.primary}
                          alt={t(`groups.${group.key}.items.${item.key}.name`)}
                          fill
                          sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="ssys-img-primary"
                          style={{ objectFit: 'cover' }}
                        />
                        {item.secondary && (
                          <Image
                            src={item.secondary}
                            alt=""
                            aria-hidden="true"
                            fill
                            sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="ssys-img-secondary"
                            style={{ objectFit: 'cover' }}
                          />
                        )}
                      </div>
                      <div style={{ padding: '14px 16px', textAlign: isAr ? 'right' : 'left' }}>
                        <h4 style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 700, marginBottom: '4px' }}>
                          {t(`groups.${group.key}.items.${item.key}.name`)}
                        </h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.6 }}>
                          {t(`groups.${group.key}.items.${item.key}.desc`)}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
              {gi < GROUPS.length - 1 && (
                <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', marginTop: 'clamp(40px, 6vw, 64px)' }} />
              )}
            </div>
          );
        })}

        <div className="ssys-compliance-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px',
          marginTop: 'clamp(8px, 2vw, 16px)', marginBottom: 'clamp(24px, 4vw, 36px)',
        }}>
          {COMPLIANCE_KEYS.map((key, i) => (
            <Reveal key={key} delay={i * 100}>
              <div style={{
                display: 'flex', gap: '12px', alignItems: 'flex-start', height: '100%',
                padding: '18px 20px', borderRadius: 'var(--radius-lg)', background: '#fff',
                border: '1px solid var(--light-grey)', textAlign: isAr ? 'right' : 'left',
                flexDirection: isAr ? 'row-reverse' : 'row',
              }}>
                <div style={{
                  flexShrink: 0, width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
                  background: 'rgba(141,184,51,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {COMPLIANCE_ICONS[key]}
                </div>
                <div>
                  <h4 style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>{t(`compliance.${key}.name`)}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.6 }}>{t(`compliance.${key}.desc`)}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <p style={{ color: '#888', fontSize: '0.78rem', lineHeight: 1.7, marginBottom: '4px', textAlign: 'center', maxWidth: '700px', marginInline: 'auto' }}>
          {t('complianceNote')}
        </p>
        <p style={{ color: '#888', fontSize: '0.78rem', lineHeight: 1.7, marginBottom: 'clamp(28px, 4vw, 40px)', textAlign: 'center', maxWidth: '700px', marginInline: 'auto' }}>
          {t('comingSoon')}
        </p>

        <div style={{ textAlign: 'center' }}>
          <a href="#contact" className="btn-primary">{t('cta')}</a>
        </div>
      </div>
      <style jsx>{`
        @media (hover: hover) {
          .ssys-card:hover .ssys-img-secondary {
            opacity: 1;
          }
        }
        .ssys-img-primary {
          transition: opacity 300ms ease;
        }
        .ssys-img-secondary {
          opacity: 0;
          transition: opacity 300ms ease;
        }
        @media (max-width: 1024px) {
          .ssys-items-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 900px) {
          .ssys-group-header { grid-template-columns: 1fr !important; }
          .ssys-group-header > :global(div) { order: unset !important; }
        }
        @media (max-width: 640px) {
          .ssys-compliance-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .ssys-items-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
