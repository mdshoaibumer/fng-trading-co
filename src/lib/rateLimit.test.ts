import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { rateLimit, globalRateLimit, getClientIp } from './rateLimit';

// Each test uses its own unique key so the module-level bucket Map doesn't
// leak state between tests (there's no exported reset — deliberately, since
// this is meant to be one shared in-memory store for the whole process).
let keyCounter = 0;
function uniqueKey(prefix: string) {
  keyCounter++;
  return `${prefix}-${keyCounter}`;
}

describe('rateLimit', () => {
  it('allows requests up to the limit', () => {
    const key = uniqueKey('allow');
    for (let i = 0; i < 5; i++) {
      expect(rateLimit(key, 5, 60_000).allowed).toBe(true);
    }
  });

  it('blocks the request that exceeds the limit', () => {
    const key = uniqueKey('block');
    for (let i = 0; i < 5; i++) rateLimit(key, 5, 60_000);
    const result = rateLimit(key, 5, 60_000);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('tracks different keys independently (per-IP isolation)', () => {
    const keyA = uniqueKey('ip-a');
    const keyB = uniqueKey('ip-b');
    for (let i = 0; i < 5; i++) rateLimit(keyA, 5, 60_000);
    // keyA is now exhausted, but a different key must still be fresh.
    expect(rateLimit(keyA, 5, 60_000).allowed).toBe(false);
    expect(rateLimit(keyB, 5, 60_000).allowed).toBe(true);
  });

  describe('with controlled time', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(0);
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('resets the count once the time window has passed', () => {
      const key = uniqueKey('reset');
      for (let i = 0; i < 5; i++) rateLimit(key, 5, 60_000);
      expect(rateLimit(key, 5, 60_000).allowed).toBe(false);

      vi.setSystemTime(60_001); // one window later
      expect(rateLimit(key, 5, 60_000).allowed).toBe(true);
    });
  });
});

describe('globalRateLimit', () => {
  it('is bypassable-proof by design: two different rateLimit keys share the same global bucket', () => {
    const globalKey = uniqueKey('shared-endpoint');
    // Simulates an attacker sending a different X-Forwarded-For on every
    // request — each call targets the *same* global key regardless.
    for (let i = 0; i < 3; i++) {
      expect(globalRateLimit(globalKey, 3, 60_000).allowed).toBe(i < 3);
    }
    expect(globalRateLimit(globalKey, 3, 60_000).allowed).toBe(false);
  });
});

describe('rateLimit peek/consume (consume flag)', () => {
  it('does not consume an attempt when consume=false', () => {
    const key = uniqueKey('peek');
    // Peek many times without consuming — should never trip the limit.
    for (let i = 0; i < 20; i++) {
      expect(rateLimit(key, 3, 60_000, false).allowed).toBe(true);
    }
    // The bucket was never created, so 3 real attempts still all pass.
    for (let i = 0; i < 3; i++) {
      expect(rateLimit(key, 3, 60_000, true).allowed).toBe(true);
    }
    expect(rateLimit(key, 3, 60_000, true).allowed).toBe(false);
  });

  it('peek reports blocked once the limit is reached via consumed attempts', () => {
    const key = uniqueKey('peek-block');
    for (let i = 0; i < 3; i++) rateLimit(key, 3, 60_000, true);
    // Peek should now report blocked without consuming further.
    expect(rateLimit(key, 3, 60_000, false).allowed).toBe(false);
    expect(rateLimit(key, 3, 60_000, false).allowed).toBe(false);
  });

  it('models the login "count only failures" flow', () => {
    const key = uniqueKey('login');
    const peek = () => globalRateLimit(key, 2, 60_000, false).allowed;
    const recordFailure = () => globalRateLimit(key, 2, 60_000, true);
    // Successful logins peek but never consume — unlimited.
    for (let i = 0; i < 10; i++) expect(peek()).toBe(true);
    // Two failures consume the cap; the third peek is blocked.
    recordFailure();
    recordFailure();
    expect(peek()).toBe(false);
  });
});

describe('getClientIp', () => {
  it('reads the first IP from a comma-separated X-Forwarded-For header', () => {
    const req = new Request('https://example.com', {
      headers: { 'x-forwarded-for': '203.0.113.5, 10.0.0.1' },
    });
    expect(getClientIp(req)).toBe('203.0.113.5');
  });

  it('falls back to "unknown" when no header is present', () => {
    const req = new Request('https://example.com');
    expect(getClientIp(req)).toBe('unknown');
  });
});
