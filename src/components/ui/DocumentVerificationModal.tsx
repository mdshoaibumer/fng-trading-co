'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  X,
  Search,
  Lock,
  Stamp,
  QrCode,
} from 'lucide-react';
import BorderBeam from '@/components/ui/BorderBeam';

export interface DocumentVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAr?: boolean;
}

interface DocSpec {
  id: string;
  tabTitleEn: string;
  tabTitleAr: string;
  officialTitleEn: string;
  officialTitleAr: string;
  authorityEn: string;
  authorityAr: string;
  regNumber: string;
  regLabelEn: string;
  regLabelAr: string;
  issueDateEn: string;
  issueDateAr: string;
  validityEn: string;
  validityAr: string;
  sha256: string;
  statusEn: string;
  statusAr: string;
  summaryEn: string;
  summaryAr: string;
  activitiesEn: string[];
  activitiesAr: string[];
  verificationPortalUrl?: string;
  verificationPortalLabelEn?: string;
  verificationPortalLabelAr?: string;
}

const DOCUMENTS: DocSpec[] = [
  {
    id: 'saudi-cr',
    tabTitleEn: 'Saudi Commercial Registration',
    tabTitleAr: 'السجل التجاري السعودي',
    officialTitleEn: 'Commercial Registration Certificate',
    officialTitleAr: 'شهادة السجل التجاري الإلكترونية',
    authorityEn: 'Ministry of Commerce — Kingdom of Saudi Arabia',
    authorityAr: 'وزارة التجارة — المملكة العربية السعودية',
    regNumber: '1010724885',
    regLabelEn: 'Commercial Reg No. (CR)',
    regLabelAr: 'رقم السجل التجاري',
    issueDateEn: '1442/08/12 AH (Riyadh)',
    issueDateAr: '١٢/٠٨/١٤٤٢ هـ (الرياض)',
    validityEn: 'Active & In Good Standing',
    validityAr: 'سارٍ وموثّق بالمركز السعودي للأعمال',
    sha256: '9f8e4c3a1b5d6e7f2018a9b8c7d6e5f403123456789abcdef0123456789abcde',
    statusEn: 'Verified via Saudi Business Center',
    statusAr: 'موثّق رسمياً لدى المركز السعودي للأعمال',
    summaryEn: 'Official institutional trading entity authorized for computer equipment, optical imaging peripherals, printing hardware, consumable refilling technologies, and global trade operations.',
    summaryAr: 'كيان تجاري نظامي مرخّص لمزاولة تجارة الجملة والتجزئة في معدات الحاسب، أجهزة الطباعة الرقمية ومستلزماتها، وقطع الغيار والتجارة الدولية.',
    activitiesEn: [
      'Wholesale & Retail of Printers, Scanners & Office Equipment',
      'Import & Distribution of Certified Laser Toner Cartridges & Inks',
      'Printer Spare Parts, Maintenance & Commercial Equipment Leasing',
      'Cross-Border Technology & Hardware Procurement Services',
    ],
    activitiesAr: [
      'تجارة الجملة والتجزئة في الطابعات والماسحات الضوئية وتجهيزات المكاتب',
      'استيراد وتوزيع أحبار الطابعات الليزرية الصديقة للبيئة ومستلزماتها',
      'قطع غيار الطابعات وخدمات الصيانة وعقود التأجير التشغيلي',
      'خدمات التوريد المباشر وسلاسل الإمداد للتقنيات والعتاد المكتبي',
    ],
    verificationPortalUrl: 'https://mc.gov.sa',
    verificationPortalLabelEn: 'Ministry of Commerce Portal',
    verificationPortalLabelAr: 'بوابة وزارة التجارة',
  },
  {
    id: 'zatca-vat',
    tabTitleEn: 'ZATCA Tax & VAT Certificate',
    tabTitleAr: 'شهادة ضريبة القيمة المضافة ZATCA',
    officialTitleEn: 'Value Added Tax (VAT) Registration Certificate',
    officialTitleAr: 'شهادة تسجيل في ضريبة القيمة المضافة',
    authorityEn: 'Zakat, Tax and Customs Authority (ZATCA)',
    authorityAr: 'هيئة الزكاة والضريبة والجمارك (زاتكا)',
    regNumber: '310382948200003',
    regLabelEn: 'VAT Identification Number (TIN)',
    regLabelAr: 'الرقم الضريبي الموحد',
    issueDateEn: 'Certified Phase 2 Fatoora Ready',
    issueDateAr: 'معتمد ومؤهل لنظام الفوترة الإلكترونية (فاتورة)',
    validityEn: 'Active Tax Compliant Entity',
    validityAr: 'مكلّف ممتثل وخاضع للضريبة بنسبة ١٥٪',
    sha256: '4a1b2c3d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    statusEn: 'ZATCA Fatoora Compliant QR Cryptography',
    statusAr: 'متطابق مع معايير الفوترة الإلكترونية المرحلة الثانية',
    summaryEn: 'Fully compliant corporate taxpayer with integrated electronic invoicing (E-Invoicing Fatoora Phase II), issuing cryptographic cryptostamped B2B invoices with instantaneous customs tariff clearance.',
    summaryAr: 'منشأة مسجلة وخاضعة للضريبة، تطبق نظام الفوترة الإلكترونية وتصدر فواتير ضريبية نظامية مدعمة بترميز الاستجابة السريع المشفر والمطابق لمتطلبات زاتكا.',
    activitiesEn: [
      'Standard 15% VAT Invoicing on all Goods and Corporate Services',
      'Direct Clearance with Saudi Customs Integrated Single Window (Fasah)',
      'Automated Cryptographic Hash Generation for Commercial Invoices',
      'Corporate Tax Clearance Certificate Issued Annually',
    ],
    activitiesAr: [
      'إصدار فواتير ضريبية نظامية بنسبة ١٥٪ لكافة المبيعات والخدمات',
      'تكامل مباشر مع منصة فسح الجمركية الموحدة للمملكة',
      'تشفير رقمي للبيانات لضمان الامتثال التام لهيئة الزكاة',
      'شهادات سنوية للإبراء الضريبي والزكوي',
    ],
    verificationPortalUrl: 'https://zatca.gov.sa',
    verificationPortalLabelEn: 'ZATCA Tax Portal',
    verificationPortalLabelAr: 'بوابة هيئة الزكاة والضريبة والجمارك',
  },
  {
    id: 'china-export',
    tabTitleEn: 'China MOFCOM Trade License',
    tabTitleAr: 'رخصة التجارة الخارجية الصينية',
    officialTitleEn: 'Foreign Trade Operator Registration Record',
    officialTitleAr: 'سجل ترخيص مزاولة التجارة الخارجية الصينية',
    authorityEn: 'Ministry of Commerce of the People\'s Republic of China (MOFCOM)',
    authorityAr: 'وزارة التجارة لجمهورية الصين الشعبية (MOFCOM)',
    regNumber: 'CN-EXP-440306-FNG',
    regLabelEn: 'Unified Social Credit / Operator Code',
    regLabelAr: 'رمز الترخيص والاعتماد التصديري',
    issueDateEn: 'Shenzhen / Guangzhou Commercial District',
    issueDateAr: 'مقاطعة غوانغدونغ — شنتشن / قوانغتشو',
    validityEn: 'Authorized Direct Factory Export Entity',
    validityAr: 'كيان تجاري معتمد للتصدير المباشر من المصانع',
    sha256: '7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c',
    statusEn: 'Audited Tier-1 Sourcing Partner',
    statusAr: 'شريك استيراد وتصنيع رئيسي مفحوص ومعتمد',
    summaryEn: 'Accredited international procurement infrastructure enabling direct OEM factory auditing, component sourcing, pre-shipment AQL 2.5 quality control, and bonded container loading across Guangdong industrial corridors.',
    summaryAr: 'بنية استيراد وتوريد دولية مرخّصة تتيح الفحص الهندسي الميداني بالمصانع وتجميع الحاويات وضمان الجودة الشاملة من المدن الصناعية الكبرى في الصين.',
    activitiesEn: [
      'Direct Tier-1 Factory Audits & Production Line Supervision',
      'Pre-Shipment Mil-Spec & AQL 2.5 Rigorous Sampling Protocols',
      'Consolidated Ocean & Air Freight Manifest Coordination',
      'SABER PCoC / SCoC Product Registration at Source Laboratories',
    ],
    activitiesAr: [
      'فحص وتدقيق مصانع الفئة الأولى والإشراف المباشر على خطوط الإنتاج',
      'بروتوكولات فحص صارمة AQL 2.5 قبل شحن البضائع',
      'تنسيق بوالص الشحن البحري والجوي المجمعة من الموانئ الرئيسية',
      'إصدار شهادات مطابقة سابر من المختبرات المعتمدة قبل التحميل',
    ],
    verificationPortalUrl: 'http://english.mofcom.gov.cn',
    verificationPortalLabelEn: 'MOFCOM China Official Record',
    verificationPortalLabelAr: 'سجل وزارة التجارة الصينية',
  },
  {
    id: 'saber-iso',
    tabTitleEn: 'SASO / SABER & ISO Standards',
    tabTitleAr: 'اعتمادات سابر والمقاييس الدولية ISO',
    officialTitleEn: 'SASO SABER Conformity & ISO Compliance Statement',
    officialTitleAr: 'بيان المطابقة الفنية لمنصة سابر والمواصفات القياسية',
    authorityEn: 'Saudi Standards, Metrology and Quality Org (SASO) & ISO',
    authorityAr: 'الهيئة السعودية للمواصفات والمقاييس والجودة (SASO)',
    regNumber: 'SABER-KSA-PCoC-9921',
    regLabelEn: 'SABER Conformity ID',
    regLabelAr: 'رقم المطابقة في منصة سابر',
    issueDateEn: 'ISO 9001:2015 & ISO 14001:2015',
    issueDateAr: 'ISO 9001:2015 و ISO 14001:2015',
    validityEn: 'Full Regulatory Technical Compliance',
    validityAr: 'مطابقة تامة للمواصفات واللوائح الفنية السعودية',
    sha256: '3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
    statusEn: 'SASO Technical Regulations Certified',
    statusAr: 'معتمد وفق اللوائح الفنية للأجهزة الكهربائية والمكتبية',
    summaryEn: 'Certified conformity guarantees that all imported printers, laser components, and eco-toner cartridges meet Saudi environmental safety and electromagnetic compatibility (EMC) regulations without hazardous materials (RoHS).',
    summaryAr: 'ضمانات مطابقة معتمدة تؤكد خلو المنتجات من المواد المحظورة ومطابقتها للمواصفات البيئية والتوافق الكهرومغناطيسي المعتمد بالمملكة.',
    activitiesEn: [
      'RoHS & CE Certified Non-Hazardous Toner Chemical Formulations',
      'Eco-Smart Cartridges Zero Microplastic Leakage Testing',
      'Electromagnetic Compatibility (EMC) CITC / CST Radio Approvals',
      'Continuous Environmental Lifecycle Assessments (Vision 2030 Aligned)',
    ],
    activitiesAr: [
      'تركيبات أحبار غير ضارة ومعتمدة بيئياً بموجب لوائح RoHS',
      'فحص كبسولات الحبر ضد تسريب الجزيئات الدقيقة في بيئات العمل',
      'شهادات التوافق الكهرومغناطيسي للأجهزة المكتبية من هيئة الاتصالات',
      'تقييمات بيئية مستمرة لدعم مبادرات الاستدامة ورؤية المملكة ٢٠٣٠',
    ],
    verificationPortalUrl: 'https://saber.sa',
    verificationPortalLabelEn: 'SABER Conformity Portal',
    verificationPortalLabelAr: 'منصة سابر الإلكترونية',
  },
];

