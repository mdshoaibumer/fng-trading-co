// Signed admin session tokens + password hashing, using the Web Crypto API
// so the same code runs in both the Edge middleware and Node route handlers.

const SESSION_MAX_AGE_MS = 60 * 60 * 24 * 7 * 1000; // 7 days
const PBKDF2_ITERATIONS = 100_000;

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is not configured');
  }
  return secret;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function createSessionToken(): Promise<string> {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_MAX_AGE_MS });
  const payloadBytes = new TextEncoder().encode(payload);
  const key = await getHmacKey(getSessionSecret());
  const signature = await crypto.subtle.sign('HMAC', key, payloadBytes);
  return `${toBase64Url(payloadBytes)}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [payloadPart, sigPart] = token.split('.');
  if (!payloadPart || !sigPart) return false;

  try {
    const payloadBytes = fromBase64Url(payloadPart);
    const key = await getHmacKey(getSessionSecret());
    const valid = await crypto.subtle.verify('HMAC', key, fromBase64Url(sigPart), payloadBytes);
    if (!valid) return false;

    const { exp } = JSON.parse(new TextDecoder().decode(payloadBytes));
    return typeof exp === 'number' && Date.now() < exp;
  } catch {
    return false;
  }
}

const HASH_PREFIX = 'pbkdf2$';

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    key,
    256
  );
  return `${HASH_PREFIX}${PBKDF2_ITERATIONS}$${toBase64Url(salt)}$${toBase64Url(new Uint8Array(bits))}`;
}

// Returns whether `password` matches `stored`. `stored` may be a legacy
// plaintext value (pre-dating hashing) — callers should re-hash and persist
// on a successful legacy match so accounts upgrade transparently over time.
export async function verifyPassword(
  password: string,
  stored: string
): Promise<{ valid: boolean; isLegacyPlaintext: boolean }> {
  if (!stored.startsWith(HASH_PREFIX)) {
    return { valid: password === stored, isLegacyPlaintext: true };
  }

  const [, iterationsStr, saltB64, hashB64] = stored.split('$');
  const iterations = Number(iterationsStr);
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: fromBase64Url(saltB64), iterations, hash: 'SHA-256' },
    key,
    256
  );
  const candidate = toBase64Url(new Uint8Array(bits));
  return { valid: candidate === hashB64, isLegacyPlaintext: false };
}
