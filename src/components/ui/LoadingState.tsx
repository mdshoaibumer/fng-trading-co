interface LoadingStateProps {
  /** Spinner diameter and border thickness. */
  size?: number;
  /** Spinner accent color — defaults to the brand accent. */
  color?: string;
  /** Vertical padding around the spinner. */
  padding?: string;
}

/**
 * Centered spinner used while a client-side fetch is in flight. Consolidates
 * several byte-identical ad-hoc spinner divs that existed per-component.
 */
export default function LoadingState({ size = 40, color = 'var(--accent)', padding = '40px' }: LoadingStateProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding }}>
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          border: `4px solid ${color}`,
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'ui-loading-spin 1s linear infinite',
        }}
      />
    </div>
  );
}