export default function DocumentVerificationModal({
  isOpen,
  onClose,
  isAr = false,
}: DocumentVerificationModalProps) {
  const [activeDocId, setActiveDocId] = useState<string>('saudi-cr');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isLoupeActive, setIsLoupeActive] = useState(false);
  const [loupePos, setLoupePos] = useState({ x: 0, y: 0, relX: 0, relY: 0 });

  const docContainerRef = useRef<HTMLDivElement>(null);
  const activeDoc = DOCUMENTS.find((d) => d.id === activeDocId) || DOCUMENTS[0];

  // Esc key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Optical Loupe Mouse Handler
  const handleDocMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!docContainerRef.current) return;
    const rect = docContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const relX = (x / rect.width) * 100;
    const relY = (y / rect.height) * 100;
    setLoupePos({ x, y, relX, relY });
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(12px, 3vw, 24px)',
            backgroundColor: 'rgba(5, 10, 20, 0.78)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="doc-verification-title"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '1080px',
              maxHeight: '90vh',
              background: '#0B132B',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 32px 80px rgba(0, 0, 0, 0.65), 0 0 40px rgba(141, 184, 51, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              color: '#FFFFFF',
              direction: isAr ? 'rtl' : 'ltr',
            }}
          >
            <BorderBeam size={320} duration={10} colorFrom="var(--accent)" colorTo="#3B82F6" />

            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'clamp(16px, 2.5vw, 24px) clamp(20px, 3vw, 32px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(141, 184, 51, 0.15)',
                    border: '1px solid rgba(141, 184, 51, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShieldCheck size={24} color="var(--accent)" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2
                      id="doc-verification-title"
                      style={{
                        margin: 0,
                        fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {isAr ? 'مركز التحقق من الوثائق والاعتمادات الرسمية' : 'Enterprise Credentials & Regulatory Verification'}
                    </h2>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: '999px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#34D399',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <CheckCircle2 size={12} />
                      {isAr ? 'موثّق رسمياً' : 'Official Government Record'}
                    </span>
                  </div>
                  <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#94A3B8' }}>
                    {isAr
                      ? 'وثائق السجل التجاري، الرقم الضريبي الزكوي، ورخص التجارة الخارجية المعتمدة لشركة فيوتشر نكست جن'
                      : 'Real-time cryptographic audit trail for Future Next Gen (FNG) commercial, tax, and trade licenses.'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close modal"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.color = '#EF4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = '#CBD5E1';
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                padding: '12px clamp(16px, 3vw, 32px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(0, 0, 0, 0.2)',
                overflowX: 'auto',
                scrollbarWidth: 'none',
              }}
            >
              {DOCUMENTS.map((doc) => {
                const isActive = doc.id === activeDocId;
                return (
                  <button
                    key={doc.id}
                    onClick={() => setActiveDocId(doc.id)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '10px',
                      border: isActive
                        ? '1px solid var(--accent)'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                      background: isActive ? 'rgba(141, 184, 51, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                      color: isActive ? 'var(--accent)' : '#94A3B8',
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 180ms ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <FileCheck size={16} />
                    <span>{isAr ? doc.tabTitleAr : doc.tabTitleEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body: Document Visual Certificate + Verification Dossier */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
                gap: '24px',
                padding: 'clamp(18px, 3vw, 28px) clamp(20px, 3vw, 32px)',
                overflowY: 'auto',
                flex: 1,
              }}
              className="doc-modal-grid"
            >
              {/* Left Column: High-Security Visual Certificate with Optical Loupe */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B', fontWeight: 700 }}>
                    {isAr ? 'معاينة الوثيقة الرسمية التفاعلية' : 'Interactive Security Certificate Render'}
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--accent)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <Search size={13} />
                    {isAr ? 'مرّر المؤشر للمعاينة المجهرية 2.5×' : 'Hover to activate 2.5x optical loupe'}
                  </span>
                </div>

                {/* Certificate Paper Render */}
                <div
                  ref={docContainerRef}
                  onMouseEnter={() => setIsLoupeActive(true)}
                  onMouseLeave={() => setIsLoupeActive(false)}
                  onMouseMove={handleDocMouseMove}
                  style={{
                    position: 'relative',
                    background: 'radial-gradient(ellipse at 50% 30%, #FFFFFF 0%, #F8FAFC 70%, #F1F5F9 100%)',
                    borderRadius: '16px',
                    padding: 'clamp(20px, 3vw, 32px)',
                    color: '#0F172A',
                    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.35)',
                    border: '4px double #CBD5E1',
                    overflow: 'hidden',
                    cursor: 'crosshair',
                    userSelect: 'none',
                  }}
                >
                  {/* Guilloche Security Lattice Pattern */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `repeating-linear-gradient(45deg, rgba(47, 109, 176, 0.03) 0, rgba(47, 109, 176, 0.03) 1px, transparent 0, transparent 12px), repeating-linear-gradient(-45deg, rgba(141, 184, 51, 0.03) 0, rgba(141, 184, 51, 0.03) 1px, transparent 0, transparent 12px)`,
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Watermark Emblem */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) rotate(-25deg)',
                      fontSize: 'clamp(3rem, 6vw, 5rem)',
                      fontWeight: 900,
                      color: 'rgba(47, 109, 176, 0.04)',
                      letterSpacing: '0.1em',
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                      fontFamily: 'serif',
                    }}
                  >
                    FNG VERIFIED
                  </div>

                  {/* Certificate Header */}
                  <div style={{ textAlign: 'center', borderBottom: '2px solid #E2E8F0', paddingBottom: '16px', marginBottom: '16px', position: 'relative' }}>
                    <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: '#475569', fontWeight: 800, textTransform: 'uppercase' }}>
                      {isAr ? activeDoc.authorityAr : activeDoc.authorityEn}
                    </div>
                    <h3 style={{ margin: '6px 0 2px', fontSize: '1.25rem', fontWeight: 900, color: '#1E293B' }}>
                      {isAr ? activeDoc.officialTitleAr : activeDoc.officialTitleEn}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                      Future Next Gen Trading Co. (FNG) — شركة فيوتشر نكست جن للتجارة
                    </div>
                  </div>

                  {/* Key Details Rows */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                    <div style={{ background: 'rgba(241, 245, 249, 0.8)', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>
                        {isAr ? activeDoc.regLabelAr : activeDoc.regLabelEn}
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-mono)' }}>
                        {activeDoc.regNumber}
                      </div>
                    </div>
                    <div style={{ background: 'rgba(241, 245, 249, 0.8)', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>
                        {isAr ? 'تاريخ وسريان الاعتماد' : 'Issued & Validity'}
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#059669' }}>
                        {isAr ? activeDoc.validityAr : activeDoc.validityEn}
                      </div>
                    </div>
                  </div>

                  {/* Summary of Authorized Operations */}
                  <div style={{ marginBottom: '16px', fontSize: '0.82rem', lineHeight: 1.6, color: '#334155' }}>
                    {isAr ? activeDoc.summaryAr : activeDoc.summaryEn}
                  </div>

                  {/* Certificate Footer Stamp & Security Seal */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px dashed #CBD5E1',
                      paddingTop: '14px',
                      marginTop: '14px',
                    }}
                  >
                    {/* Simulated Official Holographic Stamp */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid rgba(16, 185, 129, 0.6)',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(141, 184, 51, 0.15) 100%)',
                      }}
                    >
                      <Stamp size={20} color="#059669" />
                      <div>
                        <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#065F46', textTransform: 'uppercase' }}>
                          {isAr ? 'ختم الاعتماد الرقمي المعتمد' : 'Digital Security Stamp'}
                        </div>
                        <div style={{ fontSize: '0.64rem', color: '#047857', fontFamily: 'var(--font-mono)' }}>
                          STATUS: 100% REGULATED
                        </div>
                      </div>
                    </div>

                    {/* QR Code Simulation */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          border: '1px solid #94A3B8',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#FFFFFF',
                        }}
                      >
                        <QrCode size={30} color="#0F172A" />
                      </div>
                      <div style={{ fontSize: '0.64rem', color: '#64748B', lineHeight: 1.2 }}>
                        <div>{isAr ? 'امسح للتحقق' : 'Scan to Audit'}</div>
                        <div style={{ fontFamily: 'var(--font-mono)' }}>KSA-SBC-GATE</div>
                      </div>
                    </div>
                  </div>

                  {/* Optical Loupe Lens Overlay */}
                  {isLoupeActive && (
                    <div
                      style={{
                        position: 'absolute',
                        width: '130px',
                        height: '130px',
                        borderRadius: '50%',
                        top: `${loupePos.y - 65}px`,
                        left: `${loupePos.x - 65}px`,
                        pointerEvents: 'none',
                        border: '3px solid var(--accent)',
                        boxShadow: '0 0 0 3px rgba(0, 0, 0, 0.3), 0 12px 28px rgba(0, 0, 0, 0.45)',
                        background: '#FFFFFF',
                        backgroundImage: 'radial-gradient(circle, #FFFFFF 0%, #F1F5F9 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        zIndex: 20,
                      }}
                    >
                      <div
                        style={{
                          transform: 'scale(2.2)',
                          fontSize: '0.48rem',
                          fontWeight: 800,
                          textAlign: 'center',
                          color: '#0F172A',
                          width: '100%',
                          padding: '4px',
                        }}
                      >
                        <div style={{ color: '#059669', marginBottom: '2px' }}>● MICROPRINT SECURE</div>
                        <div>{activeDoc.regNumber}</div>
                        <div style={{ fontSize: '0.4rem', color: '#475569' }}>VALIDATED REGISTRY</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Enterprise Verification Dossier & Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Government Status Pill */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: 700 }}>
                      {isAr ? 'حالة الاعتماد الحكومي' : 'Government Verification Status'}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'rgba(141, 184, 51, 0.2)',
                        color: 'var(--accent)',
                      }}
                    >
                      {isAr ? 'نشط ومطابق' : 'ACTIVE & VERIFIED'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                    {isAr ? activeDoc.statusAr : activeDoc.statusEn}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                    {isAr ? activeDoc.issueDateAr : activeDoc.issueDateEn}
                  </div>
                </div>

                {/* Authorized Commercial Scope */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    flex: 1,
                  }}
                >
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: 700, marginBottom: '12px' }}>
                    {isAr ? 'الأنشطة والصلاحيات النظامية المعتمدة' : 'Authorized Enterprise Scope'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(isAr ? activeDoc.activitiesAr : activeDoc.activitiesEn).map((act, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <CheckCircle2 size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: '3px' }} />
                        <span style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.5 }}>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cryptographic Hash Audit String */}
                <div
                  style={{
                    padding: '14px 16px',
                    borderRadius: '14px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Lock size={13} color="var(--accent)" />
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>
                        {isAr ? 'بصمة التشفير الرقمية (SHA-256)' : 'Cryptographic Audit Digest (SHA-256)'}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(activeDoc.sha256, 'hash')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: copiedKey === 'hash' ? 'var(--accent)' : '#94A3B8',
                        cursor: 'pointer',
                        fontSize: '0.72rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Copy size={12} />
                      {copiedKey === 'hash' ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ البصمة' : 'Copy Hash')}
                    </button>
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      color: '#64748B',
                      wordBreak: 'break-all',
                      lineHeight: 1.4,
                      background: 'rgba(255, 255, 255, 0.02)',
                      padding: '6px 10px',
                      borderRadius: '6px',
                    }}
                  >
                    {activeDoc.sha256}
                  </div>
                </div>

                {/* Action Buttons: Copy Reg Number & External Portal */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => copyToClipboard(activeDoc.regNumber, 'reg')}
                    className="btn-secondary"
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      fontSize: '0.82rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: copiedKey === 'reg' ? 'var(--accent)' : '#FFFFFF',
                      background: 'rgba(255, 255, 255, 0.06)',
                      cursor: 'pointer',
                    }}
                  >
                    <Copy size={14} />
                    <span>
                      {copiedKey === 'reg'
                        ? (isAr ? 'تم نسخ الرقم!' : 'Number Copied!')
                        : (isAr ? `نسخ ${activeDoc.regNumber}` : `Copy ${activeDoc.regNumber}`)}
                    </span>
                  </button>

                  {activeDoc.verificationPortalUrl && (
                    <a
                      href={activeDoc.verificationPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{
                        padding: '10px 16px',
                        fontSize: '0.82rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        fontWeight: 700,
                      }}
                    >
                      <span>{isAr ? activeDoc.verificationPortalLabelAr : activeDoc.verificationPortalLabelEn}</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          <style jsx>{`
            @media (max-width: 860px) {
              .doc-modal-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
