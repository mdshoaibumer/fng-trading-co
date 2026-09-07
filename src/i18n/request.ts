import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { supabaseAdmin } from '@/lib/supabase';
import { deepMerge } from '@/lib/deepMerge';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as 'ar' | 'en')) {
    locale = routing.defaultLocale;
  }

  const localMessages = (await import(`../../messages/${locale}.json`)).default;

  // Fetch translations dynamically from Supabase, layered on top of the
  // local file so admin edits win but newly added local keys never vanish.
  let messages: Record<string, unknown> = localMessages;
  try {
    const { data } = await supabaseAdmin
      .from('settings')
      .select('value')
      .eq('key', `content_${locale}`)
      .single();

    if (data && data.value) {
      messages = deepMerge(localMessages, data.value);
    }
  } catch (err) {
    // Fallback to local files only if DB is unreachable
    console.error('Failed to fetch translations from DB, falling back to local files', err);
  }

  return {
    locale,
    messages,
  };
});
