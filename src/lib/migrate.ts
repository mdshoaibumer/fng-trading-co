import { supabaseAdmin as supabase, type PartsData } from './supabase';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// This writes straight to whatever Supabase project .env.local points at —
// which, for most contributors, is the same project the live site reads
// from. Dry-run by default; pass --confirm to actually write.
const CONFIRMED = process.argv.includes('--confirm');

async function migrate() {
  console.log('Starting migration to Supabase...');
  if (!CONFIRMED) {
    console.log(`[dry run] Target project: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
    console.log('No changes will be made. Re-run with --confirm to actually write:');
    console.log('  npx tsx src/lib/migrate.ts --confirm\n');
  }

  // Printer migration removed: this ran once during the original
  // pre-Supabase -> Supabase cutover, reading from src/lib/printers.json.
  // That file (and the unused printers.ts module it backed) was deleted
  // as dead code once the migration was long complete and nothing in the
  // app imported it anymore. Parts/settings migration below still work
  // against their own JSON sources, which remain useful as a seed
  // reference.

  // 1. Migrate Parts
  try {
    const partsPath = path.join(process.cwd(), 'src', 'lib', 'parts.json');
    const partsData: PartsData = JSON.parse(await fs.readFile(partsPath, 'utf-8'));

    const formattedParts: { category: string; name_en: string; name_ar: string; models: string }[] = [];
    Object.entries(partsData).forEach(([category, items]) => {
      items.forEach((item) => {
        formattedParts.push({
          category,
          name_en: item.nameEn,
          name_ar: item.nameAr,
          models: item.models
        });
      });
    });

    if (!CONFIRMED) {
      console.log(`  [dry run] parts: would upsert ${formattedParts.length} rows`);
    } else {
      const { error: ptError } = await supabase.from('parts').upsert(formattedParts);
      if (ptError) throw ptError;
      console.log('✅ Parts migrated.');
    }
  } catch (err) {
    console.error('❌ Parts migration failed:', err);
  }

  // 2. Migrate Settings/Config
  try {
    const configPath = path.join(process.cwd(), 'src', 'lib', 'config.json');
    const configData = JSON.parse(await fs.readFile(configPath, 'utf-8'));
    
    const formattedSettings = Object.entries(configData).map(([key, value]) => ({
      key,
      value
    }));

    if (!CONFIRMED) {
      console.log(`  [dry run] settings: would upsert ${formattedSettings.length} rows`);
    } else {
      const { error: sError } = await supabase.from('settings').upsert(formattedSettings);
      if (sError) throw sError;
      console.log('✅ Settings migrated.');
    }
  } catch (err) {
    console.error('❌ Settings migration failed:', err);
  }

  console.log('Migration complete!');
}

migrate();
