'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ship,
  Plane,
  ShieldCheck,
  FileCheck2,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Radio,
} from 'lucide-react';
import BorderBeam from '@/components/ui/BorderBeam';
import SpotlightCard from '@/components/ui/SpotlightCard';

interface RouteStage {
  id: string;
  step: string;
  titleEn: string;
  titleAr: string;
  hubEn: string;
  hubAr: string;
  durationSeaEn: string;
  durationSeaAr: string;
  durationAirEn: string;
  durationAirAr: string;
  statusEn: string;
  statusAr: string;
  descEn: string;
  descAr: string;
  docs: { en: string; ar: string }[];
  complianceBadgeEn: string;
  complianceBadgeAr: string;
  coordinates: { x: number; y: number };
}

const STAGES: RouteStage[] = [
  {
    id: 'factory',
    step: '01',
    titleEn: 'Factory Floor & AQL 2.5 QC',
    titleAr: 'فحص المصنع وضمان الجودة AQL',
    hubEn: 'Shenzhen / Guangzhou / Yiwu',
    hubAr: 'شنتشن / قوانغتشو / إيوو',
    durationSeaEn: '1–2 Days',
    durationSeaAr: '١ – ٢ يوم',
    durationAirEn: '24 Hours',
    durationAirAr: '٢٤ ساعة',
    statusEn: 'Audited & Inspected',
    statusAr: 'مفحوص ومطابق للمواصفات',
    descEn: 'On-site engineering inspection against approved golden samples, verifying component specs, firmware, soldering tolerances, and packaging before leaving the production line.',
    descAr: 'فحص هندسي ميداني مطابق للعينة المعتمدة، للتحقق من المواصفات الفنية والبرمجيات ومعايير التغليف قبل خروج الشحنة من المصنع.',
    docs: [
      { en: 'ISO 2859-1 AQL Inspection Certificate', ar: 'شهادة فحص الجودة ISO 2859-1 AQL' },
      { en: 'Physical Golden Sample Sign-Off', ar: 'محضر اعتماد العينة المادية المسبقة' },
      { en: 'CE / FCC / RoHS Compliance Dossier', ar: 'ملف المطابقة لشهادات CE و FCC و RoHS' },
    ],
    complianceBadgeEn: 'Zero-Defect Gate',
    complianceBadgeAr: 'بوابة خلو العيوب',
    coordinates: { x: 12, y: 50 },
  },
  {
    id: 'port-origin',
    step: '02',
    titleEn: 'Origin Port Clearance & B/L',
    titleAr: 'التخليص والتحميل في ميناء المنشأ',
    hubEn: 'Port of Yantian / Nansha / Ningbo',
    hubAr: 'ميناء يانتيان / نانشا / نينغبو',
    durationSeaEn: '2–3 Days',
    durationSeaAr: '٢ – ٣ أيام',
    durationAirEn: '12–24 Hours',
    durationAirAr: '١٢ – ٢٤ ساعة',
    statusEn: 'Export Cleared',
    statusAr: 'تم التخليص التصديري',
    descEn: 'Secure container consolidation, export customs manifest filing, and issuance of original Bill of Lading (B/L) or Air Waybill (AWB) with precise commercial invoices.',
    descAr: 'تجميع الحاويات الآمن وتوثيق بيانات التصدير الجمركية وإصدار بوليصة الشحن الأصلية والفاتورة التجارية المعتمدة.',
    docs: [
      { en: 'Original Master Bill of Lading (MBL)', ar: 'بوليصة الشحن البحرية الأصلية (MBL)' },
      { en: 'Export Customs Declaration Form', ar: 'بيان التصدير الجمركي الصيني' },
      { en: 'Itemized Harmonized Tariff Packing List', ar: 'قائمة التعبئة والتغليف مع بنود التعرفة' },
    ],
    complianceBadgeEn: 'Customs Manifest Verified',
    complianceBadgeAr: 'البيان الجمركي موثّق',
    coordinates: { x: 32, y: 40 },
  },
  {
    id: 'maritime-transit',
    step: '03',
    titleEn: 'International Freight Transit',
    titleAr: 'المسار الملاحي والشحن الدولي',
    hubEn: 'Malacca Strait ➔ Indian Ocean ➔ Red Sea',
    hubAr: 'مضيق ملقا ➔ المحيط الهندي ➔ البحر الأحمر',
    durationSeaEn: '18–22 Days',
    durationSeaAr: '١٨ – ٢٢ يوماً',
    durationAirEn: '3–5 Days',
    durationAirAr: '٣ – ٥ أيام',
    statusEn: 'In Transit (Satellite Monitored)',
    statusAr: 'قيد الإبحار (مراقبة بالقمر الصناعي)',
    descEn: 'Real-time GPS container tracking from origin port through international shipping lanes, temperature & humidity logged to protect sensitive electronics.',
    descAr: 'تتبع لحظي للحاويات عبر الأقمار الصناعية طوال مسار الإبحار الدولي، مع مراقبة درجات الحرارة والرطوبة لحماية الإلكترونيات الحساسة.',
    docs: [
      { en: 'Container Marine Cargo Insurance Policy', ar: 'وثيقة التأمين البحري الشامل على البضائع' },
      { en: 'Vessel Live Telemetry & AIS Tracking', ar: 'بيانات التتبع الملاحي اللحظي للسفينة' },
      { en: 'Pre-Arrival Port Notification (PAN)', ar: 'إشعار الوصول المسبق للميناء' },
    ],
    complianceBadgeEn: 'Insured Global Freight',
    complianceBadgeAr: 'شحن مؤمّن بالكامل',
    coordinates: { x: 55, y: 62 },
  },
  {
    id: 'saudi-customs',
    step: '04',
    titleEn: 'ZATCA Clearance & SABER Gate',
    titleAr: 'التخليص الجمركي (زكاة وضريبة) ومنصة سابر',
    hubEn: 'Jeddah Islamic Port / King Abdulaziz Dammam',
    hubAr: 'ميناء جدة الإسلامي / ميناء الملك عبدالعزيز بالدمام',
    durationSeaEn: '24–48 Hours',
    durationSeaAr: '٢٤ – ٤٨ ساعة',
    durationAirEn: '12–24 Hours',
    durationAirAr: '١٢ – ٢٤ ساعة',
    statusEn: 'Pre-Cleared on Arrival',
    statusAr: 'مخلّصة مسبقاً فور الوصول',
    descEn: 'Automatic classification against ZATCA Integrated Customs Tariff, CITC type approval for radio/wireless electronics, and instant clearance through the Saudi SABER conformity system.',
    descAr: 'تصنيف آلي وفق التعرفة الجمركية المتكاملة (ZATCA)، واعتماد هيئة الاتصالات وتقنية المعلومات، وإصدار شهادات مطابقة سابر الفورية.',
    docs: [
      { en: 'SABER Conformity Certificate (PCoC / SCoC)', ar: 'شهادات مطابقة سابر المعتمدة' },
      { en: 'ZATCA Automated Customs Bayan', ar: 'البيان الجمركي الصادر من منصة فسح' },
      { en: 'CITC / CST Wireless Equipment Approval', ar: 'اعتماد هيئة الاتصالات والفضاء والتقنية' },
    ],
    complianceBadgeEn: '100% KSA Regulatory Compliance',
    complianceBadgeAr: 'مطابقة نظامية سعودية ١٠٠٪',
    coordinates: { x: 75, y: 45 },
  },
  {
    id: 'last-mile',
    step: '05',
    titleEn: 'Bonded Transit & Doorstep Delivery',
    titleAr: 'النقل الداخلي الآمن والتسليم للباب',
    hubEn: 'Riyadh Central Logistics Hub ➔ Final Office',
    hubAr: 'مركز الرياض اللوجستي ➔ مستودعك أو مكتبك',
    durationSeaEn: 'Same Day / 24h',
    durationSeaAr: 'نفس اليوم / خلال ٢٤ ساعة',
    durationAirEn: 'Same Day',
    durationAirAr: 'في نفس اليوم',
    statusEn: 'Completed & Delivered',
    statusAr: 'تم التسليم وتوقيع المحضر',
    descEn: 'Bonded GPS-tracked ground fleet dispatch to your corporate warehouse or office across all 13 provinces in the Kingdom, backed by a signed physical and digital Proof of Delivery.',
    descAr: 'أسطول نقل بري محمي ومتبع إلى مستودعاتك أو مقراتك في كافة مناطق المملكة الـ ١٣، مع تسليم رسمي بمحضر استلام معتمد.',
    docs: [
      { en: 'Signed Electronic Proof of Delivery (POD)', ar: 'محضر إثبات الاستليم والتسليم الإلكتروني' },
      { en: 'Official Tax Invoice (ZATCA Compliant)', ar: 'فاتورة ضريبية إلكترونية معتمدة' },
      { en: 'Certificate of Origin & Warranty Bond', ar: 'شهادة المنشأ ووثيقة الضمان الذهبي' },
    ],
    complianceBadgeEn: 'Door-to-Door Guaranteed',
    complianceBadgeAr: 'تسليم مضمون للباب',
    coordinates: { x: 92, y: 50 },
  },
];

