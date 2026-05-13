export const USER_COOKIE = 'chufix_comments_user';
export const USER_MAX_AGE = 60 * 60 * 24 * 30;

export function cookieOptions(request, maxAge = USER_MAX_AGE) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

export function getCookie(request, name) {
  const cookie = request.headers.get('cookie') || '';
  for (const part of cookie.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return '';
}

export function base64urlEncode(bytes) {
  const binary = String.fromCharCode(...bytes);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function base64urlEncodeText(value) {
  return base64urlEncode(new TextEncoder().encode(value));
}

export function base64urlDecode(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

export function getUserSecret(env) {
  return env.CHUFIX_COMMENTS_USER_SECRET || env.CHUFIX_COMMENTS_ADMIN_TOKEN || '';
}

export async function sign(payload, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(payload),
  );
  return base64urlEncode(new Uint8Array(signature));
}

export async function createUserSession(user, secret) {
  const payload = base64urlEncodeText(JSON.stringify({
    sub: user.id,
    role: 'user',
    exp: Date.now() + USER_MAX_AGE * 1000,
  }));
  return `${payload}.${await sign(payload, secret)}`;
}

export async function verifyUserSession(request, secret) {
  if (!secret) return null;
  const session = getCookie(request, USER_COOKIE);
  const [payload, signature] = session.split('.');
  if (!payload || !signature) return null;
  if (signature !== await sign(payload, secret)) return null;

  try {
    const data = JSON.parse(new TextDecoder().decode(base64urlDecode(payload)));
    if (data.role !== 'user' || typeof data.sub !== 'string') return null;
    if (typeof data.exp !== 'number' || data.exp <= Date.now()) return null;
    return data.sub;
  } catch {
    return null;
  }
}

export async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: new TextEncoder().encode(salt),
      iterations: 120000,
    },
    key,
    256,
  );
  return base64urlEncode(new Uint8Array(bits));
}
