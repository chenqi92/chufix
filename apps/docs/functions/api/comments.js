const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
};

const COMMENT_STATUS = new Set(['pending', 'approved', 'rejected']);
const ADMIN_ACTION = new Set(['approve', 'reject', 'pending', 'reply']);
const RATE_LIMIT_WINDOW_SECONDS = 10 * 60;
const RATE_LIMIT_MAX = 5;

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

async function isAdmin(request, env) {
  const token = env.CHUFIX_COMMENTS_ADMIN_TOKEN;
  if (!token) return false;
  if (request.headers.get('x-chufix-admin-token') === token) return true;
  return hasValidAdminSession(request, token);
}

async function ensureSchema(db) {
  await db.batch([
    db.prepare(`
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        page_id TEXT NOT NULL,
        parent_id TEXT,
        author TEXT NOT NULL,
        email TEXT,
        role TEXT NOT NULL DEFAULT 'user',
        content TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        moderation_reason TEXT,
        matched_terms TEXT,
        ip_hash TEXT,
        user_agent TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        approved_at TEXT
      )
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS comment_terms (
        id TEXT PRIMARY KEY,
        phrase TEXT NOT NULL UNIQUE,
        action TEXT NOT NULL DEFAULT 'review',
        enabled INTEGER NOT NULL DEFAULT 1,
        note TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `),
    db.prepare('CREATE INDEX IF NOT EXISTS comments_page_status_idx ON comments (page_id, status, created_at)'),
    db.prepare('CREATE INDEX IF NOT EXISTS comments_parent_idx ON comments (parent_id)'),
    db.prepare('CREATE INDEX IF NOT EXISTS comments_status_created_idx ON comments (status, created_at)'),
    db.prepare('CREATE INDEX IF NOT EXISTS comments_ip_created_idx ON comments (ip_hash, created_at)'),
    db.prepare('CREATE INDEX IF NOT EXISTS comment_terms_enabled_idx ON comment_terms (enabled, action)'),
  ]);

  const { results } = await db.prepare('PRAGMA table_info(comments)').all();
  const columns = new Set((results || []).map((item) => item.name));
  const additions = [
    ['email', 'ALTER TABLE comments ADD COLUMN email TEXT'],
    ['moderation_reason', 'ALTER TABLE comments ADD COLUMN moderation_reason TEXT'],
    ['matched_terms', 'ALTER TABLE comments ADD COLUMN matched_terms TEXT'],
    ['approved_at', 'ALTER TABLE comments ADD COLUMN approved_at TEXT'],
  ];
  for (const [name, statement] of additions) {
    if (!columns.has(name)) await db.prepare(statement).run();
  }
}

