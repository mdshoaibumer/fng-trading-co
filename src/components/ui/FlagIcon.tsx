import Image from 'next/image';

/**
 * Real flag artwork (from the MIT-licensed `flag-icons` project, vendored as
 * static SVGs in public/flags/) — not the emoji glyph. Windows has no font
 * coverage for regional-indicator flag sequences, so 🇸🇦/🇮🇳/etc. render as
 * two plain letters there instead of a flag; this renders correctly on every
 * platform.
 */
export default function FlagIcon({ code, size = 24 }: { code: string; size?: number }) {
  return (
    <Image
      src={`/flags/${code.toLowerCase()}.svg`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size * 0.75}
      unoptimized
      style={{ borderRadius: '3px', boxShadow: '0 0 0 1px rgba(0,0,0,0.08)', flexShrink: 0, objectFit: 'cover' }}
    />
  );
}
