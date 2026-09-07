// Tiny module-level registry of "the current admin page has unsaved edits".
// AdminShell reads it to guard sidebar navigation; pages set it through the
// useUnsavedChanges hook. Module scope (not React context) so a plain
// event handler in AdminShell can check it synchronously on a link click.

let dirty = false;

export const setAdminDirty = (value: boolean) => { dirty = value; };

export const isAdminDirty = () => dirty;

/**
 * Returns true if it is safe to navigate away — either nothing is dirty, or the
 * user confirmed discarding their changes. Call from a nav click handler and
 * preventDefault() when it returns false.
 */
export const confirmDiscardIfDirty = (): boolean => {
  if (!dirty) return true;
  if (typeof window === 'undefined') return true;
  const ok = window.confirm('You have unsaved changes. Leave this page and discard them?');
  if (ok) dirty = false; // committing to leave — don't re-prompt on the way out
  return ok;
};
