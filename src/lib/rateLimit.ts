// Simple in-memory rate limiter. Hostinger runs this app as a single
// persistent Node process (not serverless/edge), so a module-level Map
// is a valid, dependency-free way to throttle abuse per route+IP.
// Limitation: resets on process restart and does not share state across
// multiple instances — acceptable for this app's current scale.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_TRACKED_KEYS = 5000;

function sweepExpired(now: number) {
  if (buckets.size < MAX_TRACKED_KEYS) return;
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  sweepExpired(now);

  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count++;
  return { allowed: true };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return 'unknown';
}

export function tooManyRequests(retryAfterSeconds?: number) {
  return Response.json(
    { error: 'Too many requests. Please try again shortly.' },
    {
      status: 429,
      headers: retryAfterSeconds ? { 'Retry-After': String(retryAfterSeconds) } : undefined,
    }
  );
}
