'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Printer,
  Wrench,
  Recycle,
  Ship,
  Calculator,
  Phone,
  MessageCircle,
  Sparkles,
  Command,
  CornerDownLeft,
  Building,
  Monitor,
  Cpu,
  Layers,
  HelpCircle,
  Languages,
  ShieldCheck,
  X,
} from 'lucide-react';
import BorderBeam from '@/components/ui/BorderBeam';
import DocumentVerificationModal from '@/components/ui/DocumentVerificationModal';

interface PaletteItem {
  id: string;
  titleEn: string;
  titleAr: string;
  categoryEn: string;
  categoryAr: string;
  descriptionEn: string;
  descriptionAr: string;
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  action: () => void;
  keywords: string[];
  badgeEn?: string;
  badgeAr?: string;
}

interface CommandPaletteProps {
  locale: string;
}

export default function CommandPalette({ locale }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [docModalOpen, setDocModalOpen] = useState(false);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isAr = locale === 'ar';
  const otherLocale = isAr ? 'en' : 'ar';

  const closePalette = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const togglePalette = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) {
        setQuery('');
        setSelectedIndex(0);
        return false;
      }
      return true;
    });
  }, []);

  const navigate = useCallback(
    (path: string) => {
      closePalette();
      router.push(path);
    },
    [closePalette, router]
  );

  const openWhatsApp = useCallback(() => {
    closePalette();
    window.open('https://wa.me/966593380390', '_blank', 'noopener,noreferrer');
  }, [closePalette]);

  const callPhone = useCallback(() => {
    closePalette();
    window.location.href = 'tel:+966593380390';
  }, [closePalette]);

  const switchLanguage = useCallback(() => {
    closePalette();
    const currentPath = window.location.pathname;
    const segments = currentPath.split('/');
    segments[1] = otherLocale;
    router.push(segments.join('/') + window.location.hash);
  }, [closePalette, otherLocale, router]);

  const openDocVerification = useCallback(() => {
    closePalette();
    setTimeout(() => {
      setDocModalOpen(true);
    }, 150);
  }, [closePalette]);

  const items: PaletteItem[] = useMemo(
    () => [
      // Interactive Tools
      {
        id: 'tool-cad',
        titleEn: 'Interactive CAD Hardware Dissection',
        titleAr: 'المجسم الهندسي التفاعلي للطابعات (CAD)',
        categoryEn: 'Interactive Engineering Tools',
        categoryAr: 'أدوات هندسية تفاعلية',
        descriptionEn: 'Explore exploded 3D views of fusers, formatter boards, drums & drive gears.',
        descriptionAr: 'استكشف المكونات الداخلية للطابعات بدقة ثلاثية الأبعاد ونقاط الفحص الليزرية.',
        icon: Cpu,
        action: () => navigate(`/${locale}/printer-parts#exploded-cad`),
        keywords: ['cad', 'exploded', 'hardware', 'dissection', 'fuser', 'drum', 'gears', '3d', 'مكونات', 'تفجير', 'هندسي', 'قطع'],
        badgeEn: '3D Interactive',
        badgeAr: 'تفاعلي 3D',
      },
      {
        id: 'tool-radar',
        titleEn: 'China-to-Saudi Maritime Route Radar',
        titleAr: 'رادار المسار الملاحي والتوريد الدولي (الصين - السعودية)',
        categoryEn: 'Interactive Engineering Tools',
        categoryAr: 'أدوات هندسية تفاعلية',
        descriptionEn: 'Track 5-stage logistics corridor: factory AQL 2.5, sea transit, ZATCA customs & delivery.',
        descriptionAr: 'تتبع المراحل الخمس للتوريد من فحص المصنع بالصين حتى التخليص الجمركي والتسليم بالمملكة.',
        icon: Ship,
        action: () => navigate(`/${locale}/sourcing#sourcing-radar`),
        keywords: ['radar', 'shipping', 'transit', 'route', 'maritime', 'freight', 'china', 'zatca', 'شحن', 'رادار', 'مسار', 'توريد', 'بحر'],
        badgeEn: 'Live Radar',
        badgeAr: 'رادار ملاحي',
      },
      {
        id: 'tool-calc',
        titleEn: 'Enterprise Eco & ROI Savings Calculator',
        titleAr: 'حاسبة العائد الاقتصادي والاستدامة البيئية (ROI)',
        categoryEn: 'Interactive Engineering Tools',
        categoryAr: 'أدوات هندسية تفاعلية',
        descriptionEn: 'Calculate annual cost reduction, carbon avoidance, and cartridge life.',
        descriptionAr: 'احسب الوفر المالي السنوي، خفض الانبعاثات الكربونية، وعدد خراطيش الحبر الموفرة.',
        icon: Calculator,
        action: () => navigate(`/${locale}/sustainability#calculator`),
        keywords: ['calculator', 'roi', 'eco', 'savings', 'cost', 'sustainability', 'حاسبة', 'توفير', 'استدامة', 'تكلفة'],
        badgeEn: 'ROI Simulator',
        badgeAr: 'محاكي العائد',
      },
      {
        id: 'tool-verification',
        titleEn: 'Cryptographic Document & CR Verification',
        titleAr: 'التحقق الرقمي من السجل التجاري ورخص الاستيراد',
        categoryEn: 'Regulatory & Credibility',
        categoryAr: 'التراخيص والاعتمادات الرسمية',
        descriptionEn: 'Audit official Saudi CR (1010724885), ZATCA VAT, and MOFCOM China license with 2.5x loupe.',
        descriptionAr: 'فحص مجهري وتدقيق رقمي للسجل التجاري والشهادة الضريبية ورخص التصدير الصينية.',
        icon: ShieldCheck,
        action: openDocVerification,
        keywords: ['verification', 'cr', 'vat', 'tax', 'license', 'mofcom', 'zatca', 'سجل', 'تجاري', 'ضريبة', 'رخصة', 'تحقق', 'وثائق'],
        badgeEn: 'CR: 1010724885',
        badgeAr: 'سجل: ١٠١٠٧٢٤٨٨٥',
      },

      // Catalog & Hardware
      {
        id: 'cat-printers',
        titleEn: 'Refurbished Enterprise HP LaserJet Printers',
        titleAr: 'طابعات HP ليزر مؤسسية مجددة بضمان معتمد',
        categoryEn: 'Products & Fleets',
        categoryAr: 'المنتجات والأسطول',
        descriptionEn: 'Heavy-duty high-speed mono and color printers with 1-year replacement warranty.',
        descriptionAr: 'طابعات ليزرية عالية التحمل والسرعة مدعومة بضمان استبدال شامل لمدة عام.',
        icon: Printer,
        action: () => navigate(`/${locale}/printers`),
        keywords: ['printers', 'hp', 'laserjet', 'enterprise', 'hardware', 'طابعات', 'طابعة', 'اتش بي', 'ليزري'],
      },
      {
        id: 'cat-parts',
        titleEn: 'HP Genuine & Certified Replacement Parts',
        titleAr: 'قطع غيار طابعات HP الأصلية والمطابقة',
        categoryEn: 'Products & Fleets',
        categoryAr: 'المنتجات والأسطول',
        descriptionEn: 'Fusers, rollers, pickup assemblies, formatters, and imaging drums.',
        descriptionAr: 'وحدات التثبيت الحراري، بكرات السحب، اللوحات الأم، وأحزمة النقل.',
        icon: Wrench,
        action: () => navigate(`/${locale}/printer-parts`),
        keywords: ['parts', 'fuser', 'roller', 'motherboard', 'formatter', 'drum', 'itb', 'قطع', 'غيار', 'فيوزر', 'بكرات', 'درام'],
      },
      {
        id: 'cat-toner',
        titleEn: 'Certified Eco Inks & Laser Toner Cartridges',
        titleAr: 'أحبار إيكو الصديقة للبيئة وخراطيش الليزر',
        categoryEn: 'Products & Fleets',
        categoryAr: 'المنتجات والأسطول',
        descriptionEn: 'Zero microplastic leakage, high page-yield, calibrated for Saudi ambient climates.',
        descriptionAr: 'أحبار ليزرية فائقة الدقة والانتاجية ومقاومة للحرارة معتمدة للمملكة.',
        icon: Recycle,
        action: () => navigate(`/${locale}/eco-inks`),
        keywords: ['toner', 'ink', 'eco', 'cartridge', 'cf287a', 'ce505a', 'حبر', 'أحبار', 'تونر', 'خراطيش', 'إيكو'],
      },
      {
        id: 'cat-equipment',
        titleEn: 'Office Equipment & Corporate Peripherals',
        titleAr: 'أجهزة وتجهيزات المكاتب للشركات والمؤسسات',
        categoryEn: 'Products & Fleets',
        categoryAr: 'المنتجات والأسطول',
        descriptionEn: 'Heavy-duty scanners, multi-function machines, and document shredders.',
        descriptionAr: 'ماسحات ضوئية، ماكينات متعددة المهام، وأجهزة تمزيق وتجهيزات المكاتب.',
        icon: Monitor,
        action: () => navigate(`/${locale}/equipment`),
        keywords: ['equipment', 'scanners', 'shredders', 'office', 'peripherals', 'أجهزة', 'مكتبية', 'تجهيزات', 'سكانر'],
      },

      // Sourcing Services
      {
        id: 'src-hub',
        titleEn: 'Global Technology Sourcing & Procurement',
        titleAr: 'خدمات التوريد المباشر وسلاسل الإمداد العالمية',
        categoryEn: 'Sourcing & Supply Chain',
        categoryAr: 'التوريد وسلاسل الإمداد',
        descriptionEn: 'Factory-direct procurement from China for computers, electronics, and medical tech.',
        descriptionAr: 'توريد مباشر من المصانع بالصين لأجهزة الحاسب، الشاشات، والمعدات التقنية والطبية.',
        icon: Ship,
        action: () => navigate(`/${locale}/sourcing`),
        keywords: ['sourcing', 'china', 'procurement', 'import', 'factory', 'shenzhen', 'توريد', 'استيراد', 'صين', 'شنتشن', 'مصانع'],
      },
      {
        id: 'src-categories',
        titleEn: 'Sourcing Product Categories Catalog',
        titleAr: 'كتالوج قطاعات ومنتجات التوريد المتاحة',
        categoryEn: 'Sourcing & Supply Chain',
        categoryAr: 'التوريد وسلاسل الإمداد',
        descriptionEn: 'Computers, displays, medical technology, robotics, solar equipment.',
        descriptionAr: 'أجهزة حاسب، شاشات عرض، أجهزة طبية، أنظمة طاقة، وروبوتات صناعية.',
        icon: Layers,
        action: () => navigate(`/${locale}/sourcing#sourcing-categories`),
        keywords: ['categories', 'computers', 'displays', 'medical', 'solar', 'قطاعات', 'تصنيفات', 'حواسب', 'شاشات'],
      },

      // Company & Actions
      {
        id: 'act-lang',
        titleEn: isAr ? 'Switch to English (LTR)' : 'التبديل إلى اللغة العربية (RTL)',
        titleAr: isAr ? 'Switch to English (LTR)' : 'التبديل إلى اللغة العربية (RTL)',
        categoryEn: 'Quick Commands',
        categoryAr: 'أوامر سريعة',
        descriptionEn: isAr ? 'Change application interface language to English.' : 'تغيير لغة الموقع بالكامل إلى اللغة العربية.',
        descriptionAr: isAr ? 'Change application interface language to English.' : 'تغيير لغة الموقع بالكامل إلى اللغة العربية.',
        icon: Languages,
        action: switchLanguage,
        keywords: ['language', 'arabic', 'english', 'switch', 'لغة', 'عربي', 'انجليزي', 'تبديل'],
        badgeEn: isAr ? 'EN' : 'عربي',
        badgeAr: isAr ? 'EN' : 'عربي',
      },
      {
        id: 'act-whatsapp',
        titleEn: 'Connect with Procurement Director via WhatsApp',
        titleAr: 'محادثة فورية مع مسؤول التوريد عبر واتساب',
        categoryEn: 'Quick Commands',
        categoryAr: 'أوامر سريعة',
        descriptionEn: 'Direct instant channel to FNG executive procurement team (+966 54 810 5000).',
        descriptionAr: 'قناة تواصل سريعة ومباشرة مع مسؤولي التوريد والمبيعات لشركة FNG.',
        icon: MessageCircle,
        action: openWhatsApp,
        keywords: ['whatsapp', 'chat', 'direct', 'procurement', 'contact', 'واتساب', 'محادثة', 'تواصل', 'مبيعات'],
        badgeEn: 'Instant Response',
        badgeAr: 'رد فوري',
      },
      {
        id: 'act-call',
        titleEn: 'Call Riyadh Corporate Headquarters',
        titleAr: 'الاتصال المباشر بالمقر الرئيسي في الرياض',
        categoryEn: 'Quick Commands',
        categoryAr: 'أوامر سريعة',
        descriptionEn: 'Direct phone line: +966 54 810 5000 (09:00 - 18:00 AST).',
        descriptionAr: 'رقم الهاتف المباشر: 0548105000 (من 9 صباحاً حتى 6 مساءً).',
        icon: Phone,
        action: callPhone,
        keywords: ['call', 'phone', 'telephone', 'riyadh', 'headquarters', 'اتصال', 'هاتف', 'مقر', 'رياض'],
      },
      {
        id: 'page-about',
        titleEn: 'About FNG Corporate Infrastructure',
        titleAr: 'عن شركة فيوتشر نكست جن وبنيتها المؤسسية',
        categoryEn: 'Company Information',
        categoryAr: 'عن الشركة',
        descriptionEn: 'Regional offices in Riyadh, Jeddah, Dammam, Dubai, and Guangzhou.',
        descriptionAr: 'شبكة المكاتب الإقليمية في الرياض وجدة والدمام ودبي وقوانغتشو.',
        icon: Building,
        action: () => navigate(`/${locale}/about`),
        keywords: ['about', 'company', 'fng', 'mission', 'history', 'عن الشركة', 'نبذة', 'قصة', 'مكاتب'],
      },
      {
        id: 'page-faq',
        titleEn: 'Enterprise FAQ & Technical Knowledgebase',
        titleAr: 'الأسئلة الشائعة والقاعدة المعرفية للشركات',
        categoryEn: 'Company Information',
        categoryAr: 'عن الشركة',
        descriptionEn: 'Warranties, delivery times, payment terms, and SABER customs clearance details.',
        descriptionAr: 'تفاصيل الضمان، مدد التوصيل، طرق الدفع، وإجراءات فسح وسابر الجمركية.',
        icon: HelpCircle,
        action: () => navigate(`/${locale}/faq`),
        keywords: ['faq', 'questions', 'help', 'answers', 'support', 'أسئلة', 'شائعة', 'مساعدة', 'استفسارات'],
      },
    ],
    [locale, isAr, navigate, switchLanguage, openWhatsApp, callPhone, openDocVerification]
  );

  // Filter items by query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase().trim();
    return items.filter((item) => {
      const matchTitle = item.titleEn.toLowerCase().includes(q) || item.titleAr.includes(q);
      const matchDesc = item.descriptionEn.toLowerCase().includes(q) || item.descriptionAr.includes(q);
      const matchCat = item.categoryEn.toLowerCase().includes(q) || item.categoryAr.includes(q);
      const matchKeywords = item.keywords.some((k) => k.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchCat || matchKeywords;
    });
  }, [items, query]);

  const safeSelectedIndex = selectedIndex < filteredItems.length ? selectedIndex : 0;

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(0);
  };

  // Keyboard shortcut listener (Ctrl+K, Cmd+K, /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in another input/textarea
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        togglePalette();
      } else if (e.key === '/' && !isInput && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape' && isOpen) {
        closePalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, togglePalette, closePalette]);

  // Palette Navigation keyboard listener
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[safeSelectedIndex]) {
        filteredItems[safeSelectedIndex].action();
      }
    }
  };

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Global Command Palette Trigger Button (Mounted in Header) */}
      <div style={{ display: 'contents' }}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9998,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingTop: 'clamp(60px, 12vh, 120px)',
                paddingLeft: '16px',
                paddingRight: '16px',
                paddingBottom: '24px',
                backgroundColor: 'rgba(5, 10, 20, 0.72)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
              }}
              onClick={closePalette}
              role="dialog"
              aria-modal="true"
              aria-label={isAr ? 'قائمة الأوامر والبحث الشامل' : 'Command & Navigation Palette'}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: -16 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.96, opacity: 0, y: -10 }}
                transition={{ type: 'spring', damping: 25, stiffness: 320 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '680px',
                  maxHeight: '75vh',
                  background: 'linear-gradient(180deg, #0D162B 0%, #0A1020 100%)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  boxShadow: '0 32px 80px rgba(0, 0, 0, 0.7), 0 0 30px rgba(141, 184, 51, 0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  direction: isAr ? 'rtl' : 'ltr',
                }}
              >
                <BorderBeam size={260} duration={8} colorFrom="var(--accent)" colorTo="#38BDF8" />

                {/* Input Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 20px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    background: 'rgba(255, 255, 255, 0.02)',
                  }}
                >
                  <Search size={22} color="var(--accent)" style={{ flexShrink: 0 }} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleQueryChange}
                    onKeyDown={handleInputKeyDown}
                    placeholder={
                      isAr
                        ? 'ابحث عن طابعات، قطع غيار، رادار التوريد، السجل التجاري، حاسبة التوفير...'
                        : 'Search printers, parts, sourcing radar, CR verification, ROI calculator...'
                    }
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#FFFFFF',
                      fontSize: '1rem',
                      fontWeight: 500,
                    }}
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <X size={18} />
                    </button>
                  )}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#94A3B8',
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    ESC
                  </div>
                </div>

                {/* Results List */}
                <div
                  ref={listRef}
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '10px',
                    maxHeight: '440px',
                  }}
                >
                  {filteredItems.length === 0 ? (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '48px 20px',
                        color: '#64748B',
                      }}
                    >
                      <Search size={36} color="#475569" style={{ margin: '0 auto 12px' }} />
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#94A3B8' }}>
                        {isAr ? 'لم يتم العثور على نتائج' : 'No matching results found'}
                      </div>
                      <p style={{ fontSize: '0.82rem', margin: '6px 0 0' }}>
                        {isAr ? 'جرب البحث بكلمات مثل "طابعة"، "فيوزر"، "توريد"، أو "سجل"' : 'Try searching "printer", "radar", "fuser", or "CR"'}
                      </p>
                    </div>
                  ) : (
                    filteredItems.map((item, index) => {
                      const isSelected = index === safeSelectedIndex;
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.id}
                          onClick={() => item.action()}
                          onMouseEnter={() => setSelectedIndex(index)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            background: isSelected ? 'rgba(141, 184, 51, 0.14)' : 'transparent',
                            border: isSelected
                              ? '1px solid rgba(141, 184, 51, 0.35)'
                              : '1px solid transparent',
                            cursor: 'pointer',
                            transition: 'all 120ms ease',
                            marginBottom: '4px',
                          }}
                        >
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '10px',
                              background: isSelected
                                ? 'rgba(141, 184, 51, 0.25)'
                                : 'rgba(255, 255, 255, 0.05)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              color: isSelected ? 'var(--accent)' : '#94A3B8',
                              transition: 'all 120ms ease',
                            }}
                          >
                            <Icon size={18} />
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span
                                style={{
                                  fontSize: '0.9rem',
                                  fontWeight: isSelected ? 700 : 600,
                                  color: isSelected ? '#FFFFFF' : '#E2E8F0',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {isAr ? item.titleAr : item.titleEn}
                              </span>

                              {(item.badgeEn || item.badgeAr) && (
                                <span
                                  style={{
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    padding: '2px 7px',
                                    borderRadius: '6px',
                                    background: isSelected
                                      ? 'rgba(141, 184, 51, 0.3)'
                                      : 'rgba(255, 255, 255, 0.08)',
                                    color: isSelected ? 'var(--accent)' : '#94A3B8',
                                  }}
                                >
                                  {isAr ? item.badgeAr : item.badgeEn}
                                </span>
                              )}
                            </div>

                            <p
                              style={{
                                margin: '2px 0 0',
                                fontSize: '0.78rem',
                                color: isSelected ? '#CBD5E1' : '#64748B',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {isAr ? item.descriptionAr : item.descriptionEn}
                            </p>
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              opacity: isSelected ? 1 : 0,
                              transition: 'opacity 120ms ease',
                              color: 'var(--accent)',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            <span>{isAr ? 'اختيار' : 'Select'}</span>
                            <CornerDownLeft size={14} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer Controls */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 18px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    background: 'rgba(0, 0, 0, 0.25)',
                    fontSize: '0.74rem',
                    color: '#64748B',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <kbd style={{ padding: '2px 5px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.06)', fontFamily: 'var(--font-mono)' }}>↑</kbd>
                      <kbd style={{ padding: '2px 5px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.06)', fontFamily: 'var(--font-mono)' }}>↓</kbd>
                      <span>{isAr ? 'للتنقل' : 'Navigate'}</span>
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <kbd style={{ padding: '2px 5px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.06)', fontFamily: 'var(--font-mono)' }}>↵</kbd>
                      <span>{isAr ? 'للاختيار' : 'Select'}</span>
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', fontWeight: 600 }}>
                    <Sparkles size={13} />
                    <span>{isAr ? 'FNG OmniSearch' : 'FNG OmniSearch'}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <DocumentVerificationModal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        isAr={isAr}
      />
    </>
  );
}

// Standalone trigger button for Navbar
export function CommandPaletteTrigger({ isAr = false }: { isAr?: boolean }) {
  const triggerPalette = () => {
    // Dispatch synthetic Ctrl+K event
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
  };

  return (
    <button
      onClick={triggerPalette}
      type="button"
      aria-label={isAr ? 'فتح البحث السريع' : 'Open Command Palette'}
      style={{
        height: '42px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '0 14px',
        borderRadius: 'var(--radius-pill)',
        border: '1px solid rgba(17, 24, 39, 0.1)',
        background: 'rgba(255, 255, 255, 0.55)',
        color: '#4B5563',
        fontSize: '0.84rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 180ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent)';
        e.currentTarget.style.color = 'var(--accent-text)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(17, 24, 39, 0.1)';
        e.currentTarget.style.color = '#4B5563';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.55)';
      }}
    >
      <Search size={15} color="var(--accent-text)" />
      <span className="search-pill-label" style={{ fontSize: '0.82rem' }}>
        {isAr ? 'بحث سريع...' : 'Quick Search...'}
      </span>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2px',
          padding: '2px 6px',
          borderRadius: '6px',
          background: 'rgba(0, 0, 0, 0.05)',
          fontSize: '0.7rem',
          fontFamily: 'var(--font-mono)',
          color: '#6B7280',
        }}
      >
        <Command size={10} />K
      </span>
      <style jsx>{`
        @media (max-width: 640px) {
          .search-pill-label {
            display: none;
          }
        }
      `}</style>
    </button>
  );
}
