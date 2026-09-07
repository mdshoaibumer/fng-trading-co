import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * True once the component has hydrated on the client, false during SSR and
 * the initial hydration pass. Use this instead of the `useState(false)` +
 * `useEffect(() => setMounted(true), [])` idiom — useSyncExternalStore is
 * the React-blessed primitive for this exact server/client boundary case,
 * and unlike the effect version it doesn't trigger a synchronous setState
 * from inside an effect.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
