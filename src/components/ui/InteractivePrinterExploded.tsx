'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Flame,
  Layers,
  Disc,
  RotateCw,
  Scan,
  Cog,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import BorderBeam from '@/components/ui/BorderBeam';

interface ComponentSpec {
  id: string;
  nameEn: string;
  nameAr: string;
  partNo: string;
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  accentColor: string;
  glowColor: string;
  coords: { x: number; y: number }; // percentage coordinates
  lifespanEn: string;
  lifespanAr: string;
  specsEn: string;
  specsAr: string;
  warrantyEn: string;
  warrantyAr: string;
  badgeEn: string;
  badgeAr: string;
}

const COMPONENTS: ComponentSpec[] = [
  {
    id: 'fuser',
    nameEn: 'Fuser Heating Assembly',
    nameAr: 'وحدة التثبيت الحراري (الفيوزر)',
    partNo: 'RM2-5679-000CN',
    icon: Flame,
    accentColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    coords: { x: 74, y: 48 },
    lifespanEn: '150,000–225,000 pages',
    lifespanAr: '١٥٠,٠٠٠ – ٢٢٥,٠٠٠ صفحة',
    specsEn: 'Instant-On Ceramic Element, DuPont Teflon Film Sleeve, Pressure Roller rated to 200°C',
    specsAr: 'عنصر سيراميك للتسخين الفوري، غلاف تفلون ديبونت، أسطوانة ضغط تتحمل حتى ٢٠٠ درجة مئوية',
    warrantyEn: '12-Month Factory Replacement Warranty',
    warrantyAr: 'ضمان استبدال مصنعي لمدة ١٢ شهراً',
    badgeEn: 'Critical Thermal Component',
    badgeAr: 'مكوّن حراري فائق الأهمية',
  },
  {
    id: 'formatter',
    nameEn: 'Formatter Logic Motherboard',
    nameAr: 'لوحة المعالجة والتحكم الرئيسية',
    partNo: 'RM2-8411 / C5F98A',
    icon: Cpu,
    accentColor: 'var(--accent)',
    glowColor: 'rgba(141, 184, 51, 0.5)',
    coords: { x: 49, y: 46 },
    lifespanEn: 'Permanent Fleet Lifespan (Surge Protected)',
    lifespanAr: 'عمر دائم للأسطول (محمية ضد تذبذب الجهد)',
    specsEn: 'Embedded RISC SoC, Gigabit LAN, Secure Cryptographic Storage & PostScript Engine',
    specsAr: 'معالج RISC مدمج، شبكة جيجابت، وحدة تشفير أمني متطورة ودعم كامل لـ PostScript',
    warrantyEn: 'Tested with Zero Bad Blocks',
    warrantyAr: 'مفحوصة بالكامل وخالية من أي قطاعات تالفة',
    badgeEn: 'System Brain & Security',
    badgeAr: 'معالج النظام والأمان المؤسسي',
  },
  {
    id: 'drum',
    nameEn: 'OPC Imaging Drum Kit',
    nameAr: 'أسطوانة التصوير الضوئية (الدرام)',
    partNo: 'CF287A-DRUM-CORE',
    icon: Disc,
    accentColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    coords: { x: 31, y: 68 },
    lifespanEn: '30,000–50,000 pages per cycle',
    lifespanAr: '٣٠,٠٠٠ – ٥٠,٠٠٠ صفحة لكل دورة',
    specsEn: 'High-sensitivity organic photoconductor with ultra-smooth 0.01mm mirror finish',
    specsAr: 'طبقة عضوية فائقة الحساسية للضوء بلمعان عاكس ودقة تسامح ٠.٠١ ملم',
    warrantyEn: 'Zero-Streak Crisp Print Guarantee',
    warrantyAr: 'ضمان طباعة نقية ١٠٠٪ بدون أي خطوط',
    badgeEn: 'Optical Print Resolution',
    badgeAr: 'دقة الوضوح والطباعة البصرية',
  },
  {
    id: 'itb',
    nameEn: 'Intermediate Transfer Belt (ITB)',
    nameAr: 'حزام نقل الصور الوسيط الملون',
    partNo: 'RM2-6454-000CN',
    icon: Layers,
    accentColor: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.45)',
    coords: { x: 56, y: 70 },
    lifespanEn: '120,000–150,000 color impressions',
    lifespanAr: '١٢٠,٠٠٠ – ١٥٠,٠٠٠ انطباع ملون',
    specsEn: 'Seamless polyimide belt with electrostatic registration and anti-curl matrix',
    specsAr: 'حزام بوليميدي سلس بدون درزات مع تسجيل كهروسكوني ونظام مقاوم للتقوس',
    warrantyEn: 'Factory Certified Alignment',
    warrantyAr: 'معايرة ومطابقة مصنعية معتمدة',
    badgeEn: 'Full Spectrum CMYK Transfer',
    badgeAr: 'نقل الألوان الأربعة المتكامل',
  },
  {
    id: 'rollers',
    nameEn: 'Paper Pickup & Feed Roller Assembly',
    nameAr: 'مجموعة بكرات سحب وتغذية الورق',
    partNo: 'RL1-2593 / RM1-0037',
    icon: RotateCw,
    accentColor: '#8B5CF6',
    glowColor: 'rgba(139, 92, 246, 0.45)',
    coords: { x: 39, y: 24 },
    lifespanEn: '80,000–100,000 feed cycles',
    lifespanAr: '٨٠,٠٠٠ – ١٠٠,٠٠٠ دورة سحب',
    specsEn: 'Dual-compound silicone elastomer with micro-grooved grip preventing paper jams',
    specsAr: 'سيليكون مزدوج التركيب مع تجاويف ميكروية مانعة تماماً لانحشار الورق',
    warrantyEn: 'Anti-Static & Jam-Free Assurance',
    warrantyAr: 'معالجة ضد الكهرباء الساكنة والانحشار',
    badgeEn: 'Paper Path Reliability',
    badgeAr: 'موثوقية مسار الورق المستمر',
  },
  {
    id: 'scanner',
    nameEn: 'CCD Flatbed Optical Scanner Glass',
    nameAr: 'وحدة المسح الضوئي والعدسات المسطحة',
    partNo: 'M428-SCAN-CCD',
    icon: Scan,
    accentColor: '#06B6D4',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    coords: { x: 23, y: 44 },
    lifespanEn: '100,000+ double-sided scans',
    lifespanAr: 'أكثر من ١٠٠,٠٠٠ مسح مزدوج الوجه',
    specsEn: '1200x1200 DPI true optical resolution, single-pass dual-head sensor architecture',
    specsAr: 'دقة حقيقية ١٢٠٠×١٢٠٠ نقطة بالبوصة، مستشعر مزدوج للمسح على الوجهين بتمريرة واحدة',
    warrantyEn: 'Scratch-Resistant Tempered Glass',
    warrantyAr: 'زجاج مقسّى مقاوم للخدوش والصدمات',
    badgeEn: 'Ultra-HD Document Capture',
    badgeAr: 'التقاط عالي الدقة للوثائق',
  },
  {
    id: 'gears',
    nameEn: 'Helical Drive Gear Train & Motor',
    nameAr: 'مجموعة التروس الحلزونية ومحرك الدفع',
    partNo: 'RU7-0294-KIT',
    icon: Cog,
    accentColor: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.45)',
    coords: { x: 78, y: 75 },
    lifespanEn: '250,000+ continuous drive revolutions',
    lifespanAr: '٢٥٠,٠٠٠+ دورة حركة مستمرة',
    specsEn: 'High-tensile POM polymer with self-lubricating micro-teeth and near-zero backlash',
    specsAr: 'بوليمر POM عالي المتانة بأسنان ذاتية التزييت وخلوص ميكانيكي يقارب الصفر',
    warrantyEn: 'Acoustic Noise Tested (<48 dB)',
    warrantyAr: 'مفحوص صوتياً لأعلى هدوء تشغيلي (<٤٨ ديسيبل)',
    badgeEn: 'Mechanical Transmission',
    badgeAr: 'ناقل الحركة الميكانيكي الدقيق',
  },
];

