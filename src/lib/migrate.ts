import { supabaseAdmin as supabase } from './supabase';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function migrate() {
  console.log('Starting migration to Supabase...');

  // 1. Migrate Printers
  try {
    const printersPath = path.join(process.cwd(), 'src', 'lib', 'printers.json');
    const printersData = JSON.parse(await fs.readFile(printersPath, 'utf-8'));
    
    const formattedPrinters = printersData.map((p: any) => ({
      id: p.id,
      name: p.name,
      desc_en: p.descEn,
      desc_ar: p.descAr,
      images: p.images,
      features_en: p.featuresEn,
      features_ar: p.featuresAr,
      specs_en: p.specsEn,
      specs_ar: p.specsAr,
      available: p.available ?? true
    }));

    const { error: pError } = await supabase.from('printers').upsert(formattedPrinters);
    if (pError) throw pError;
    console.log('✅ Printers migrated.');
  } catch (err) {
    console.error('❌ Printer migration failed:', err);
  }

  // 2. Migrate Parts
  try {
    const partsPath = path.join(process.cwd(), 'src', 'lib', 'parts.json');
    const partsData = JSON.parse(await fs.readFile(partsPath, 'utf-8'));
    
    const formattedParts: any[] = [];
    Object.entries(partsData).forEach(([category, items]: [string, any]) => {
      items.forEach((item: any) => {
        formattedParts.push({
          category,
          name_en: item.nameEn,
          name_ar: item.nameAr,
          models: item.models
        });
      });
    });

    const { error: ptError } = await supabase.from('parts').upsert(formattedParts);
    if (ptError) throw ptError;
    console.log('✅ Parts migrated.');
  } catch (err) {
    console.error('❌ Parts migration failed:', err);
  }

  // 3. Migrate Settings/Config
  try {
    const configPath = path.join(process.cwd(), 'src', 'lib', 'config.json');
    const configData = JSON.parse(await fs.readFile(configPath, 'utf-8'));
    
    const formattedSettings = Object.entries(configData).map(([key, value]) => ({
      key,
      value
    }));

    const { error: sError } = await supabase.from('settings').upsert(formattedSettings);
    if (sError) throw sError;
    console.log('✅ Settings migrated.');
  } catch (err) {
    console.error('❌ Settings migration failed:', err);
  }

  console.log('Migration complete!');
}

migrate();
