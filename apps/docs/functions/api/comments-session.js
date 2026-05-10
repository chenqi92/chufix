const COOKIE_NAME = 'chufix_comments_session';
const MAX_AGE = 60 * 60 * 12;

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
};

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      ...JSON_HEADERS,
      ...(init.headers || {}),
    },
  });
}

function cookieOptions(request, maxAge = MAX_AGE) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

function getCookie(request, name) {
  const cookie = request.headers.get('cookie') || '';
  for (const part of cookie.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return '';
}

function base64urlEncode(bytes) {
  const binary = String.fromCharCode(...bytes);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlEncodeText(value) {
  return base64urlEncode(new TextEncoder().encode(value));
}

function base64urlDecode(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

async function sign(payload, secret) {
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

async function createSession(secret) {
  const payload = base64urlEncodeText(JSON.stringify({
    role: 'admin',
    exp: Date.now() + MAX_AGE * 1000,
  }));
  return `${payload}.${await sign(payload, secret)}`;
}

async function verifySession(request, secret) {
  const session = getCookie(request, COOKIE_NAME);
  const [payload, signature] = session.split('.');
  if (!payload || !signature) return false;
  if (signature !== await sign(payload, secret)) return false;

  try {
    const data = JSON.parse(new TextDecoder().decode(base64urlDecode(payload)));
    return data.role === 'admin' && typeof data.exp === 'number' && data.exp > Date.now();
  } catch {
    return false;
  }
}

export function onRequestOptions() {
  return json({ ok: true });
}

export async function onRequestGet({ request, env }) {
  const secret = env.CHUFIX_COMMENTS_ADMIN_TOKEN;
  if (!secret) {
    return json({ ok: false, authenticated: false, code: 'ADMIN_TOKEN_NOT_CONFIGURED' });
  }
  return json({ ok: true, authenticated: await verifySession(request, secret) });
}

export async function onRequestPost({ request, env }) {
  const secret = env.CHUFIX_COMMENTS_ADMIN_TOKEN;
  if (!secret) {
    return json(
      { ok: false, code: 'ADMIN_TOKEN_NOT_CONFIGURED' },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const token = String(body?.token || '');
  if (!token || token !== secret) {
    return json({ ok: false, error: 'Invalid admin token' }, { status: 401 });
  }

  return json(
    { ok: true, authenticated: true },
    {
      headers: {
        'set-cookie': `${COOKIE_NAME}=${await createSession(secret)}; ${cookieOptions(request)}`,
      },
    },
  );
}

export function onRequestDelete({ request }) {
  return json(
    { ok: true, authenticated: false },
    {
      headers: {
        'set-cookie': `${COOKIE_NAME}=; ${cookieOptions(request, 0)}`,
      },
    },
  );
}
