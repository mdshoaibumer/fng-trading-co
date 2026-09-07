/**
 * JSON.stringify doesn't escape `</script>` sequences, so if any embedded
 * value (e.g. an admin-entered product name) ever contained one, it could
 * break out of the <script type="application/ld+json"> tag it's rendered
 * into via dangerouslySetInnerHTML. Escaping `<` to its unicode form closes
 * that without changing how any JSON-LD consumer parses the payload.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