function cleanText(value, max) {
  return String(value || '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .trim()
    .replace(/[ \t]+\n/g, '\n')
    .slice(0, max);
}

function normalizeForMatch(value) {
  return cleanText(value, 4000)
    .toLowerCase()
    .replace(/[\u200b-\u200f\ufeff]/g, '')
    .replace(/\s+/g, ' ');
}

function parseList(value) {
  return String(value || '')
    .split(/[\n,，|]/g)
    .map((item) => cleanText(item, 80))
    .filter(Boolean);
}

async function hashIp(request, env) {
  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '';
  if (!ip) return null;
  const salt = env.CHUFIX_COMMENTS_IP_SALT || env.CHUFIX_COMMENTS_ADMIN_TOKEN || 'chufix-comments';
  const bytes = new TextEncoder().encode(`${salt}:${ip.split(',')[0].trim()}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function loadTerms(db, env) {
  const terms = [
    ...parseList(env.CHUFIX_COMMENTS_BLOCKED_WORDS).map((phrase) => ({ phrase, action: 'reject' })),
    ...parseList(env.CHUFIX_COMMENTS_REVIEW_WORDS).map((phrase) => ({ phrase, action: 'review' })),
  ];

  const { results } = await db.prepare(`
    SELECT phrase, action
    FROM comment_terms
    WHERE enabled = 1
  `).all();

  for (const row of results || []) {
    const phrase = cleanText(row.phrase, 80);
    const action = row.action === 'reject' ? 'reject' : 'review';
    if (phrase) terms.push({ phrase, action });
  }

  return terms;
}

async function moderateSubmission(db, env, fields) {
  const haystack = normalizeForMatch(`${fields.author}\n${fields.content}`);
  const matches = [];
  for (const term of await loadTerms(db, env)) {
    if (!term.phrase) continue;
    if (haystack.includes(normalizeForMatch(term.phrase))) {
      matches.push({ phrase: term.phrase, action: term.action });
    }
  }

  if (fields.honeypot) {
    matches.push({ phrase: 'honeypot', action: 'reject' });
  }

  const linkMatches = fields.content.match(/https?:\/\/|www\./gi) || [];
  const maxLinks = Number(env.CHUFIX_COMMENTS_MAX_LINKS || 2);
  if (linkMatches.length > maxLinks) {
    matches.push({ phrase: 'too_many_links', action: 'review' });
  }

  if (!matches.length) {
    return { status: 'pending', reason: null, matchedTerms: null };
  }

  const rejected = matches.some((item) => item.action === 'reject');
  return {
    status: rejected ? 'rejected' : 'pending',
    reason: rejected ? 'blocked_term' : 'review_term',
    matchedTerms: JSON.stringify(matches.slice(0, 20)),
  };
}

async function assertWithinRateLimit(db, ipHash, env) {
  if (!ipHash) return null;
  const limit = Number(env.CHUFIX_COMMENTS_RATE_LIMIT_MAX || RATE_LIMIT_MAX);
  const windowSeconds = Number(env.CHUFIX_COMMENTS_RATE_LIMIT_WINDOW || RATE_LIMIT_WINDOW_SECONDS);
  const since = new Date(Date.now() - windowSeconds * 1000).toISOString();
  const row = await db.prepare(`
    SELECT COUNT(*) AS count
    FROM comments
    WHERE ip_hash = ? AND created_at >= ?
  `).bind(ipHash, since).first();
  if (Number(row?.count || 0) >= limit) {
    return json(
      { ok: false, error: 'Too many comments, please try again later.' },
      { status: 429 },
    );
  }
  return null;
}

async function findDuplicate(db, ipHash, pageId, content) {
  if (!ipHash) return null;
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  return db.prepare(`
    SELECT id
    FROM comments
    WHERE ip_hash = ? AND page_id = ? AND content = ? AND created_at >= ?
    LIMIT 1
  `).bind(ipHash, pageId, content, since).first();
}

async function getParent(db, pageId, parentId) {
  if (!parentId) return null;
  return db.prepare(`
    SELECT id, page_id, parent_id, status
    FROM comments
    WHERE id = ?
    LIMIT 1
  `).bind(parentId).first().then((row) => {
    if (!row || row.page_id !== pageId || row.status !== 'approved') return null;
    return row;
  });
}

function mapComment(row, admin = false) {
  const item = {
    id: row.id,
    pageId: row.page_id,
    parentId: row.parent_id,
    author: row.author,
    role: row.role,
    content: row.content,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    approvedAt: row.approved_at,
  };

  if (admin) {
    item.email = row.email;
    item.ipHash = row.ip_hash;
    item.userAgent = row.user_agent;
    item.moderationReason = row.moderation_reason;
    item.matchedTerms = row.matched_terms;
  }

  return item;
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
  const wantsAdmin = url.searchParams.get('admin') === '1';
  if (wantsAdmin && !admin) {
    return json({ ok: false, error: 'Admin token required' }, { status: 403 });
  }
  const adminMode = wantsAdmin;
  const pageId = cleanText(url.searchParams.get('pageId'), 180);
  const requestedStatus = adminMode
    ? cleanText(url.searchParams.get('status') || 'pending', 24)
    : 'approved';
  const status = requestedStatus === 'all' || COMMENT_STATUS.has(requestedStatus)
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
      LIMIT 200
    `);
  } else if (adminMode && !pageId) {
    query = db.prepare(`
      SELECT * FROM comments
      WHERE status = ?
      ORDER BY created_at DESC
      LIMIT 200
    `).bind(status);
  } else if (adminMode && status === 'all') {
    query = db.prepare(`
      SELECT * FROM comments
      WHERE page_id = ?
      ORDER BY created_at ASC
      LIMIT 200
    `).bind(pageId);
  } else {
    query = db.prepare(`
      SELECT * FROM comments
      WHERE page_id = ? AND status = ?
      ORDER BY created_at ASC
      LIMIT 200
    `).bind(pageId, status);
  }

  const { results } = await query.all();
  return json({ ok: true, comments: (results || []).map((row) => mapComment(row, adminMode)) });
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
  const email = cleanText(body?.email, 160) || null;
  const content = cleanText(body?.content, 1200);
  const honeypot = cleanText(body?.website, 200);

  if (!pageId || !author || !content) {
    return json({ ok: false, error: 'pageId, author and content are required' }, { status: 400 });
  }
  if (parentId && !await getParent(db, pageId, parentId)) {
    return json({ ok: false, error: 'Parent comment is not available' }, { status: 400 });
  }

  const ipHash = await hashIp(request, env);
  const rateLimitResponse = await assertWithinRateLimit(db, ipHash, env);
  if (rateLimitResponse) return rateLimitResponse;

  const duplicate = await findDuplicate(db, ipHash, pageId, content);
  if (duplicate) {
    return json({ ok: true, duplicate: true, comment: { id: duplicate.id, status: 'pending' } }, { status: 202 });
  }

  const moderation = await moderateSubmission(db, env, { author, content, honeypot });
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const userAgent = cleanText(request.headers.get('user-agent'), 240);

  await db.prepare(`
    INSERT INTO comments (
      id, page_id, parent_id, author, email, role, content, status,
      moderation_reason, matched_terms, ip_hash, user_agent, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, 'user', ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    pageId,
    parentId,
    author,
    email,
    content,
    moderation.status,
    moderation.reason,
    moderation.matchedTerms,
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
      role: 'user',
      content,
      status: moderation.status === 'rejected' ? 'pending' : moderation.status,
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

  if (!ADMIN_ACTION.has(action)) {
    return json({ ok: false, error: 'Valid action is required' }, { status: 400 });
  }

  if (action === 'reply') {
    const pageId = cleanText(body?.pageId, 180);
    const parentId = cleanText(body?.parentId, 80);
    const author = cleanText(body?.author || 'ChuFix Maintainer', 40);
    const content = cleanText(body?.content, 1200);
    if (!pageId || !parentId || !content) {
      return json({ ok: false, error: 'pageId, parentId and content are required' }, { status: 400 });
    }
    if (!await getParent(db, pageId, parentId)) {
      return json({ ok: false, error: 'Parent comment is not available' }, { status: 400 });
    }
    const id = crypto.randomUUID();
    await db.prepare(`
      INSERT INTO comments (
        id, page_id, parent_id, author, role, content, status, created_at, updated_at, approved_at
      ) VALUES (?, ?, ?, ?, 'admin', ?, 'approved', ?, ?, ?)
    `).bind(id, pageId, parentId, author, content, now, now, now).run();
    return json({ ok: true, id });
  }

  const id = cleanText(body?.id, 80);
  const nextStatus = action === 'approve'
    ? 'approved'
    : action === 'reject'
      ? 'rejected'
      : 'pending';
  if (!id) {
    return json({ ok: false, error: 'id is required' }, { status: 400 });
  }

  await db.prepare(`
    UPDATE comments
    SET status = ?,
        updated_at = ?,
        approved_at = CASE WHEN ? = 'approved' THEN ? ELSE approved_at END
    WHERE id = ?
  `).bind(nextStatus, now, nextStatus, now, id).run();

  return json({ ok: true, id, status: nextStatus });
}

export async function onRequestDelete({ request, env }) {
  const db = getDb(env);
  if (!db) {
    return json({ ok: false, code: 'COMMENTS_DB_NOT_BOUND' });
  }
  if (!(await isAdmin(request, env))) {
    return json({ ok: false, error: 'Admin token required' }, { status: 403 });
  }

  await ensureSchema(db);

  const url = new URL(request.url);
  const id = cleanText(url.searchParams.get('id'), 80);
  if (!id) {
    return json({ ok: false, error: 'id is required' }, { status: 400 });
  }

  await db.batch([
    db.prepare('DELETE FROM comments WHERE parent_id = ?').bind(id),
    db.prepare('DELETE FROM comments WHERE id = ?').bind(id),
  ]);

  return json({ ok: true, id });
}
