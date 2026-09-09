'use client';

import React, { useState } from 'react';
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
  const [activeStageId, setActiveStageId] = useState<string>('saudi-customs');
  const [freightMode, setFreightMode] = useState<'sea' | 'air'>('sea');
  const activeStage = STAGES.find((s) => s.id === activeStageId) || STAGES[3];
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <section
      id="sourcing-radar"
      className="section"
      style={{
        background: 'linear-gradient(180deg, #0A0F1D 0%, #0F172A 100%)',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(60px, 8vw, 110px) 0',
      }}
    >
      {/* Background Radar Grid & Circuit Beams */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(141, 184, 51, 0.08) 1px, transparent 1px), radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px, 20px 20px',
          backgroundPosition: '0 0, 10px 10px',
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
                gap: '6px',
                padding: '4px 14px',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(141, 184, 51, 0.15)',
                color: 'var(--accent)',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                border: '1px solid rgba(141, 184, 51, 0.3)',
              }}
            >
              <Radio size={14} className="animate-pulse" />
              {isAr ? 'رادار سلاسل الإمداد اللحظي' : 'Live Supply Chain Radar Telemetry'}
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3.4rem)',
              fontWeight: 900,
              color: '#FFFFFF',
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
              color: '#94A3B8',
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
              background: 'rgba(255, 255, 255, 0.06)',
              padding: '4px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <button
              onClick={() => setFreightMode('sea')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 22px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: freightMode === 'sea' ? 'var(--accent)' : 'transparent',
                color: freightMode === 'sea' ? '#0F172A' : '#94A3B8',
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
              onClick={() => setFreightMode('air')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 22px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: freightMode === 'air' ? 'var(--accent)' : 'transparent',
                color: freightMode === 'air' ? '#0F172A' : '#94A3B8',
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

        {/* Visual Corridor Radar Timeline (Desktop & Tablet) */}
        <div
          style={{
            marginBottom: '40px',
            position: 'relative',
            padding: '24px 0',
          }}
        >
          {/* Connector Beam between stages */}
          <div
            style={{
              position: 'absolute',
              top: '48px',
              left: '5%',
              right: '5%',
              height: '3px',
              background: 'rgba(255, 255, 255, 0.1)',
              zIndex: 1,
            }}
          >
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--accent), #38BDF8, var(--accent))',
                borderRadius: '2px',
              }}
              animate={{
                width:
                  activeStage.id === 'factory'
                    ? '10%'
                    : activeStage.id === 'port-origin'
                    ? '32%'
                    : activeStage.id === 'maritime-transit'
                    ? '55%'
                    : activeStage.id === 'saudi-customs'
                    ? '75%'
                    : '100%',
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* 5 Stage Checkpoint Nodes */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '12px',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {STAGES.map((stage) => {
              const isActive = stage.id === activeStageId;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStageId(stage.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    outline: 'none',
                  }}
                >
                  {/* Node Circle */}
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: isActive ? 'var(--accent)' : 'rgba(15, 23, 42, 0.9)',
                      border: `2px solid ${isActive ? 'var(--accent)' : 'rgba(255, 255, 255, 0.2)'}`,
                      color: isActive ? '#0F172A' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontFamily: 'monospace',
                      fontSize: '1rem',
                      boxShadow: isActive ? '0 0 24px rgba(141, 184, 51, 0.6)' : '0 4px 12px rgba(0,0,0,0.5)',
                      marginBottom: '12px',
                      transition: 'all 0.25s ease',
                      position: 'relative',
                    }}
                  >
                    {isActive ? <CheckCircle2 size={24} /> : stage.step}
                  </div>

                  {/* Node Title */}
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 800 : 600,
                      color: isActive ? '#FFFFFF' : '#94A3B8',
                      textAlign: 'center',
                      lineHeight: 1.3,
                      maxWidth: '140px',
                    }}
                  >
                    {isAr ? stage.titleAr : stage.titleEn}
                  </span>

                  {/* Duration Tag */}
                  <span
                    style={{
                      marginTop: '6px',
                      fontSize: '0.72rem',
                      color: isActive ? 'var(--accent)' : '#64748B',
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

        {/* Detailed Stage Telemetry Card */}
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage.id + freightMode}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              <SpotlightCard
                className="glass"
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(141, 184, 51, 0.3)',
                  padding: 'clamp(24px, 4vw, 44px)',
                  borderRadius: 'var(--radius-2xl)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                  position: 'relative',
                  textAlign: isAr ? 'right' : 'left',
                }}
              >
                <BorderBeam size={340} duration={10} colorFrom="var(--accent)" colorTo="#38BDF8" />

                {/* Card Top Row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '20px',
                    paddingBottom: '18px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '3px 12px',
                          borderRadius: 'var(--radius-pill)',
                          background: 'rgba(141, 184, 51, 0.2)',
                          color: 'var(--accent)',
                          border: '1px solid rgba(141, 184, 51, 0.4)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {isAr ? activeStage.complianceBadgeAr : activeStage.complianceBadgeEn}
                      </span>
                      <span style={{ color: '#94A3B8', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                        {isAr ? `المرحلة ${activeStage.step}` : `CORRIDOR STAGE ${activeStage.step}`}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                      {isAr ? activeStage.titleAr : activeStage.titleEn}
                    </h3>
                  </div>

                  {/* Hub / Location badge */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '10px 18px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <MapPin size={18} color="var(--accent)" />
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block' }}>
                        {isAr ? 'نطاق التشغيل والموانئ' : 'Operating Hub & Terminal'}
                      </span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF' }}>
                        {isAr ? activeStage.hubAr : activeStage.hubEn}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stage Narrative Description */}
                <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.7, marginBottom: '28px' }}>
                  {isAr ? activeStage.descAr : activeStage.descEn}
                </p>

                {/* Required Verified Documentation Grid */}
                <div style={{ marginBottom: '28px' }}>
                  <h4
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <FileCheck2 size={18} />
                    <span>{isAr ? 'الوثائق المعتمدة والشهادات النظامية في هذه المرحلة' : 'Stage Compliance Deliverables & Paperwork'}</span>
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                    {activeStage.docs.map((doc, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(0, 0, 0, 0.4)',
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <ShieldCheck size={18} color="#10B981" className="shrink-0" />
                        <span style={{ fontSize: '0.86rem', color: '#E2E8F0', fontWeight: 600 }}>
                          {isAr ? doc.ar : doc.en}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Banner */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    paddingTop: '20px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Clock size={18} color="var(--accent)" />
                    <span style={{ fontSize: '0.9rem', color: '#94A3B8' }}>
                      {isAr ? 'المدة الإجمالية النموذجية حتى الباب:' : 'End-to-end corridor duration:'}{' '}
                      <strong style={{ color: '#FFFFFF' }}>
                        {freightMode === 'sea' ? (isAr ? '٢٠–٢٥ يوماً بحرياً' : '20–25 Days Ocean') : (isAr ? '٤–٦ أيام جوياً' : '4–6 Days Air')}
                      </strong>
                    </span>
                  </div>

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
              </SpotlightCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
