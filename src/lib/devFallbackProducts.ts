import type { Product } from './supabase';

/**
 * Mirrors supabase/seed.sql so `next dev` renders real catalog content when
 * .env.local's placeholder Supabase URL can't be reached — without this, the
 * printers/equipment catalogs and every product detail page only ever show
 * their error state locally, which makes visual QA on the catalog itself
 * impossible. Only ever read from getProducts() when NODE_ENV === 'development'
 * (see there) — never a substitute for a real error state in production,
 * where a genuine Supabase outage must still surface as an error, not silently
 * serve stale demo data to real visitors.
 */
export const DEV_FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'hp-m428fdw',
    name: 'HP LaserJet Pro MFP M428fdw',
    descEn: 'Refurbished to factory standard — a fast A4 mono multifunction built for busy offices. Print, copy, scan and fax with automatic two-sided printing and secure Wi-Fi.',
    descAr: 'مُجددة إلى معايير المصنع — طابعة أحادية اللون A4 متعددة الوظائف وسريعة، مصممة للمكاتب المزدحمة. طباعة ونسخ ومسح وفاكس مع طباعة تلقائية على الوجهين وواي فاي آمن.',
    images: [
      '/printers/HP LaserJet Pro MFP M428fdw/HP LaserJet Pro MFP M428fdw.png',
      '/printers/HP LaserJet Pro MFP M428fdw/HP LaserJet Pro MFP M428fdw2.png',
      '/printers/HP LaserJet Pro MFP M428fdw/HP LaserJet Pro MFP M428fdw3.png',
      '/printers/HP LaserJet Pro MFP M428fdw/HP LaserJet Pro MFP M428fdw4.png',
      '/printers/HP LaserJet Pro MFP M428fdw/HP LaserJet Pro MFP M428fdw5.png',
    ],
    featuresEn: ['Up to 40 ppm mono print speed', 'Automatic duplex print, copy & scan', '50-sheet ADF · 250-sheet input tray', 'Wi-Fi, Ethernet & USB · mobile print', '12-month FNG refurbishment warranty'],
    featuresAr: ['سرعة طباعة تصل إلى 40 صفحة/دقيقة', 'طباعة ونسخ ومسح تلقائي على الوجهين', 'وحدة تغذية 50 ورقة · درج إدخال 250 ورقة', 'واي فاي وإيثرنت و USB · طباعة من الجوال', 'ضمان تجديد FNG لمدة 12 شهراً'],
    specsEn: { 'Functions': 'Print, Copy, Scan, Fax', 'Print speed': 'Up to 40 ppm', 'Print quality': '1200 x 1200 dpi', 'Paper size': 'A4 / Letter', 'Connectivity': 'Wi-Fi, Ethernet, USB', 'Duty cycle': 'Up to 80,000 pages/mo' },
    specsAr: { 'الوظائف': 'طباعة، نسخ، مسح، فاكس', 'سرعة الطباعة': 'حتى 40 صفحة/دقيقة', 'جودة الطباعة': '1200 × 1200 نقطة/بوصة', 'حجم الورق': 'A4 / Letter', 'الاتصال': 'واي فاي، إيثرنت، USB', 'دورة التشغيل': 'حتى 80,000 صفحة/شهر' },
    available: true,
  },
  {
    id: 'hp-3303fdw',
    name: 'HP Color LaserJet Pro MFP 3303fdw',
    descEn: 'Vivid, dependable colour for documents that need to look their best. A compact colour MFP with fast first-page-out and low running cost on FNG eco-toner.',
    descAr: 'ألوان زاهية وموثوقة للمستندات التي تحتاج أن تظهر بأفضل صورة. طابعة ملوّنة متعددة الوظائف ومدمجة مع إخراج سريع للصفحة الأولى وتكلفة تشغيل منخفضة مع حبر FNG البيئي.',
    images: [
      '/printers/HP Color LaserJet Pro MFP 3303fdw (499M8A)/HP Color LaserJet Pro MFP 3303fdw (499M8A).png',
      '/printers/HP Color LaserJet Pro MFP 3303fdw (499M8A)/HP Color LaserJet Pro MFP 3303fdw (499M8A)2.png',
      '/printers/HP Color LaserJet Pro MFP 3303fdw (499M8A)/HP Color LaserJet Pro MFP 3303fdw (499M8A)3.png',
      '/printers/HP Color LaserJet Pro MFP 3303fdw (499M8A)/HP Color LaserJet Pro MFP 3303fdw (499M8A)4.png',
      '/printers/HP Color LaserJet Pro MFP 3303fdw (499M8A)/HP Color LaserJet Pro MFP 3303fdw (499M8A)5.png',
    ],
    featuresEn: ['Up to 25 ppm colour & mono', 'Automatic duplex print, copy & scan', 'Single-pass 50-sheet ADF', 'Wi-Fi, Ethernet & USB · mobile print', '12-month FNG refurbishment warranty'],
    featuresAr: ['حتى 25 صفحة/دقيقة ملون وأحادي', 'طباعة ونسخ ومسح تلقائي على الوجهين', 'وحدة تغذية 50 ورقة بمسار واحد', 'واي فاي وإيثرنت و USB · طباعة من الجوال', 'ضمان تجديد FNG لمدة 12 شهراً'],
    specsEn: { 'Functions': 'Print, Copy, Scan, Fax', 'Print speed': 'Up to 25 ppm colour', 'Print quality': '600 x 600 dpi', 'Paper size': 'A4 / Letter', 'Connectivity': 'Wi-Fi, Ethernet, USB', 'Duty cycle': 'Up to 40,000 pages/mo' },
    specsAr: { 'الوظائف': 'طباعة، نسخ، مسح، فاكس', 'سرعة الطباعة': 'حتى 25 صفحة/دقيقة ملون', 'جودة الطباعة': '600 × 600 نقطة/بوصة', 'حجم الورق': 'A4 / Letter', 'الاتصال': 'واي فاي، إيثرنت، USB', 'دورة التشغيل': 'حتى 40,000 صفحة/شهر' },
    available: true,
  },
  {
    id: 'hp-m575',
    name: 'HP LaserJet Enterprise 500 Color MFP M575',
    descEn: "Enterprise-grade A4 colour workhorse with full trays, refurbished and load-tested for high-volume departments that can't afford downtime.",
    descAr: 'طابعة ملوّنة A4 بمستوى المؤسسات مع أدراج كاملة، مُجددة ومُختبرة تحت الحِمل للأقسام عالية الإنتاجية التي لا تحتمل التوقف.',
    images: ['/printers/hp-m575/hp-m575-1.png', '/printers/hp-m575/hp-m575-2.png', '/printers/hp-m575/hp-m575-3.png'],
    featuresEn: ['Up to 30 ppm colour & mono', 'Full paper-tray configuration included', 'Large colour touchscreen', 'Gigabit Ethernet & USB', '12-month FNG refurbishment warranty'],
    featuresAr: ['حتى 30 صفحة/دقيقة ملون وأحادي', 'تكوين أدراج ورق كامل مضمّن', 'شاشة لمس ملوّنة كبيرة', 'إيثرنت جيجابت و USB', 'ضمان تجديد FNG لمدة 12 شهراً'],
    specsEn: { 'Functions': 'Print, Copy, Scan, Fax', 'Print speed': 'Up to 30 ppm colour', 'Print quality': '1200 x 1200 dpi', 'Paper size': 'A4 / Letter', 'Connectivity': 'Gigabit Ethernet, USB', 'Duty cycle': 'Up to 120,000 pages/mo' },
    specsAr: { 'الوظائف': 'طباعة، نسخ، مسح، فاكس', 'سرعة الطباعة': 'حتى 30 صفحة/دقيقة ملون', 'جودة الطباعة': '1200 × 1200 نقطة/بوصة', 'حجم الورق': 'A4 / Letter', 'الاتصال': 'إيثرنت جيجابت، USB', 'دورة التشغيل': 'حتى 120,000 صفحة/شهر' },
    available: true,
  },
  {
    id: 'hp-m404dn',
    name: 'HP LaserJet Pro M404dn',
    descEn: 'A no-nonsense single-function mono printer for teams that just need fast, reliable pages. Compact footprint, network-ready, refurbished to factory standard.',
    descAr: 'طابعة أحادية اللون بسيطة وذات وظيفة واحدة للفرق التي تحتاج صفحات سريعة وموثوقة. حجم مدمج، جاهزة للشبكة، مُجددة إلى معايير المصنع.',
    images: ['/printers/hp-m404dn/hp-m404dn-1.png', '/printers/hp-m404dn/hp-m404dn-2.png', '/printers/hp-m404dn/hp-m404dn-3.png'],
    featuresEn: ['Up to 40 ppm mono print speed', 'Automatic two-sided printing', '250-sheet input tray', 'Ethernet & USB · mobile print', '12-month FNG refurbishment warranty'],
    featuresAr: ['سرعة طباعة تصل إلى 40 صفحة/دقيقة', 'طباعة تلقائية على الوجهين', 'درج إدخال 250 ورقة', 'إيثرنت و USB · طباعة من الجوال', 'ضمان تجديد FNG لمدة 12 شهراً'],
    specsEn: { 'Functions': 'Print', 'Print speed': 'Up to 40 ppm', 'Print quality': '1200 x 1200 dpi', 'Paper size': 'A4 / Letter', 'Connectivity': 'Ethernet, USB', 'Duty cycle': 'Up to 80,000 pages/mo' },
    specsAr: { 'الوظائف': 'طباعة', 'سرعة الطباعة': 'حتى 40 صفحة/دقيقة', 'جودة الطباعة': '1200 × 1200 نقطة/بوصة', 'حجم الورق': 'A4 / Letter', 'الاتصال': 'إيثرنت، USB', 'دورة التشغيل': 'حتى 80,000 صفحة/شهر' },
    available: true,
  },
  {
    id: 'hp-3301fdw',
    name: 'HP Color LaserJet Pro MFP 3301fdw',
    descEn: 'The compact colour MFP for smaller teams — the same trusted engine as the 3303, tuned for lighter monthly volumes at an entry price on FNG eco-toner.',
    descAr: 'الطابعة الملوّنة المدمجة متعددة الوظائف للفرق الأصغر — نفس المحرك الموثوق للطراز 3303، مضبوطة لأحجام شهرية أخف وبسعر مبدئي مع حبر FNG البيئي.',
    images: [
      '/printers/HP Color LaserJet Pro MFP 3303fdw (499M8A)/HP Color LaserJet Pro MFP 3303fdw (499M8A)2.png',
      '/printers/HP Color LaserJet Pro MFP 3303fdw (499M8A)/HP Color LaserJet Pro MFP 3303fdw (499M8A)4.png',
      '/printers/HP Color LaserJet Pro MFP 3303fdw (499M8A)/HP Color LaserJet Pro MFP 3303fdw (499M8A)5.png',
    ],
    featuresEn: ['Up to 22 ppm colour & mono', 'Automatic duplex print & scan', '50-sheet ADF', 'Wi-Fi, Ethernet & USB', '12-month FNG refurbishment warranty'],
    featuresAr: ['حتى 22 صفحة/دقيقة ملون وأحادي', 'طباعة ومسح تلقائي على الوجهين', 'وحدة تغذية 50 ورقة', 'واي فاي وإيثرنت و USB', 'ضمان تجديد FNG لمدة 12 شهراً'],
    specsEn: { 'Functions': 'Print, Copy, Scan, Fax', 'Print speed': 'Up to 22 ppm colour', 'Print quality': '600 x 600 dpi', 'Paper size': 'A4 / Letter', 'Connectivity': 'Wi-Fi, Ethernet, USB', 'Duty cycle': 'Up to 30,000 pages/mo' },
    specsAr: { 'الوظائف': 'طباعة، نسخ، مسح، فاكس', 'سرعة الطباعة': 'حتى 22 صفحة/دقيقة ملون', 'جودة الطباعة': '600 × 600 نقطة/بوصة', 'حجم الورق': 'A4 / Letter', 'الاتصال': 'واي فاي، إيثرنت، USB', 'دورة التشغيل': 'حتى 30,000 صفحة/شهر' },
    available: true,
  },
  {
    id: 'hp-m428fdn',
    name: 'HP LaserJet Pro MFP M428fdn',
    descEn: 'The wired sibling of the M428fdw for fleets standardised on Ethernet. Same fast mono engine, same FNG refurbishment and warranty — currently on request.',
    descAr: 'الشقيق السلكي للطراز M428fdw للأساطيل المعتمدة على إيثرنت. نفس محرك الطباعة الأحادي السريع، نفس تجديد وضمان FNG — متوفر عند الطلب حالياً.',
    images: ['/printers/hp-m428fdn/hp-m428fdn.jpg', '/printers/HP LaserJet Pro MFP M428fdw/HP LaserJet Pro MFP M428fdw2.png'],
    featuresEn: ['Up to 40 ppm mono print speed', 'Automatic duplex print, copy & scan', '50-sheet ADF · 250-sheet tray', 'Ethernet & USB', '12-month FNG refurbishment warranty'],
    featuresAr: ['سرعة طباعة تصل إلى 40 صفحة/دقيقة', 'طباعة ونسخ ومسح تلقائي على الوجهين', 'وحدة تغذية 50 ورقة · درج 250 ورقة', 'إيثرنت و USB', 'ضمان تجديد FNG لمدة 12 شهراً'],
    specsEn: { 'Functions': 'Print, Copy, Scan, Fax', 'Print speed': 'Up to 40 ppm', 'Print quality': '1200 x 1200 dpi', 'Paper size': 'A4 / Letter', 'Connectivity': 'Ethernet, USB', 'Duty cycle': 'Up to 80,000 pages/mo' },
    specsAr: { 'الوظائف': 'طباعة، نسخ، مسح، فاكس', 'سرعة الطباعة': 'حتى 40 صفحة/دقيقة', 'جودة الطباعة': '1200 × 1200 نقطة/بوصة', 'حجم الورق': 'A4 / Letter', 'الاتصال': 'إيثرنت، USB', 'دورة التشغيل': 'حتى 80,000 صفحة/شهر' },
    available: false,
  },
  {
    id: 'eq-hermanchair',
    name: 'Herman Miller Aeron (Refurbished)',
    descEn: 'Certified pre-owned ergonomic task chair, fully serviced. Office fit-out and bulk pricing available alongside your printer fleet.',
    descAr: 'كرسي مكتب مريح مُعتمد ومُستعمل، تمت صيانته بالكامل. تجهيز مكتبي وأسعار الجملة متوفرة إلى جانب أسطول طابعاتك.',
    images: ['/herman_chair.png'],
    featuresEn: ['Fully serviced & sanitised', 'Ergonomic lumbar support', 'Bulk & office fit-out pricing', 'Delivered and installed'],
    featuresAr: ['تمت صيانته وتعقيمه بالكامل', 'دعم قطني مريح', 'أسعار الجملة وتجهيز المكاتب', 'التوصيل والتركيب'],
    specsEn: { 'Category': 'Office seating', 'Condition': 'Certified refurbished', 'Warranty': '6 months' },
    specsAr: { 'الفئة': 'أثاث مكتبي', 'الحالة': 'مُجدد ومُعتمد', 'الضمان': '6 أشهر' },
    available: true,
  },
];
