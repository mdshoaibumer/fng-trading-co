'use client';

import { useEffect } from 'react';
import { setAdminDirty } from './adminDirty';

/**
 * Guards against losing buffered edits. While `isDirty` is true it:
 *  - warns on a browser-level unload (tab close, refresh, back button, or a
 *    navigation to a non-app URL) via `beforeunload`, and
 *  - keeps the shared admin-dirty flag in sync so AdminShell's sidebar links
 *    can confirm before an in-app client navigation throws the edits away.
 */
export function useUnsavedChanges(isDirty: boolean) {
  useEffect(() => {
    setAdminDirty(isDirty);
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        // Legacy browsers require returnValue to be set to trigger the prompt.
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => {
      window.removeEventListener('beforeunload', handler);
      setAdminDirty(false);
    };
  }, [isDirty]);
}
