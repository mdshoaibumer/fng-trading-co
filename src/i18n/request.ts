import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { supabaseAdmin } from '@/lib/supabase';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as 'ar' | 'en')) {
    locale = routing.defaultLocale;
  }
  
  // Fetch translations dynamically from Supabase
  let messages = {};
  try {
    const { data, error } = await supabaseAdmin
      .from('settings')
      .select('value')
      .eq('key', `content_${locale}`)
      .single();
      
    if (data && data.value) {
      messages = data.value;
    } else {
      // Fallback if DB is empty
      messages = (await import(`../../messages/${locale}.json`)).default;
    }
  } catch (err) {
    // Fallback if DB is unreachable
    console.error('Failed to fetch translations from DB, falling back to local files', err);
    messages = (await import(`../../messages/${locale}.json`)).default;
  }

  return {
    locale,
    messages,
  };
});
