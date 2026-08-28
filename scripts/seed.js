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

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey);

async function main() {
    try {
        const enPath = path.join(process.cwd(), 'messages', 'en.json');
        const arPath = path.join(process.cwd(), 'messages', 'ar.json');
        
        const enContent = JSON.parse(await fs.readFile(enPath, 'utf-8'));
        const arContent = JSON.parse(await fs.readFile(arPath, 'utf-8'));
        
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
