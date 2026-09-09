import type { PartsData } from './supabase';

/** Mirrors supabase/seed.sql's `parts` rows — same reasoning as
 * devFallbackProducts.ts: without this, the printer-parts catalog only ever
 * shows its error state locally. Dev-only, gated in the API route. */
export const DEV_FALLBACK_PARTS: PartsData = {
  fuser: [
    { nameEn: 'Fuser Unit (Complete)', nameAr: 'وحدة التثبيت الحراري (كاملة)', models: 'M402, M404, M428, M575, 3303fdw' },
    { nameEn: 'Fuser Film Sleeve', nameAr: 'غلاف فيلم التثبيت', models: 'M402, M404, M426' },
    { nameEn: 'Pressure Roller', nameAr: 'أسطوانة الضغط', models: 'M400 / M500 Series' },
    { nameEn: 'Fuser Gear Kit', nameAr: 'طقم تروس التثبيت', models: 'M402, M426, M428' },
  ],
  pickup: [
    { nameEn: 'Paper Pickup Roller', nameAr: 'أسطوانة سحب الورق', models: 'M402, M404, M428, M575' },
    { nameEn: 'Separation Pad', nameAr: 'وسادة الفصل', models: 'M402, M404, M426, M428' },
    { nameEn: 'Feed Roller Assembly', nameAr: 'مجموعة أسطوانة التغذية', models: 'M575, M551, 3303fdw' },
    { nameEn: 'Tray 2 Roller Kit', nameAr: 'طقم أسطوانات الدرج ٢', models: 'M402, M404, M428' },
  ],
  transfer: [
    { nameEn: 'Transfer Belt (ITB)', nameAr: 'حزام النقل (ITB)', models: 'M575, M551, 3303fdw' },
    { nameEn: 'Transfer Roller', nameAr: 'أسطوانة النقل', models: 'M402, M404, M426, M428' },
    { nameEn: 'Secondary Transfer Roller', nameAr: 'أسطوانة النقل الثانوية', models: 'M575, M551' },
  ],
  drum: [
    { nameEn: 'OPC Drum', nameAr: 'أسطوانة OPC', models: 'All HP LaserJet' },
    { nameEn: 'Drum Unit (Complete)', nameAr: 'وحدة الأسطوانة (كاملة)', models: 'M402, M404, M428' },
    { nameEn: 'Imaging Drum Kit', nameAr: 'طقم أسطوانة التصوير', models: 'M575, M551, 3303fdw' },
    { nameEn: 'Developer Unit', nameAr: 'وحدة التظهير', models: 'M575, M551' },
  ],
  formatter: [
    { nameEn: 'Formatter Board', nameAr: 'لوحة المعالج', models: 'M402, M404, M428, M575' },
    { nameEn: 'Power Supply Board', nameAr: 'لوحة التغذية الكهربائية', models: 'M402, M404, M426' },
    { nameEn: 'DC Controller Board', nameAr: 'لوحة التحكم DC', models: 'M575, M551' },
    { nameEn: 'Engine Control Board', nameAr: 'لوحة التحكم بالمحرك', models: 'M402, M428' },
  ],
  scanner: [
    { nameEn: 'ADF Roller Kit', nameAr: 'طقم أسطوانات ADF', models: 'M428, M575, 3303fdw' },
    { nameEn: 'Scanner Glass Assembly', nameAr: 'مجموعة زجاج الماسح', models: 'M428, M575, 3303fdw' },
    { nameEn: 'Flatbed Scanner Cable', nameAr: 'كابل الماسح المسطح', models: 'M428, M575' },
    { nameEn: 'ADF Separation Pad', nameAr: 'وسادة فصل ADF', models: 'M428, M575, 3303fdw' },
  ],
  trays: [
    { nameEn: 'Paper Tray Cassette (Tray 2)', nameAr: 'درج ورق (الدرج ٢)', models: 'M402, M404, M428' },
    { nameEn: 'Multipurpose (MP) Tray', nameAr: 'الدرج متعدد الأغراض', models: 'M575, M551' },
    { nameEn: 'Output Bin Assembly', nameAr: 'مجموعة صندوق الإخراج', models: 'M402, M404, M428' },
    { nameEn: 'Front Cover / Access Door', nameAr: 'الغطاء الأمامي', models: 'M400 / M500 Series' },
    { nameEn: 'Rear Cover Assembly', nameAr: 'مجموعة الغطاء الخلفي', models: 'M402, M404' },
  ],
  maintenance: [
    { nameEn: 'Maintenance Kit (Fuser + Rollers + Pads)', nameAr: 'طقم صيانة كامل', models: 'M402, M404' },
    { nameEn: 'LaserJet MFP Maintenance Kit', nameAr: 'طقم صيانة LaserJet MFP', models: 'M428, M575, 3303fdw' },
    { nameEn: 'ADF Maintenance Kit', nameAr: 'طقم صيانة ADF', models: 'M428, M575' },
  ],
};
