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

function isAdmin(request, env) {
  const token = env.CHUFIX_COMMENTS_ADMIN_TOKEN;
  if (!token) return false;
  if (request.headers.get('x-chufix-admin-token') === token) return true;
  return hasValidAdminSession(request, token);
}

function getCookie(request, name) {
  const cookie = request.headers.get('cookie') || '';
  for (const part of cookie.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return '';
}

function base64urlDecode(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

function base64urlEncode(bytes) {
  const binary = String.fromCharCode(...bytes);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function signSessionPayload(payload, secret) {
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

async function hasValidAdminSession(request, token) {
  const session = getCookie(request, 'chufix_comments_session');
  const [payload, signature] = session.split('.');
  if (!payload || !signature) return false;
  const expected = await signSessionPayload(payload, token);
  if (signature !== expected) return false;

  try {
    const data = JSON.parse(new TextDecoder().decode(base64urlDecode(payload)));
    return data.role === 'admin' && typeof data.exp === 'number' && data.exp > Date.now();
  } catch {
    return false;
  }
}

async function ensureSchema(db) {
  await db.batch([
    db.prepare(`
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        page_id TEXT NOT NULL,
        parent_id TEXT,
        author TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        content TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        ip_hash TEXT,
        user_agent TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `),
    db.prepare('CREATE INDEX IF NOT EXISTS comments_page_status_idx ON comments (page_id, status, created_at)'),
    db.prepare('CREATE INDEX IF NOT EXISTS comments_parent_idx ON comments (parent_id)'),
  ]);
}

function cleanText(value, max) {
  return String(value || '').trim().replace(/\s+\n/g, '\n').slice(0, max);
}

async function hashIp(request, env) {
  const ip = request.headers.get('cf-connecting-ip') || '';
  if (!ip) return null;
  const salt = env.CHUFIX_COMMENTS_IP_SALT || 'chufix-comments';
  const bytes = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function mapComment(row) {
  return {
    id: row.id,
    pageId: row.page_id,
    parentId: row.parent_id,
    author: row.author,
    role: row.role,
    content: row.content,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ipHash: row.ip_hash,
    userAgent: row.user_agent,
  };
}

export function onRequestOptions() {
  return json({ ok: true });
}

export async function onRequestGet({ request, env }) {
  const db = getDb(env);
  if (!db) {
    return json({ ok: false, code: 'COMMENTS_DB_NOT_BOUND', comments: [] });
  }

  await ensureSchema(db);

  const url = new URL(request.url);
  const admin = await isAdmin(request, env);
  const adminMode = admin && url.searchParams.get('admin') === '1';
  const pageId = cleanText(url.searchParams.get('pageId'), 180);
  const requestedStatus = adminMode
    ? cleanText(url.searchParams.get('status') || 'pending', 24)
    : 'approved';
  const status = ['pending', 'approved', 'rejected', 'all'].includes(requestedStatus)
    ? requestedStatus
    : 'pending';

  if (!pageId && !adminMode) {
    return json({ ok: false, error: 'pageId is required' }, { status: 400 });
  }

  let query;
  if (adminMode && !pageId && status === 'all') {
    query = db.prepare(`
      SELECT * FROM comments
      ORDER BY created_at DESC
      LIMIT 100
    `);
  } else if (adminMode && !pageId) {
    query = db.prepare(`
      SELECT * FROM comments
      WHERE status = ?
      ORDER BY created_at DESC
      LIMIT 100
    `).bind(status);
  } else {
    query = db.prepare(`
      SELECT * FROM comments
      WHERE page_id = ? AND status = ?
      ORDER BY created_at ASC
      LIMIT 100
    `).bind(pageId, status);
  }

  const { results } = await query.all();
  return json({ ok: true, comments: (results || []).map(mapComment) });
}

export async function onRequestPost({ request, env }) {
  const db = getDb(env);
  if (!db) {
    return json({ ok: false, code: 'COMMENTS_DB_NOT_BOUND' });
  }

  await ensureSchema(db);

  const body = await request.json().catch(() => null);
  const pageId = cleanText(body?.pageId, 180);
  const parentId = cleanText(body?.parentId, 80) || null;
  const author = cleanText(body?.author, 40);
  const content = cleanText(body?.content, 1200);

  if (!pageId || !author || !content) {
    return json({ ok: false, error: 'pageId, author and content are required' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const role = 'user';
  const status = 'pending';
  const ipHash = await hashIp(request, env);
  const userAgent = cleanText(request.headers.get('user-agent'), 240);

  await db.prepare(`
    INSERT INTO comments (
      id, page_id, parent_id, author, role, content, status, ip_hash, user_agent, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    pageId,
    parentId,
    author,
    role,
    content,
    status,
    ipHash,
    userAgent,
    now,
    now,
  ).run();

  return json({
    ok: true,
    comment: {
      id,
      pageId,
      parentId,
      author,
      role,
      content,
      status,
      createdAt: now,
      updatedAt: now,
    },
  }, { status: 201 });
}

export async function onRequestPatch({ request, env }) {
  const db = getDb(env);
  if (!db) {
    return json({ ok: false, code: 'COMMENTS_DB_NOT_BOUND' });
  }
  if (!(await isAdmin(request, env))) {
    return json({ ok: false, error: 'Admin token required' }, { status: 403 });
  }

  await ensureSchema(db);

  const body = await request.json().catch(() => null);
  const action = cleanText(body?.action, 24);
  const now = new Date().toISOString();

  if (action === 'reply') {
    const pageId = cleanText(body?.pageId, 180);
    const parentId = cleanText(body?.parentId, 80);
    const author = cleanText(body?.author || 'ChuFix Maintainer', 40);
    const content = cleanText(body?.content, 1200);
    if (!pageId || !parentId || !content) {
      return json({ ok: false, error: 'pageId, parentId and content are required' }, { status: 400 });
    }
    const id = crypto.randomUUID();
    await db.prepare(`
      INSERT INTO comments (
        id, page_id, parent_id, author, role, content, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, 'admin', ?, 'approved', ?, ?)
    `).bind(id, pageId, parentId, author, content, now, now).run();
    return json({ ok: true, id });
  }

  const id = cleanText(body?.id, 80);
  const nextStatus = action === 'approve'
    ? 'approved'
    : action === 'reject'
      ? 'rejected'
      : action === 'pending'
        ? 'pending'
        : '';
  if (!id || !nextStatus) {
    return json({ ok: false, error: 'Valid id and action are required' }, { status: 400 });
  }

  await db.prepare('UPDATE comments SET status = ?, updated_at = ? WHERE id = ?')
    .bind(nextStatus, now, id)
    .run();

  return json({ ok: true, id, status: nextStatus });
}
