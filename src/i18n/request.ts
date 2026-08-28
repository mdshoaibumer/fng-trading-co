import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { supabaseAdmin } from '@/lib/supabase';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Recursively layers `override` on top of `base`, key by key, instead of
// replacing whole namespaces. This keeps newly added keys in messages/*.json
// visible even when the DB row (admin-edited via the content editor) predates
// them, while still letting the DB override any key it does define.
function deepMerge(base: Record<string, unknown>, override: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    const overrideValue = override[key];
    const baseValue = result[key];
    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key] = deepMerge(baseValue, overrideValue);
    } else {
      result[key] = overrideValue;
    }
  }
  return result;
}

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
