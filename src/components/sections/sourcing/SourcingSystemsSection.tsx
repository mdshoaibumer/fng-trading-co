'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Reveal from '@/components/ui/Reveal';
import { useDialogA11y } from '@/lib/useDialogA11y';
import { Router, Cable, Camera, Fingerprint, PhoneCall, Server, FileCheck, Radio, ShieldCheck, X, Maximize2 } from 'lucide-react';

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

  const [selectedGroup, setSelectedGroup] = useState<GroupKey | null>(null);
  const [mounted, setMounted] = useState(false);
  const activeGroup = GROUPS.find((g) => g.key === selectedGroup) ?? null;
  const closeModal = () => setSelectedGroup(null);
  const modalRef = useDialogA11y<HTMLDivElement>(selectedGroup !== null, closeModal);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedGroup ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedGroup]);

  const handleModalKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const scrollTarget = e.currentTarget.querySelector('.ssys-modal-body') as HTMLElement | null;
    if (!scrollTarget) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        scrollTarget.scrollBy({ top: 120, behavior: 'smooth' });
        break;
      case 'ArrowUp':
        e.preventDefault();
        scrollTarget.scrollBy({ top: -120, behavior: 'smooth' });
        break;
      case 'PageDown':
        e.preventDefault();
        scrollTarget.scrollBy({ top: scrollTarget.clientHeight * 0.85, behavior: 'smooth' });
        break;
      case 'PageUp':
        e.preventDefault();
        scrollTarget.scrollBy({ top: -scrollTarget.clientHeight * 0.85, behavior: 'smooth' });
        break;
      case 'Home':
        e.preventDefault();
        scrollTarget.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'End':
        e.preventDefault();
        scrollTarget.scrollTo({ top: scrollTarget.scrollHeight, behavior: 'smooth' });
        break;
    }
  };

  return (
    <section id="sourcing-systems" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 56px)' }}>
          <span className="section-tag">{t('tag')}</span>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,3.5rem)', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>{t('title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', maxWidth: '700px', margin: '0 auto' }}>{t('subtitle')}</p>
        </div>

        <div className="ssys-cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: 'clamp(40px, 6vw, 64px)' }}>
          {GROUPS.map((group, i) => {
            const GroupIcon = group.icon;
            return (
              <Reveal key={group.key} delay={i * 80} from="scale" threshold={0.15}>
                <div
                  role="button"
                  tabIndex={0}
                  aria-haspopup="dialog"
                  aria-label={`${t('galleryLabel', { group: t(`groups.${group.key}.name`) })} — ${t('itemsCount', { count: group.items.length })}`}
                  className="ssys-cat-card card-lift"
                  style={{
                    position: 'relative', aspectRatio: '4/3', borderRadius: 'var(--radius-2xl)',
                    overflow: 'hidden', cursor: 'pointer', boxShadow: 'var(--shadow-md)',
                  }}
                  onClick={() => setSelectedGroup(group.key)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedGroup(group.key); } }}
                >
                  <Image
                    src={group.lifestyle}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 50vw, 33vw"
                    className="ssys-cat-img"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="ssys-cat-overlay" aria-hidden="true" style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, rgba(26,61,43,0) 30%, rgba(26,61,43,0.55) 68%, rgba(26,61,43,0.9) 100%)',
                  }} />
                  <div aria-hidden="true" style={{
                    position: 'absolute', top: '16px', [isAr ? 'right' : 'left']: '16px',
                    width: '42px', height: '42px', borderRadius: 'var(--radius-md)',
                    background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <GroupIcon size={20} color="#fff" strokeWidth={1.8} />
                  </div>
                  <div style={{
                    position: 'absolute', insetInlineStart: 0, insetInlineEnd: 0, bottom: 0,
                    padding: 'clamp(16px, 3vw, 24px)', textAlign: isAr ? 'right' : 'left',
                  }}>
                    <span style={{
                      display: 'inline-block', marginBottom: '8px', padding: '3px 10px', borderRadius: 'var(--radius-pill)',
                      background: 'rgba(26,61,43,0.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                      color: '#fff', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.03em',
                      textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                    }}>
                      {t('itemsCount', { count: group.items.length })}
                    </span>
                    <h3 style={{ color: '#fff', fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)', fontWeight: 800, marginBottom: '6px', textShadow: '0 2px 12px rgba(0,0,0,0.25)' }}>
                      {t(`groups.${group.key}.name`)}
                    </h3>
                    <span className="ssys-cat-cta" style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#fff',
                      fontSize: '0.8rem', fontWeight: 600, flexDirection: isAr ? 'row-reverse' : 'row',
                    }}>
                      {t('viewGallery')} <Maximize2 size={13} />
                    </span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

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

        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem', lineHeight: 1.7, marginBottom: 'clamp(28px, 4vw, 40px)', textAlign: 'center', maxWidth: '700px', marginInline: 'auto' }}>
          {t('complianceNote')}
        </p>

        <div style={{ textAlign: 'center' }}>
          <a href="#contact" className="btn-primary">{t('cta')}</a>
        </div>
      </div>

      {/* Gallery modal rendered via portal directly to body for true viewport centering */}
      {mounted && createPortal(
        <div
          className="ssys-modal-backdrop"
          role="presentation"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(10, 26, 17, 0.72)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(12px, 3vw, 28px)',
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            opacity: selectedGroup ? 1 : 0,
            pointerEvents: selectedGroup ? 'auto' : 'none',
            visibility: selectedGroup ? 'visible' : 'hidden',
            transition: 'opacity 280ms ease, visibility 0s linear ' + (selectedGroup ? '0s' : '280ms'),
          }}
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ssys-modal-title"
            tabIndex={-1}
            className="ssys-modal-content"
            style={{
              width: '100%',
              maxWidth: '1120px',
              maxHeight: 'min(88vh, 88dvh)',
              margin: 'auto',
              background: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 30px 90px rgba(10, 26, 17, 0.45), 0 0 0 1px rgba(141, 184, 51, 0.25)',
              position: 'relative',
              transform: selectedGroup ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
              transition: 'transform 360ms var(--ease-ink)',
              direction: isAr ? 'rtl' : 'ltr',
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleModalKeyDown}
          >
            {activeGroup && (() => {
              const ActiveIcon = activeGroup.icon;
              return (
                <>
                  <div
                    className="ssys-modal-header"
                    style={{
                      flexShrink: 0,
                      background: 'linear-gradient(135deg, var(--primary, #1A3D2B) 0%, #264531 60%, var(--primary-light, #4A5E2A) 100%)',
                      padding: 'clamp(20px, 3vw, 28px) clamp(20px, 3.5vw, 36px) clamp(16px, 2.5vw, 20px)',
                      color: '#FFFFFF',
                      position: 'relative',
                      textAlign: isAr ? 'right' : 'left',
                      borderBottom: '1px solid rgba(141, 184, 51, 0.25)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={closeModal}
                      aria-label={isAr ? 'إغلاق' : 'Close'}
                      style={{
                        position: 'absolute',
                        top: '16px',
                        [isAr ? 'left' : 'right']: '16px',
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.25)',
                        color: '#FFFFFF',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 200ms ease',
                        zIndex: 10,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                        e.currentTarget.style.transform = 'scale(1.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <X size={19} />
                    </button>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        flexDirection: isAr ? 'row-reverse' : 'row',
                        marginBottom: '8px',
                        paddingInlineEnd: '48px',
                      }}
                    >
                      <div
                        style={{
                          flexShrink: 0,
                          width: '46px',
                          height: '46px',
                          borderRadius: 'var(--radius-md)',
                          background: 'rgba(255,255,255,0.14)',
                          backdropFilter: 'blur(10px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid rgba(255,255,255,0.3)',
                        }}
                      >
                        <ActiveIcon size={24} color="#FFFFFF" strokeWidth={1.8} />
                      </div>
                      <div>
                        <h3
                          id="ssys-modal-title"
                          style={{
                            color: '#FFFFFF',
                            fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                            fontWeight: 800,
                            marginBottom: '2px',
                          }}
                        >
                          {t(`groups.${activeGroup.key}.name`)}
                        </h3>
                        <span style={{ fontSize: '0.76rem', color: 'var(--accent, #8DB833)', fontWeight: 700 }}>
                          {t('itemsCount', { count: activeGroup.items.length })}
                        </span>
                      </div>
                    </div>

                    <p
                      style={{
                        color: 'rgba(255,255,255,0.88)',
                        fontSize: '0.84rem',
                        maxWidth: '720px',
                        lineHeight: 1.55,
                        marginBottom: '14px',
                      }}
                    >
                      {t(`groups.${activeGroup.key}.desc`)}
                    </p>

                    {/* Category Navigation Menu Tabs */}
                    <div
                      className="ssys-modal-tabs"
                      role="tablist"
                      aria-label={isAr ? 'أقسام كتالوج الأنظمة' : 'Enterprise Catalog Categories'}
                      style={{
                        display: 'flex',
                        gap: '8px',
                        overflowX: 'auto',
                        paddingBottom: '2px',
                        scrollbarWidth: 'none',
                      }}
                    >
                      {GROUPS.map((g) => {
                        const isCurrent = g.key === activeGroup.key;
                        const GIcon = g.icon;
                        return (
                          <button
                            key={g.key}
                            type="button"
                            role="tab"
                            aria-selected={isCurrent}
                            onClick={() => setSelectedGroup(g.key)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '7px',
                              padding: '7px 13px',
                              borderRadius: 'var(--radius-pill)',
                              border: isCurrent
                                ? '1.5px solid var(--accent, #8DB833)'
                                : '1px solid rgba(255, 255, 255, 0.22)',
                              background: isCurrent
                                ? 'rgba(141, 184, 51, 0.28)'
                                : 'rgba(255, 255, 255, 0.09)',
                              color: isCurrent ? '#FFFFFF' : 'rgba(255, 255, 255, 0.82)',
                              fontWeight: isCurrent ? 700 : 500,
                              fontSize: '0.78rem',
                              whiteSpace: 'nowrap',
                              cursor: 'pointer',
                              transition: 'all 180ms ease',
                              backdropFilter: 'blur(8px)',
                              WebkitBackdropFilter: 'blur(8px)',
                            }}
                            onMouseEnter={(e) => {
                              if (!isCurrent) {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
                                e.currentTarget.style.color = '#FFFFFF';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isCurrent) {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
                                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.82)';
                              }
                            }}
                          >
                            <GIcon size={14} color={isCurrent ? 'var(--accent, #8DB833)' : '#FFFFFF'} />
                            <span>{t(`groups.${g.key}.name`)}</span>
                            <span
                              style={{
                                fontSize: '0.68rem',
                                padding: '1px 5px',
                                borderRadius: '999px',
                                background: isCurrent ? 'var(--accent, #8DB833)' : 'rgba(255, 255, 255, 0.16)',
                                color: isCurrent ? '#0E2318' : '#FFFFFF',
                                fontWeight: 700,
                              }}
                            >
                              {g.items.length}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div
                    className="ssys-modal-body"
                    style={{
                      flex: '1 1 auto',
                      overflowY: 'auto',
                      overscrollBehavior: 'contain',
                      padding: 'clamp(20px, 3.5vw, 36px)',
                    }}
                  >
                    <div
                      className="ssys-gallery-grid"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '16px',
                      }}
                    >
                      {activeGroup.items.map((item) => (
                        <div
                          key={item.key}
                          className="ssys-gallery-card card-lift"
                          style={{
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--light-grey)',
                            overflow: 'hidden',
                            background: '#FFFFFF',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                          }}
                        >
                          <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', background: '#F8FAF7' }}>
                            <Image
                              src={item.primary}
                              alt={t(`groups.${activeGroup.key}.items.${item.key}.name`)}
                              fill
                              sizes="(max-width: 480px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              className="ssys-img-primary"
                              style={{ objectFit: 'cover' }}
                            />
                            {item.secondary && (
                              <Image
                                src={item.secondary}
                                alt=""
                                aria-hidden="true"
                                fill
                                sizes="(max-width: 480px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="ssys-img-secondary"
                                style={{ objectFit: 'cover' }}
                              />
                            )}
                          </div>
                          <div style={{ padding: '12px 14px', textAlign: isAr ? 'right' : 'left' }}>
                            <h4 style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                              {t(`groups.${activeGroup.key}.items.${item.key}.name`)}
                            </h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.76rem', lineHeight: 1.55 }}>
                              {t(`groups.${activeGroup.key}.items.${item.key}.desc`)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>,
        document.body
      )}

      <style jsx>{`
        @media (hover: hover) {
          .ssys-cat-card:hover .ssys-cat-img { transform: scale(1.07); }
          .ssys-gallery-card:hover .ssys-img-secondary { opacity: 1; }
        }
        .ssys-cat-img {
          transition: transform 500ms var(--ease-ink);
        }
        .ssys-img-primary {
          transition: opacity 300ms ease;
        }
        .ssys-img-secondary {
          opacity: 0;
          transition: opacity 300ms ease;
        }
        .ssys-modal-tabs::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 1024px) {
          .ssys-cat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .ssys-gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .ssys-cat-grid { grid-template-columns: 1fr !important; }
          .ssys-compliance-grid { grid-template-columns: 1fr !important; }
          .ssys-gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .ssys-modal-backdrop { padding: 8px !important; }
          .ssys-modal-content { max-height: 96dvh !important; border-radius: var(--radius-lg) !important; }
        }
      `}</style>
    </section>
  );
}
