interface LoadingStateProps {
  /** Spinner diameter and border thickness. */
  size?: number;
  /** Spinner accent color — defaults to the brand accent. */
  color?: string;
  /** Vertical padding around the spinner. */
  padding?: string;
  /** Accessible label announced to assistive tech while loading. */
  label?: string;
}

/**
 * Centered spinner used while a client-side fetch is in flight. Consolidates
 * several byte-identical ad-hoc spinner divs that existed per-component.
 *
 * It is a live region (role="status" + aria-busy) with a visually-hidden
 * label, so a spinner is announced to screen-reader users instead of loading
 * silently. Pass `label` for a localized string; defaults to English.
 */
export default function LoadingState({ size = 40, color = 'var(--accent)', padding = '40px', label = 'Loading…' }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      style={{ display: 'flex', justifyContent: 'center', padding }}
    >
      <div
        aria-hidden="true"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          border: `4px solid ${color}`,
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'ui-loading-spin 1s linear infinite',
        }}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
