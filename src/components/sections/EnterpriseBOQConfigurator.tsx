'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  Printer,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  Leaf,
  FileSpreadsheet,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Info,
  Sliders,
  Building,
} from 'lucide-react';
import BorderBeam from '@/components/ui/BorderBeam';
import SpotlightCard from '@/components/ui/SpotlightCard';
import MagneticButton from '@/components/ui/MagneticButton';

interface EnterpriseBOQConfiguratorProps {
  isAr?: boolean;
  locale?: string;
}

export default function EnterpriseBOQConfigurator({
  isAr = false,
  locale = 'en',
}: EnterpriseBOQConfiguratorProps) {
  const [workstations, setWorkstations] = useState<number>(45);
  const [monthlyPages, setMonthlyPages] = useState<number>(18000);
  const [colorRatio, setColorRatio] = useState<number>(25); // percentage color
  const [slaTier, setSlaTier] = useState<'standard' | 'priority'>('priority');

  const Arrow = isAr ? ArrowLeft : ArrowRight;

  // Engineering Fleet Calculation Logic
  const calculation = useMemo(() => {
    // 1 printer per ~20-25 workstations for heavy enterprise use
    const totalPrintersNeeded = Math.max(1, Math.ceil(workstations / 22));
    const colorPrinters = Math.max(1, Math.round(totalPrintersNeeded * (colorRatio / 100)));
    const monoPrinters = Math.max(1, totalPrintersNeeded - colorPrinters);

    const monoPages = Math.round(monthlyPages * (1 - colorRatio / 100));
    const colorPages = Math.round(monthlyPages * (colorRatio / 100));

    // OEM Brand New Cost Benchmark
    // Average OEM Mono cost ~0.14 SAR/page, Color ~0.42 SAR/page + Hardware CapEx amortized
    const oemCostPerMonth = Math.round(monoPages * 0.14 + colorPages * 0.42 + totalPrintersNeeded * 380);

    // FNG Eco Subscription Model:
    // Zero Hardware CapEx (Printers provided free with toner commitment)
    // Eco Toner Mono ~0.055 SAR/page, Color ~0.16 SAR/page
    const slaAddon = slaTier === 'priority' ? totalPrintersNeeded * 75 : 0;
    const fngCostPerMonth = Math.round(monoPages * 0.055 + colorPages * 0.16 + slaAddon);

    const monthlySavings = Math.max(0, oemCostPerMonth - fngCostPerMonth);
    const annualSavings = monthlySavings * 12;
    const savingsPercent = Math.round((monthlySavings / Math.max(1, oemCostPerMonth)) * 100);

    // Sustainability Impact
    // Each cartridge saves approx 2.8kg CO2 and 1.3kg plastic
    const cartridgesPerYear = Math.ceil(monthlyPages / 5500) * 12;
    const co2SavedKg = Math.round(cartridgesPerYear * 2.8);
    const plasticSavedKg = Math.round(cartridgesPerYear * 1.3);

    return {
      totalPrinters: monoPrinters + colorPrinters,
      monoPrinters,
      colorPrinters,
      oemCostPerMonth,
      fngCostPerMonth,
      monthlySavings,
      annualSavings,
      savingsPercent,
      co2SavedKg,
      plasticSavedKg,
      cartridgesSaved: cartridgesPerYear,
    };
  }, [workstations, monthlyPages, colorRatio, slaTier]);

  // Pre-generate WhatsApp RFQ message
  const whatsappUrl = useMemo(() => {
    const textEn = `*Enterprise Fleet BOQ Request (FNG)*
- Workstations: ${workstations}
- Monthly Pages: ${monthlyPages.toLocaleString('en-US')} (${colorRatio}% Color)
- Recommended Fleet: ${calculation.monoPrinters}x Heavy-Duty Mono + ${calculation.colorPrinters}x Enterprise Color MFP
- SLA Tier: ${slaTier === 'priority' ? 'Priority 4-Hour Response' : 'Standard 48-Hour'}
- Projected Monthly Savings: SAR ${calculation.monthlySavings.toLocaleString('en-US')} (~${calculation.savingsPercent}%)
Please prepare official quotation.`;

    const textAr = `*طلب تسعيرة أسطول طابعات مؤسسي (FNG)*
- عدد محطات العمل: ${workstations}
- حجم الطباعة الشهري: ${monthlyPages.toLocaleString('en-US')} صفحة (${colorRatio}٪ ألوان)
- الأسطول الموصى به: ${calculation.monoPrinters} طابعات أحادية ليزرية + ${calculation.colorPrinters} طابعات متعددة المهام ألوان
- مستوى الدعم الفني: ${slaTier === 'priority' ? 'أولوية قصوى (استجابة خلال ٤ ساعات)' : 'قياسي (خلال ٤٨ ساعة)'}
- الوفر الشهري التقديري: ${calculation.monthlySavings.toLocaleString('en-US')} ريال سعودي (~${calculation.savingsPercent}٪)
يرجى إرسال عرض الأسعار الرسمي.`;

    const msg = isAr ? textAr : textEn;
    return `https://wa.me/966548105000?text=${encodeURIComponent(msg)}`;
  }, [workstations, monthlyPages, colorRatio, slaTier, calculation, isAr]);

  return (
    <section
      id="boq-configurator"
      className="section"
      style={{
        background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 50%, #F1F5F9 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(60px, 7vw, 100px) 0',
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto clamp(32px, 5vw, 56px)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span
              style={{
                fontSize: '0.76rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--accent-text)',
                padding: '4px 12px',
                borderRadius: '999px',
                background: 'rgba(141, 184, 51, 0.12)',
                border: '1px solid rgba(141, 184, 51, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Calculator size={13} />
              {isAr ? 'محاكي الأسطول المؤسسي الذكي' : 'Enterprise BOQ Fleet Simulator'}
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 900,
              color: 'var(--primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              marginBottom: '14px',
            }}
          >
            {isAr
              ? 'صمّم أسطول طابعاتك واحسب الوفر الاقتصادي المباشر'
              : 'Configure Your Enterprise Fleet & Calculate Instant ROI'}
          </h2>

          <p style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            {isAr
              ? 'حدد حجم مؤسستك وسيقوم المحاكي بهندسة الأسطول المثالي، حساب خفض التكاليف التشغيلية، ومعدلات الأثر البيئي.'
              : 'Tailor your department volume to calculate instant CapEx elimination, toner subscription savings, and environmental diversion.'}
          </p>
        </div>

        {/* Interactive Dual-Panel Card */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
            gap: '32px',
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: 'clamp(24px, 4vw, 44px)',
            border: '1px solid rgba(17, 24, 39, 0.08)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.06)',
            position: 'relative',
          }}
          className="boq-grid-panel"
        >
          <BorderBeam size={280} duration={9} colorFrom="var(--accent)" colorTo="var(--primary)" />

          {/* Left Panel: Configuration Sliders & Controls */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <Sliders size={20} color="var(--accent-text)" />
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                {isAr ? 'مدخلات المنشأة وحجم العمل' : 'Workforce & Print Parameters'}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Slider 1: Workstations */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building size={16} color="var(--accent-text)" />
                    {isAr ? 'عدد الموظفين / محطات العمل:' : 'Active Workstations / Staff:'}
                  </label>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-text)', fontFamily: 'var(--font-mono)' }}>
                    {workstations} {isAr ? 'موظف' : 'users'}
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={300}
                  step={5}
                  value={workstations}
                  onChange={(e) => setWorkstations(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    accentColor: 'var(--accent-text)',
                    cursor: 'pointer',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>
                  <span>10</span>
                  <span>150</span>
                  <span>300+</span>
                </div>
              </div>

              {/* Slider 2: Monthly Pages */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Printer size={16} color="var(--accent-text)" />
                    {isAr ? 'حجم الطباعة الشهري التقديري:' : 'Estimated Monthly Output:'}
                  </label>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-text)', fontFamily: 'var(--font-mono)' }}>
                    {monthlyPages.toLocaleString('en-US')} {isAr ? 'صفحة' : 'pages'}
                  </span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={80000}
                  step={1000}
                  value={monthlyPages}
                  onChange={(e) => setMonthlyPages(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    accentColor: 'var(--accent-text)',
                    cursor: 'pointer',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>
                  <span>2,000</span>
                  <span>40,000</span>
                  <span>80,000+</span>
                </div>
              </div>

              {/* Slider 3: Color Ratio */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {isAr ? 'نسبة الطباعة الملونة إلى الأبيض والأسود:' : 'Color vs Mono Print Ratio:'}
                  </label>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#3B82F6', fontFamily: 'var(--font-mono)' }}>
                    {colorRatio}% {isAr ? 'ألوان' : 'Color'} / {100 - colorRatio}% {isAr ? 'أبيض وأسود' : 'Mono'}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={70}
                  step={5}
                  value={colorRatio}
                  onChange={(e) => setColorRatio(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    accentColor: '#3B82F6',
                    cursor: 'pointer',
                  }}
                />
              </div>

              {/* SLA Tier Selection */}
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: '10px' }}>
                  {isAr ? 'مستوى اتفاقية الصيانة وضمان التشغيل (SLA):' : 'Maintenance & SLA Support Tier:'}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setSlaTier('priority')}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: slaTier === 'priority' ? '2px solid var(--accent-text)' : '1px solid #E2E8F0',
                      background: slaTier === 'priority' ? 'rgba(141, 184, 51, 0.08)' : '#FFFFFF',
                      textAlign: isAr ? 'right' : 'left',
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.88rem', color: 'var(--primary)', marginBottom: '4px' }}>
                      <ShieldCheck size={16} color="var(--accent-text)" />
                      <span>{isAr ? 'أولوية قصوى (٤ ساعات)' : 'Priority SLA (4-Hour)'}</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                      {isAr ? 'استبدال فوري وقطع غيار ومسؤول صيانة مخصص' : 'Same-day emergency dispatch & hot-swap backup'}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSlaTier('standard')}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: slaTier === 'standard' ? '2px solid var(--accent-text)' : '1px solid #E2E8F0',
                      background: slaTier === 'standard' ? 'rgba(141, 184, 51, 0.08)' : '#FFFFFF',
                      textAlign: isAr ? 'right' : 'left',
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.88rem', color: 'var(--primary)', marginBottom: '4px' }}>
                      <CheckCircle2 size={16} color="#64748B" />
                      <span>{isAr ? 'قياسي (٤٨ ساعة)' : 'Standard (48-Hour)'}</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                      {isAr ? 'صيانة دورية وتوصيل أحبار حسب جدول مجدول' : 'Scheduled maintenance & 48-hr replacement'}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Instant Telemetry & BOQ Output */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0D162B 0%, #080D1A 100%)',
              borderRadius: '20px',
              padding: 'clamp(20px, 3vw, 32px)',
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)',
              position: 'relative',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div>
              {/* Header Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: 'rgba(141, 184, 51, 0.18)',
                    color: 'var(--accent)',
                    border: '1px solid rgba(141, 184, 51, 0.3)',
                  }}
                >
                  {isAr ? 'المقايسة الفنية الموصى بها (BOQ)' : 'Engineered Fleet Spec'}
                </span>
                <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                  {calculation.totalPrinters} {isAr ? 'أجهزة موصى بها' : 'Recommended Units'}
                </span>
              </div>

              {/* Recommended Fleet Units */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '14px',
                  marginBottom: '18px',
                }}
              >
                <div style={{ fontSize: '0.76rem', color: '#94A3B8', fontWeight: 700, marginBottom: '8px' }}>
                  {isAr ? 'تكوين الأسطول الموزع:' : 'Fleet Hardware Allocation:'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Printer size={16} color="var(--accent)" />
                      <span style={{ fontSize: '0.86rem', fontWeight: 700 }}>
                        {isAr ? 'طابعات ليزر أحادية M507 عالية الانتاجية' : 'HP LaserJet M507 Mono Workhorses'}
                      </span>
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                      {calculation.monoPrinters}x
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Printer size={16} color="#38BDF8" />
                      <span style={{ fontSize: '0.86rem', fontWeight: 700 }}>
                        {isAr ? 'طابعات ألوان متعددة المهام M578 MFP' : 'HP LaserJet Enterprise M578 Color MFP'}
                      </span>
                    </div>
                    <span style={{ fontWeight: 800, color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>
                      {calculation.colorPrinters}x
                    </span>
                  </div>
                </div>
              </div>

              {/* Projected Monthly Savings Highlight */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(141, 184, 51, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
                  border: '1px solid rgba(141, 184, 51, 0.3)',
                  borderRadius: '16px',
                  padding: '16px',
                  marginBottom: '18px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#CBD5E1', fontWeight: 600 }}>
                    {isAr ? 'الوفر التشغيلي الشهري التقديري:' : 'Estimated Monthly Cost Savings:'}
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: 'var(--accent)',
                      color: 'var(--deep-forest)',
                    }}
                  >
                    ~{calculation.savingsPercent}% {isAr ? 'توفير' : 'Saved'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: 'clamp(1.7rem, 2.5vw, 2.3rem)',
                      fontWeight: 900,
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {calculation.monthlySavings.toLocaleString('en-US')}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 700 }}>
                    {isAr ? 'ريال / شهرياً' : 'SAR / month'}
                  </span>
                </div>

                <div style={{ fontSize: '0.76rem', color: '#94A3B8', marginTop: '4px' }}>
                  {isAr ? 'يعادل وفراً سنوياً يبلغ تقريباً:' : 'Equivalent annual savings of approx:'}{' '}
                  <strong style={{ color: '#FFFFFF' }}>{calculation.annualSavings.toLocaleString('en-US')} SAR / yr</strong>
                </div>
              </div>

              {/* Ecological Impact Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '22px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#34D399', marginBottom: '2px' }}>
                    <Leaf size={14} />
                    <span>{isAr ? 'خفض انبعاثات الكربون' : 'CO₂ Avoided'}</span>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                    {calculation.co2SavedKg.toLocaleString('en-US')} kg / yr
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#38BDF8', marginBottom: '2px' }}>
                    <TrendingDown size={14} />
                    <span>{isAr ? 'بلاستيك تم إنقاذه' : 'Plastic Diverted'}</span>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                    {calculation.plasticSavedKg.toLocaleString('en-US')} kg / yr
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <MagneticButton magneticPull={8}>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '13px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    borderRadius: '12px',
                  }}
                >
                  <MessageCircle size={18} />
                  <span>{isAr ? 'إرسال المقايسة الفنية عبر واتساب' : 'Dispatch BOQ RFQ to WhatsApp'}</span>
                  <Arrow size={16} />
                </a>
              </MagneticButton>

              <a
                href={`/${locale}/contact?service=printers&workstations=${workstations}&volume=${monthlyPages}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#CBD5E1',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#CBD5E1';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                }}
              >
                <FileSpreadsheet size={15} />
                <span>{isAr ? 'طلب عرض تسعيرة رسمي مفصل (PDF)' : 'Request Formal PDF Proposal'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          .boq-grid-panel {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