export default function SourcingRouteRadar({
  isAr = false,
  locale = 'en',
}: {
  isAr?: boolean;
  locale?: string;
}) {
  const [activeStageId, setActiveStageId] = useState<string>('factory');
  const [freightMode, setFreightMode] = useState<'sea' | 'air'>('sea');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  const activeIdx = Math.max(0, STAGES.findIndex((s) => s.id === activeStageId));
  const activeStage = STAGES[activeIdx] || STAGES[0];
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const cycleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoveredRef = useRef<boolean>(false);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  const clearCycle = useCallback(() => {
    if (cycleTimerRef.current) {
      clearTimeout(cycleTimerRef.current);
      cycleTimerRef.current = null;
    }
  }, []);

  // Auto-cycle through all 5 stages sequentially with comfortable 3.5s pacing
  const startAutoCycle = useCallback(() => {
    clearCycle();
    setIsAutoPlaying(true);
    let currentIdx = 0;
    setActiveStageId(STAGES[0].id);

    const advanceStep = () => {
      if (isHoveredRef.current) {
        // Paused while user is reading — check again in 500ms
        cycleTimerRef.current = setTimeout(advanceStep, 500);
        return;
      }
      currentIdx++;
      if (currentIdx < STAGES.length) {
        setActiveStageId(STAGES[currentIdx].id);
        cycleTimerRef.current = setTimeout(advanceStep, 3500);
      } else {
        // Stop gracefully at destination
        setIsAutoPlaying(false);
        cycleTimerRef.current = null;
      }
    };

    cycleTimerRef.current = setTimeout(advanceStep, 3500);
  }, [clearCycle]);

  // Clean up timer on unmount
  useEffect(() => () => clearCycle(), [clearCycle]);

  const handleFreightModeChange = (mode: 'sea' | 'air') => {
    setFreightMode(mode);
    startAutoCycle();
  };

  // Position math for 5-node grid: centers are 10%, 30%, 50%, 70%, 90%
  const beaconPositionPercent = 10 + (activeIdx / 4) * 80;
  const progressLinePercent = (activeIdx / 4) * 100;

  return (
    <section
      id="sourcing-radar"
      className="section"
      style={{
        background: '#FFFFFF',
        color: 'var(--primary)',
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(60px, 8vw, 110px) 0',
      }}
    >
      {/* Background Subtle Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(141, 184, 51, 0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto clamp(36px, 6vw, 64px)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 16px',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(141, 184, 51, 0.14)',
                color: 'var(--accent-text, #5C7A1E)',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                border: '1px solid rgba(141, 184, 51, 0.35)',
              }}
            >
              <Radio size={14} className={isAutoPlaying ? 'animate-pulse' : ''} />
              {isAr ? 'رادار سلاسل الإمداد اللحظي' : 'Live Supply Chain Radar Telemetry'}
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3.4rem)',
              fontWeight: 900,
              color: 'var(--primary)',
              marginBottom: '16px',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {isAr
              ? 'المسار اللوجستي المباشر: من المصنع الصيني إلى مستودعك السعودي'
              : 'Direct Freight Corridor: China Factory Floor to Saudi Doorstep'}
          </h2>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
              lineHeight: 1.6,
              margin: '0 auto 28px',
            }}
          >
            {isAr
              ? 'تتبع المراحل الخمس لشحناتك مع التحقق الجمركي المسبق عبر منصة سابر والفوترة الموحدة بدون أي تعقيد ورقي.'
              : 'Track the end-to-end corridor with pre-cleared SABER conformity, integrated ZATCA customs clearance, and GPS freight telemetry.'}
          </p>

          {/* Freight Mode Toggle (Sea vs Air) */}
          <div
            style={{
              display: 'inline-flex',
              background: 'rgba(26, 61, 43, 0.06)',
              padding: '4px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(26, 61, 43, 0.12)',
            }}
          >
            <button
              type="button"
              onClick={() => handleFreightModeChange('sea')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 22px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: freightMode === 'sea' ? 'var(--accent, #8DB833)' : 'transparent',
                color: freightMode === 'sea' ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Ship size={16} />
              <span>{isAr ? 'شحن بحري حاويات (الأكثر توفيراً)' : 'Ocean Freight (Best TCO)'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleFreightModeChange('air')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 22px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: freightMode === 'air' ? 'var(--accent, #8DB833)' : 'transparent',
                color: freightMode === 'air' ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Plane size={16} />
              <span>{isAr ? 'شحن جوي سريع (٣–٥ أيام)' : 'Air Express (3–5 Days)'}</span>
            </button>
          </div>
        </div>

        {/* Visual Corridor Radar Timeline */}
        <div
          className="sourcing-radar-timeline-wrap"
          style={{
            marginBottom: '40px',
            position: 'relative',
            padding: '24px 0 12px',
          }}
        >
          {/* Connector Beam Track (spanning 10% to 90%) */}
          <div
            className="sourcing-radar-track-base"
            style={{
              position: 'absolute',
              top: '49px',
              left: '10%',
              right: '10%',
              height: '4px',
              background: 'rgba(26, 61, 43, 0.12)',
              borderRadius: '999px',
              zIndex: 1,
            }}
          >
            {/* Active Filled Beam with smooth width transition */}
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--accent, #8DB833) 0%, #38BDF8 50%, var(--accent, #8DB833) 100%)',
                borderRadius: '999px',
                boxShadow: '0 0 12px rgba(141, 184, 51, 0.65)',
                transformOrigin: isAr ? 'right' : 'left',
              }}
              animate={{
                width: `${progressLinePercent}%`,
              }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {/* Gliding Cargo Vehicle Beacon along the Track */}
          <motion.div
            className="sourcing-radar-beacon"
            style={{
              position: 'absolute',
              top: '49px',
              left: isAr ? 'auto' : `${beaconPositionPercent}%`,
              right: isAr ? `${beaconPositionPercent}%` : 'auto',
              transform: 'translate(-50%, -50%)',
              zIndex: 4,
              pointerEvents: 'none',
            }}
            animate={{
              left: isAr ? 'auto' : `${beaconPositionPercent}%`,
              right: isAr ? `${beaconPositionPercent}%` : 'auto',
            }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '999px',
                background: 'var(--primary, #1A3D2B)',
                border: '1.5px solid var(--accent, #8DB833)',
                boxShadow: '0 0 18px rgba(141, 184, 51, 0.75), 0 4px 12px rgba(0,0,0,0.25)',
                color: '#FFFFFF',
                fontSize: '0.68rem',
                fontWeight: 800,
                whiteSpace: 'nowrap',
              }}
            >
              {freightMode === 'sea' ? (
                <Ship size={13} color="var(--accent, #8DB833)" />
              ) : (
                <Plane size={13} color="#38BDF8" />
              )}
              <span style={{ letterSpacing: '0.04em', fontFamily: 'monospace' }}>
                {freightMode === 'sea' ? (isAr ? 'شحنة بحرية' : 'VESSEL') : (isAr ? 'شحن جوي' : 'AIR EXPRESS')}
              </span>
            </div>
          </motion.div>

          {/* 5 Stage Checkpoint Nodes */}
          <div
            className="sourcing-radar-nodes-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '12px',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {STAGES.map((stage, idx) => {
              const isActive = stage.id === activeStageId;
              const isCompleted = idx < activeIdx;

              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => {
                    clearCycle();
                    setIsAutoPlaying(false);
                    setActiveStageId(stage.id);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    outline: 'none',
                    position: 'relative',
                  }}
                >
                  {/* Node Circle */}
                  <div
                    className="sourcing-radar-node-circle"
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: isActive
                        ? 'var(--accent, #8DB833)'
                        : isCompleted
                        ? 'rgba(141, 184, 51, 0.15)'
                        : '#FFFFFF',
                      border: isActive
                        ? '2.5px solid #FFFFFF'
                        : isCompleted
                        ? '2px solid var(--accent, #8DB833)'
                        : '2px solid rgba(26, 61, 43, 0.2)',
                      color: isActive
                        ? '#FFFFFF'
                        : isCompleted
                        ? 'var(--accent-text, #5C7A1E)'
                        : 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontFamily: 'monospace',
                      fontSize: '0.95rem',
                      boxShadow: isActive
                        ? '0 0 24px rgba(141, 184, 51, 0.75), 0 4px 14px rgba(0,0,0,0.15)'
                        : '0 4px 12px rgba(0,0,0,0.06)',
                      marginBottom: '12px',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                    }}
                  >
                    {/* Concentric Radar Ping Rings around Active Node */}
                    {isActive && (
                      <>
                        <span
                          style={{
                            position: 'absolute',
                            inset: '-6px',
                            borderRadius: '50%',
                            border: '2px solid var(--accent, #8DB833)',
                            animation: 'radarPing 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                            pointerEvents: 'none',
                          }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            inset: '-12px',
                            borderRadius: '50%',
                            border: '1px solid rgba(141, 184, 51, 0.45)',
                            animation: 'radarPing 2s cubic-bezier(0, 0, 0.2, 1) 0.6s infinite',
                            pointerEvents: 'none',
                          }}
                        />
                      </>
                    )}

                    {isCompleted ? (
                      <CheckCircle2 size={24} color="var(--accent-text, #5C7A1E)" strokeWidth={2.5} />
                    ) : (
                      stage.step
                    )}
                  </div>

                  {/* Node Title */}
                  <span
                    className="sourcing-radar-node-title"
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 800 : isCompleted ? 700 : 600,
                      color: isActive
                        ? 'var(--primary)'
                        : isCompleted
                        ? 'var(--accent-text)'
                        : 'var(--text-secondary)',
                      textAlign: 'center',
                      lineHeight: 1.3,
                      maxWidth: '140px',
                    }}
                  >
                    {isAr ? stage.titleAr : stage.titleEn}
                  </span>

                  {/* Duration Tag */}
                  <span
                    className="sourcing-radar-node-duration"
                    style={{
                      marginTop: '6px',
                      fontSize: '0.72rem',
                      color: isActive
                        ? 'var(--accent-text)'
                        : isCompleted
                        ? 'var(--accent-text)'
                        : 'var(--text-tertiary)',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                    }}
                  >
                    {freightMode === 'sea'
                      ? isAr
                        ? stage.durationSeaAr
                        : stage.durationSeaEn
                      : isAr
                      ? stage.durationAirAr
                      : stage.durationAirEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Stage Telemetry Card — STABLE CONTAINER, ZERO BLINKING */}
        <div
          style={{ maxWidth: '1000px', margin: '0 auto' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <SpotlightCard
            className="glass"
            style={{
              background: 'linear-gradient(145deg, var(--primary, #1A3D2B) 0%, #153324 55%, var(--header-bg, #0F2A1C) 100%)',
              border: '1px solid rgba(141, 184, 51, 0.35)',
              padding: 'clamp(24px, 4vw, 44px)',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: '0 25px 65px rgba(10, 26, 17, 0.35), 0 0 0 1px rgba(141, 184, 51, 0.2)',
              position: 'relative',
              textAlign: isAr ? 'right' : 'left',
              overflow: 'hidden',
            }}
          >
            <BorderBeam size={340} duration={10} colorFrom="var(--accent)" colorTo="#38BDF8" />

            {/* Stage Telemetry Live Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'rgba(141, 184, 51, 0.2)',
                    color: 'var(--accent, #8DB833)',
                    border: '1px solid rgba(141, 184, 51, 0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {isAr ? activeStage.complianceBadgeAr : activeStage.complianceBadgeEn}
                </span>
                <span style={{ color: '#94A3B8', fontSize: '0.82rem', fontFamily: 'monospace' }}>
                  {isAr ? `المرحلة ٠${activeIdx + 1} من ٠٥` : `STAGE 0${activeIdx + 1} OF 05`}
                </span>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <MapPin size={16} color="var(--accent)" />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>
                  {isAr ? activeStage.hubAr : activeStage.hubEn}
                </span>
              </div>
            </div>

            {/* Smooth morphing Stage Content without blinking */}
            <div style={{ minHeight: '180px', position: 'relative' }}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={activeStage.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.32, ease: 'easeOut' }}
                >
                  <h3
                    style={{
                      fontSize: 'clamp(1.4rem, 2.5vw, 2.1rem)',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      marginBottom: '12px',
                    }}
                  >
                    {isAr ? activeStage.titleAr : activeStage.titleEn}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.98rem',
                      color: 'rgba(255, 255, 255, 0.86)',
                      lineHeight: 1.7,
                      marginBottom: '26px',
                    }}
                  >
                    {isAr ? activeStage.descAr : activeStage.descEn}
                  </p>

                  {/* Required Verified Documentation Grid */}
                  <div style={{ marginBottom: '26px' }}>
                    <h4
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        color: 'var(--accent)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <FileCheck2 size={17} />
                      <span>
                        {isAr
                          ? 'الوثائق المعتمدة والشهادات النظامية في هذه المرحلة'
                          : 'Stage Compliance Deliverables & Paperwork'}
                      </span>
                    </h4>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '10px',
                      }}
                    >
                      {activeStage.docs.map((doc, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: 'rgba(0, 0, 0, 0.28)',
                            padding: '11px 14px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(255, 255, 255, 0.09)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <ShieldCheck size={17} color="#10B981" className="shrink-0" />
                          <span style={{ fontSize: '0.84rem', color: '#E2E8F0', fontWeight: 600 }}>
                            {isAr ? doc.ar : doc.en}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Stage duration & CTA Footer (Permanently Stable) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={18} color="var(--accent)" />
                <span style={{ fontSize: '0.88rem', color: '#94A3B8' }}>
                  {isAr ? 'المدة الإجمالية النموذجية حتى الباب:' : 'End-to-end corridor duration:'}{' '}
                  <strong style={{ color: '#FFFFFF' }}>
                    {freightMode === 'sea'
                      ? (isAr ? '٢٠–٢٥ يوماً بحرياً' : '20–25 Days Ocean')
                      : (isAr ? '٤–٦ أيام جوياً' : '4–6 Days Air')}
                  </strong>
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (isAutoPlaying) {
                      clearCycle();
                      setIsAutoPlaying(false);
                    } else {
                      startAutoCycle();
                    }
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    color: '#FFFFFF',
                    borderRadius: 'var(--radius-pill)',
                    padding: '8px 16px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
                >
                  <Radio size={14} color="var(--accent)" className={isAutoPlaying ? 'animate-pulse' : ''} />
                  <span>
                    {isAutoPlaying
                      ? (isAr ? 'إيقاف مؤقت' : 'Pause Radar')
                      : (isAr ? 'تشغيل الرادار' : 'Auto Scan')}
                  </span>
                </button>

                <Link
                  href={`/${locale}/contact?service=sourcing&stage=${activeStage.id}`}
                  className="btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                  }}
                >
                  <span>{isAr ? 'اطلب تسعيرة توريد للمشروع' : 'Request Sourcing Corridor Quote'}</span>
                  <Arrow size={18} />
                </Link>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>

      <style jsx>{`
        @keyframes radarPing {
          0% {
            transform: scale(1);
            opacity: 0.85;
          }
          70% {
            transform: scale(1.6);
            opacity: 0;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
        @media (max-width: 768px) {
          .sourcing-radar-nodes-grid {
            gap: 6px !important;
          }
          .sourcing-radar-node-circle {
            width: 42px !important;
            height: 42px !important;
            font-size: 0.85rem !important;
          }
          .sourcing-radar-node-title {
            font-size: 0.74rem !important;
          }
          .sourcing-radar-track-base {
            top: 45px !important;
          }
          .sourcing-radar-beacon {
            top: 45px !important;
          }
        }
        @media (max-width: 480px) {
          .sourcing-radar-node-title {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            font-size: 0.68rem !important;
          }
          .sourcing-radar-node-duration {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
