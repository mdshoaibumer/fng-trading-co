'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Reveal from '@/components/ui/Reveal';
import { Router, Cable, Camera, Fingerprint, PhoneCall, Server, FileCheck, Radio, ShieldCheck } from 'lucide-react';

type SystemsItem = {
  key: string;
  /** Always present — falls back to the only shot we have when a subcategory
   *  is missing either its hero or detail photo (bulk_utp_ftp, otdr). */
  primary: string;
  /** Swapped in on hover; omitted for the two subcategories above. */
  secondary?: string;
};

type GroupKey =
  | 'activeNetworking'
  | 'passiveNetworking'
  | 'securitySurveillance'
  | 'accessControl'
  | 'businessTelephony'
  | 'powerComputing';

type SystemsGroup = {
  key: GroupKey;
  /** kebab-case — doubles as the /sourcing-systems/<slug>/ image folder and the anchor id. */
  slug: string;
  icon: typeof Router;
  lifestyle: string;
  items: SystemsItem[];
};

const IMG_BASE = '/sourcing-systems';

const GROUPS: SystemsGroup[] = [
  {
    key: 'activeNetworking',
    slug: 'active-networking',
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
    slug: 'passive-networking',
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
  {
    key: 'securitySurveillance',
    slug: 'security-surveillance',
    icon: Camera,
    lifestyle: `${IMG_BASE}/security-surveillance/lifestyle.webp`,
    items: [
      { key: 'cctvCameras', primary: `${IMG_BASE}/security-surveillance/cctv-cameras-hero.webp`, secondary: `${IMG_BASE}/security-surveillance/cctv-cameras-detail.webp` },
      { key: 'ipCameras', primary: `${IMG_BASE}/security-surveillance/ip-cameras-hero.webp`, secondary: `${IMG_BASE}/security-surveillance/ip-cameras-detail.webp` },
      { key: 'nvrRecorders', primary: `${IMG_BASE}/security-surveillance/nvr-recorders-hero.webp`, secondary: `${IMG_BASE}/security-surveillance/nvr-recorders-detail.webp` },
      { key: 'dvrRecorders', primary: `${IMG_BASE}/security-surveillance/dvr-recorders-hero.webp`, secondary: `${IMG_BASE}/security-surveillance/dvr-recorders-detail.webp` },
      { key: 'professionalMonitors', primary: `${IMG_BASE}/security-surveillance/professional-monitors-hero.webp`, secondary: `${IMG_BASE}/security-surveillance/professional-monitors-detail.webp` },
      { key: 'burglarAlarmSystems', primary: `${IMG_BASE}/security-surveillance/burglar-alarm-systems-hero.webp`, secondary: `${IMG_BASE}/security-surveillance/burglar-alarm-systems-detail.webp` },
      { key: 'fireAlarmSystems', primary: `${IMG_BASE}/security-surveillance/fire-alarm-systems-hero.webp`, secondary: `${IMG_BASE}/security-surveillance/fire-alarm-systems-detail.webp` },
      { key: 'videoDoorIntercoms', primary: `${IMG_BASE}/security-surveillance/video-door-intercoms-hero.webp`, secondary: `${IMG_BASE}/security-surveillance/video-door-intercoms-detail.webp` },
      { key: 'cameraHousings', primary: `${IMG_BASE}/security-surveillance/camera-housings-hero.webp`, secondary: `${IMG_BASE}/security-surveillance/camera-housings-detail.webp` },
      { key: 'cameraBrackets', primary: `${IMG_BASE}/security-surveillance/camera-brackets-hero.webp`, secondary: `${IMG_BASE}/security-surveillance/camera-brackets-detail.webp` },
      { key: 'mountingAccessories', primary: `${IMG_BASE}/security-surveillance/mounting-accessories-hero.webp`, secondary: `${IMG_BASE}/security-surveillance/mounting-accessories-detail.webp` },
    ],
  },
  {
    key: 'accessControl',
    slug: 'access-control',
    icon: Fingerprint,
    lifestyle: `${IMG_BASE}/access-control/lifestyle.webp`,
    items: [
      { key: 'biometricFingerprintReaders', primary: `${IMG_BASE}/access-control/biometric-fingerprint-readers-hero.webp`, secondary: `${IMG_BASE}/access-control/biometric-fingerprint-readers-detail.webp` },
      { key: 'biometricAccessReaders', primary: `${IMG_BASE}/access-control/biometric-access-readers-hero.webp`, secondary: `${IMG_BASE}/access-control/biometric-access-readers-detail.webp` },
      { key: 'standaloneAccessTerminals', primary: `${IMG_BASE}/access-control/standalone-access-terminals-hero.webp`, secondary: `${IMG_BASE}/access-control/standalone-access-terminals-detail.webp` },
      { key: 'timeAttendanceTerminals', primary: `${IMG_BASE}/access-control/time-attendance-terminals-hero.webp`, secondary: `${IMG_BASE}/access-control/time-attendance-terminals-detail.webp` },
      { key: 'electricDoorLocks', primary: `${IMG_BASE}/access-control/electric-door-locks-hero.webp`, secondary: `${IMG_BASE}/access-control/electric-door-locks-detail.webp` },
      { key: 'electricStrikes', primary: `${IMG_BASE}/access-control/electric-strikes-hero.webp`, secondary: `${IMG_BASE}/access-control/electric-strikes-detail.webp` },
      { key: 'electromagneticMaglocks', primary: `${IMG_BASE}/access-control/electromagnetic-maglocks-hero.webp`, secondary: `${IMG_BASE}/access-control/electromagnetic-maglocks-detail.webp` },
      { key: 'rfidCards', primary: `${IMG_BASE}/access-control/rfid-cards-hero.webp`, secondary: `${IMG_BASE}/access-control/rfid-cards-detail.webp` },
      { key: 'proximitySmartCards', primary: `${IMG_BASE}/access-control/proximity-smart-cards-hero.webp`, secondary: `${IMG_BASE}/access-control/proximity-smart-cards-detail.webp` },
    ],
  },
  {
    key: 'businessTelephony',
    slug: 'business-telephony',
    icon: PhoneCall,
    lifestyle: `${IMG_BASE}/business-telephony/lifestyle.webp`,
    items: [
      { key: 'analoguePbx', primary: `${IMG_BASE}/business-telephony/analogue-pbx-hero.webp`, secondary: `${IMG_BASE}/business-telephony/analogue-pbx-detail.webp` },
      { key: 'ipPbxSystems', primary: `${IMG_BASE}/business-telephony/ip-pbx-systems-hero.webp`, secondary: `${IMG_BASE}/business-telephony/ip-pbx-systems-detail.webp` },
      { key: 'deskTelephones', primary: `${IMG_BASE}/business-telephony/desk-telephones-hero.webp`, secondary: `${IMG_BASE}/business-telephony/desk-telephones-detail.webp` },
      { key: 'ipTelephones', primary: `${IMG_BASE}/business-telephony/ip-telephones-hero.webp`, secondary: `${IMG_BASE}/business-telephony/ip-telephones-detail.webp` },
      { key: 'headsets', primary: `${IMG_BASE}/business-telephony/headsets-hero.webp`, secondary: `${IMG_BASE}/business-telephony/headsets-detail.webp` },
    ],
  },
  {
    key: 'powerComputing',
    slug: 'power-computing',
    icon: Server,
    lifestyle: `${IMG_BASE}/power-computing/lifestyle.webp`,
    items: [
      { key: 'upsUnits', primary: `${IMG_BASE}/power-computing/ups-units-hero.webp`, secondary: `${IMG_BASE}/power-computing/ups-units-detail.webp` },
      { key: 'poeInjectors', primary: `${IMG_BASE}/power-computing/poe-injectors-hero.webp`, secondary: `${IMG_BASE}/power-computing/poe-injectors-detail.webp` },
      { key: 'powerAdapters', primary: `${IMG_BASE}/power-computing/power-adapters-hero.webp`, secondary: `${IMG_BASE}/power-computing/power-adapters-detail.webp` },
      { key: 'sealedLeadAcidBatteries', primary: `${IMG_BASE}/power-computing/sealed-lead-acid-batteries-hero.webp`, secondary: `${IMG_BASE}/power-computing/sealed-lead-acid-batteries-detail.webp` },
      { key: 'servers', primary: `${IMG_BASE}/power-computing/servers-hero.webp`, secondary: `${IMG_BASE}/power-computing/servers-detail.webp` },
      { key: 'laptops', primary: `${IMG_BASE}/power-computing/laptops-hero.webp`, secondary: `${IMG_BASE}/power-computing/laptops-detail.webp` },
      { key: 'desktopComputers', primary: `${IMG_BASE}/power-computing/desktop-computers-hero.webp`, secondary: `${IMG_BASE}/power-computing/desktop-computers-detail.webp` },
      { key: 'multifunctionPrinters', primary: `${IMG_BASE}/power-computing/multifunction-printers-hero.webp`, secondary: `${IMG_BASE}/power-computing/multifunction-printers-detail.webp` },
      { key: 'businessCopiers', primary: `${IMG_BASE}/power-computing/business-copiers-hero.webp`, secondary: `${IMG_BASE}/power-computing/business-copiers-detail.webp` },
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
    <section id="sourcing-systems" className="section" style={{ background: 'var(--bg-secondary)', overflow: 'visible' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 56px)' }}>
          <span className="section-tag">{t('tag')}</span>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,3.5rem)', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>{t('title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', maxWidth: '700px', margin: '0 auto' }}>{t('subtitle')}</p>
        </div>

        <nav
          aria-label={t('quickNavLabel')}
          className="ssys-quicknav"
          style={{
            display: 'flex', gap: '10px', overflowX: 'auto', WebkitOverflowScrolling: 'touch',
            padding: '10px', marginBottom: 'clamp(32px, 5vw, 48px)', borderRadius: 'var(--radius-lg)',
            background: '#fff', border: '1px solid var(--light-grey)', boxShadow: 'var(--shadow-sm)',
            position: 'sticky', top: '120px', zIndex: 5, flexDirection: isAr ? 'row-reverse' : 'row',
          }}
        >
          {GROUPS.map((group) => {
            const NavIcon = group.icon;
            return (
              <a
                key={group.key}
                href={`#ssys-${group.slug}`}
                className="ssys-nav-chip"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
                  padding: '9px 16px', borderRadius: 'var(--radius-pill)',
                  background: 'var(--bg-secondary)', color: 'var(--primary)',
                  fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap',
                  textDecoration: 'none', border: '1px solid transparent',
                  flexDirection: isAr ? 'row-reverse' : 'row',
                }}
              >
                <NavIcon size={16} color="var(--accent)" strokeWidth={2} />
                {t(`groups.${group.key}.name`)}
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{group.items.length}</span>
              </a>
            );
          })}
        </nav>

        {GROUPS.map((group, gi) => {
          const GroupIcon = group.icon;
          return (
            <div key={group.key} id={`ssys-${group.slug}`} style={{ marginBottom: 'clamp(40px, 6vw, 64px)', scrollMarginTop: '180px' }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexDirection: isAr ? 'row-reverse' : 'row', justifyContent: isAr ? 'flex-end' : 'flex-start' }}>
                    <h3 style={{ color: 'var(--primary)', margin: 0 }}>{t(`groups.${group.key}.name`)}</h3>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-text)',
                      background: 'rgba(141,184,51,0.10)', padding: '3px 10px', borderRadius: 'var(--radius-pill)',
                      whiteSpace: 'nowrap',
                    }}>
                      {t('itemsCount', { count: group.items.length })}
                    </span>
                  </div>
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

        <p style={{ color: '#888', fontSize: '0.78rem', lineHeight: 1.7, marginBottom: 'clamp(28px, 4vw, 40px)', textAlign: 'center', maxWidth: '700px', marginInline: 'auto' }}>
          {t('complianceNote')}
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
          .ssys-nav-chip:hover {
            background: rgba(141, 184, 51, 0.1) !important;
            border-color: rgba(141, 184, 51, 0.3) !important;
          }
        }
        .ssys-nav-chip:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }
        .ssys-quicknav::-webkit-scrollbar {
          height: 4px;
        }
        .ssys-quicknav::-webkit-scrollbar-thumb {
          background: var(--light-grey);
          border-radius: 999px;
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
          .ssys-quicknav { position: static !important; }
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
