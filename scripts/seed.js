require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs/promises');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL');
    process.exit(1);
}

// This writes straight to whatever Supabase project .env.local points at —
// which, for most contributors, is the same project the live site reads
// from. Dry-run by default; pass --confirm to actually write.
const CONFIRMED = process.argv.includes('--confirm');

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey);

async function main() {
    try {
        const enPath = path.join(process.cwd(), 'messages', 'en.json');
        const arPath = path.join(process.cwd(), 'messages', 'ar.json');

        const enContent = JSON.parse(await fs.readFile(enPath, 'utf-8'));
        const arContent = JSON.parse(await fs.readFile(arPath, 'utf-8'));

        if (!CONFIRMED) {
            console.log(`[dry run] Would overwrite Supabase 'settings' rows on project:\n  ${supabaseUrl}`);
            console.log(`  content_en <- messages/en.json (${Object.keys(enContent).length} top-level keys)`);
            console.log(`  content_ar <- messages/ar.json (${Object.keys(arContent).length} top-level keys)`);
            console.log('\nNo changes were made. Re-run with --confirm to actually write:');
            console.log('  node scripts/seed.js --confirm');
            return;
        }

        const { error: enError } = await supabaseAdmin.from('settings').upsert({
            key: 'content_en',
            value: enContent
        });
        if (enError) throw enError;

        const { error: arError } = await supabaseAdmin.from('settings').upsert({
            key: 'content_ar',
            value: arContent
        });
        if (arError) throw arError;

        console.log('Successfully seeded translations to Supabase');
    } catch (err) {
        console.error('Error seeding translations:', err);
    }
}

main();
