import {
  USER_COOKIE,
  cookieOptions,
  createUserSession,
  getUserSecret,
  hashPassword,
  verifyUserSession,
} from './comments-auth.js';

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

function getDb(env) {
  return env.CHUFIX_COMMENTS_DB || env.COMMENTS_DB || null;
}

function cleanText(value, max) {
  return String(value || '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .trim()
    .slice(0, max);
}

function cleanEmail(value) {
  return cleanText(value, 160).toLowerCase();
}

export function publicUser(row) {
  return {
    id: row.id,
    displayName: row.display_name,
    email: row.email,
    createdAt: row.created_at,
  };
}

export async function ensureUserSchema(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS comment_users (
      id TEXT PRIMARY KEY,
      display_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `).run();
  await db.prepare('CREATE INDEX IF NOT EXISTS comment_users_email_idx ON comment_users (email)').run();
}

export function onRequestOptions() {
  return json({ ok: true });
}

export async function onRequestGet({ request, env }) {
  const db = getDb(env);
  const secret = getUserSecret(env);
  if (!db) return json({ ok: false, code: 'COMMENTS_DB_NOT_BOUND', authenticated: false });
  if (!secret) return json({ ok: true, authenticated: false, code: 'USER_SECRET_NOT_CONFIGURED' });

  await ensureUserSchema(db);
  const userId = await verifyUserSession(request, secret);
  if (!userId) return json({ ok: true, authenticated: false });

  const row = await db.prepare(`
    SELECT id, display_name, email, created_at
    FROM comment_users
    WHERE id = ?
    LIMIT 1
  `).bind(userId).first();

  return json({ ok: true, authenticated: Boolean(row), user: row ? publicUser(row) : null });
}

export async function onRequestPost({ request, env }) {
  const db = getDb(env);
  const secret = getUserSecret(env);
  if (!db) return json({ ok: false, code: 'COMMENTS_DB_NOT_BOUND' }, { status: 503 });
  if (!secret) return json({ ok: false, code: 'USER_SECRET_NOT_CONFIGURED' }, { status: 503 });

  await ensureUserSchema(db);
  const body = await request.json().catch(() => null);
  const action = cleanText(body?.action || 'login', 16);
  const email = cleanEmail(body?.email);
  const password = String(body?.password || '');
  const displayName = cleanText(body?.displayName, 40);

  if (!email || !password || !email.includes('@')) {
    return json({ ok: false, error: 'Email and password are required.' }, { status: 400 });
  }
  if (password.length < 6) {
    return json({ ok: false, error: 'Password must be at least 6 characters.' }, { status: 400 });
  }

  let row = await db.prepare(`
    SELECT id, display_name, email, password_hash, password_salt, created_at
    FROM comment_users
    WHERE email = ?
    LIMIT 1
  `).bind(email).first();

  if (action === 'register') {
    if (row) return json({ ok: false, code: 'EMAIL_EXISTS' }, { status: 409 });
    if (!displayName) {
      return json({ ok: false, error: 'Display name is required.' }, { status: 400 });
    }
    const now = new Date().toISOString();
    const salt = crypto.randomUUID();
    row = {
      id: crypto.randomUUID(),
      display_name: displayName,
      email,
      password_hash: await hashPassword(password, salt),
      password_salt: salt,
      created_at: now,
    };
    await db.prepare(`
      INSERT INTO comment_users (
        id, display_name, email, password_hash, password_salt, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(row.id, row.display_name, row.email, row.password_hash, row.password_salt, now, now).run();
  } else if (!row) {
    return json({ ok: false, code: 'INVALID_CREDENTIALS' }, { status: 401 });
  }

  const passwordHash = await hashPassword(password, row.password_salt);
  if (passwordHash !== row.password_hash) {
    return json({ ok: false, code: 'INVALID_CREDENTIALS' }, { status: 401 });
  }

  return json(
    { ok: true, authenticated: true, user: publicUser(row) },
    {
      headers: {
        'set-cookie': `${USER_COOKIE}=${await createUserSession(row, secret)}; ${cookieOptions(request)}`,
      },
    },
  );
}

export function onRequestDelete({ request }) {
  return json(
    { ok: true, authenticated: false },
    {
      headers: {
        'set-cookie': `${USER_COOKIE}=; ${cookieOptions(request, 0)}`,
      },
    },
  );
}
