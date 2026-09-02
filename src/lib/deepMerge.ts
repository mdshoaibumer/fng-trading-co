export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Recursively layers `override` on top of `base`, key by key, instead of
// replacing whole namespaces. Used to layer admin-edited translations (DB) on
// the shipped messages/*.json so newly added keys never vanish, and to give
// the content editor a complete baseline even before anything was saved.
export function deepMerge(base: Record<string, unknown>, override: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    // Never merge prototype-polluting keys from the DB-sourced content blob.
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
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