export default function InteractivePrinterExploded({
  isAr = false,
  locale = 'en',
}: {
  isAr?: boolean;
  locale?: string;
}) {
  const [selectedId, setSelectedId] = useState<string>('fuser');
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const activeComponent = COMPONENTS.find((c) => c.id === selectedId) || COMPONENTS[0];
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -(y * 8), y: x * 8 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1240px',
        margin: '0 auto',
        padding: 'clamp(20px, 4vw, 40px)',
        borderRadius: 'var(--radius-2xl)',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 29, 0.98) 100%)',
        border: '1px solid rgba(141, 184, 51, 0.25)',
        boxShadow: '0 25px 80px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(141, 184, 51, 0.1)',
        overflow: 'hidden',
      }}
    >
      <BorderBeam size={400} duration={12} colorFrom="var(--accent)" colorTo="var(--deep-forest)" />

      {/* Header bar with Mode Badge & Telemetry */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ textAlign: isAr ? 'right' : 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(141, 184, 51, 0.15)',
                color: 'var(--accent)',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                border: '1px solid rgba(141, 184, 51, 0.3)',
              }}
            >
              <Sparkles size={13} />
              {isAr ? 'فحص تشريحي تفاعلي ثلاثي الأبعاد' : 'Interactive Exploded Engineering CAD'}
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981',
                fontSize: '0.72rem',
                fontWeight: 700,
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              {isAr ? 'حالة المخزون: متاح للتسليم الفوري' : 'Live Fleet Stock: Ready'}
            </span>
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3.2vw, 2.3rem)',
              fontWeight: 900,
              color: '#FFFFFF',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            {isAr ? 'الهندسة الداخلية لطابعات HP المجددة' : 'Precision Anatomy of Certified Enterprise Hardware'}
          </h2>
        </div>

        {/* Quick Component Filter Pills */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            maxWidth: '100%',
            padding: '4px',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {COMPONENTS.map((comp) => {
            const isSelected = comp.id === selectedId;
            return (
              <button
                key={comp.id}
                onClick={() => setSelectedId(comp.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  background: isSelected ? 'var(--accent)' : 'transparent',
                  color: isSelected ? '#0F172A' : '#94A3B8',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 2px 10px rgba(141,184,51,0.35)' : 'none',
                }}
              >
                {isAr ? comp.nameAr.split(' ')[0] : comp.nameEn.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dual-Plane Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '24px',
          alignItems: 'center',
        }}
        className="lg:grid-cols-12"
      >
        {/* Interactive Visual Stage (7 Columns on desktop) */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            background: 'radial-gradient(circle at 50% 50%, rgba(26,61,43,0.3) 0%, rgba(10,15,29,0.9) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
            boxShadow: 'inset 0 0 60px rgba(0,0,0,0.6)',
          }}
          className="lg:col-span-7"
        >
          {/* Hardware Exploded Graphic */}
          <Image
            src="/printer-parts-hero.jpeg"
            alt={isAr ? 'مخطط القطع المنفصلة' : 'Exploded Printer Anatomy'}
            fill
            sizes="(max-width: 1024px) 100vw, 700px"
            style={{
              objectFit: 'cover',
              filter: 'brightness(0.95) contrast(1.05)',
            }}
            priority
          />

          {/* Interactive Radar Hotspots */}
          {COMPONENTS.map((comp) => {
            const isSelected = comp.id === selectedId;
            const Icon = comp.icon;

            return (
              <div
                key={comp.id}
                onClick={() => setSelectedId(comp.id)}
                style={{
                  position: 'absolute',
                  left: `${comp.coords.x}%`,
                  top: `${comp.coords.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isSelected ? 20 : 10,
                  cursor: 'pointer',
                }}
              >
                {/* Expanding sonar ripple */}
                <div
                  style={{
                    position: 'absolute',
                    inset: '-8px',
                    borderRadius: '50%',
                    border: `1.5px solid ${comp.accentColor}`,
                    opacity: isSelected ? 1 : 0.4,
                    animation: isSelected ? 'sonarPulse 2s cubic-bezier(0, 0.2, 0.8, 1) infinite' : 'none',
                    pointerEvents: 'none',
                  }}
                />

                {/* Hotspot Target Button */}
                <button
                  type="button"
                  aria-label={comp.nameEn}
                  style={{
                    width: isSelected ? '44px' : '36px',
                    height: isSelected ? '44px' : '36px',
                    borderRadius: '50%',
                    background: isSelected ? comp.accentColor : 'rgba(15, 23, 42, 0.85)',
                    border: `2px solid ${comp.accentColor}`,
                    color: isSelected ? '#0F172A' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 20px ${comp.glowColor}`,
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={isSelected ? 20 : 16} />
                </button>

                {/* Floating Micro-Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '110%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: `1px solid ${isSelected ? comp.accentColor : 'rgba(255,255,255,0.1)'}`,
                    color: isSelected ? '#FFFFFF' : '#94A3B8',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    pointerEvents: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  }}
                >
                  {isAr ? comp.nameAr.split(' ')[0] : comp.nameEn.split(' ')[0]}
                </div>
              </div>
            );
          })}

          {/* Subtly animated Laser Grid Line pointing to active part */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '16px',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.72rem',
              fontFamily: 'monospace',
              background: 'rgba(0,0,0,0.6)',
              padding: '4px 10px',
              borderRadius: '6px',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ color: activeComponent.accentColor }}>● TARGET LOCKED:</span>
            <span>{activeComponent.partNo}</span>
          </div>
        </div>

        {/* Dynamic Telemetry & Inspection Card (5 Columns on desktop) */}
        <div className="lg:col-span-5" style={{ height: '100%' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeComponent.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: `1px solid rgba(255, 255, 255, 0.12)`,
                borderRadius: 'var(--radius-xl)',
                padding: 'clamp(20px, 3vw, 28px)',
                backdropFilter: 'blur(16px)',
                position: 'relative',
                textAlign: isAr ? 'right' : 'left',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Top Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '14px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-pill)',
                      background: `${activeComponent.glowColor}`,
                      color: '#FFFFFF',
                      border: `1px solid ${activeComponent.accentColor}`,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {isAr ? activeComponent.badgeAr : activeComponent.badgeEn}
                  </span>

                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.78rem',
                      color: activeComponent.accentColor,
                      fontWeight: 700,
                    }}
                  >
                    {activeComponent.partNo}
                  </span>
                </div>

                {/* Name */}
                <h3
                  style={{
                    fontSize: 'clamp(1.2rem, 2.2vw, 1.5rem)',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    marginBottom: '12px',
                    lineHeight: 1.25,
                  }}
                >
                  {isAr ? activeComponent.nameAr : activeComponent.nameEn}
                </h3>

                {/* Technical Specifications */}
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.75)',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    marginBottom: '20px',
                  }}
                >
                  {isAr ? activeComponent.specsAr : activeComponent.specsEn}
                </p>

                {/* Engineering Metrics Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
                      {isAr ? 'العمر التشغيلي المعتمد' : 'Tested Duty Cycle'}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF' }}>
                      {isAr ? activeComponent.lifespanAr : activeComponent.lifespanEn}
                    </span>
                  </div>

                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
                      {isAr ? 'معيار الجودة والضمان' : 'Quality Assurance'}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10B981' }}>
                      {isAr ? activeComponent.warrantyAr : activeComponent.warrantyEn}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Action */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <Link
                  href={`/${locale}/contact?inquiry=part&part=${encodeURIComponent(activeComponent.nameEn)}`}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    height: '44px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                  }}
                >
                  <span>{isAr ? 'اطلب تسعير هذه القطعة' : 'Request Part Allocation'}</span>
                  <Arrow size={16} />
                </Link>

                <Link
                  href={`/${locale}/printer-parts`}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    transition: 'all 0.2s ease',
                  }}
                  title={isAr ? 'عرض الكتالوج الكامل' : 'Browse Full Catalog'}
                >
                  <ExternalLink size={18} />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        @keyframes sonarPulse {
          0% {
            transform: scale(0.9);
            opacity: 1;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
