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
);

CREATE INDEX IF NOT EXISTS comments_page_status_idx
  ON comments (page_id, status, created_at);

CREATE INDEX IF NOT EXISTS comments_parent_idx
  ON comments (parent_id);

CREATE INDEX IF NOT EXISTS comments_status_created_idx
  ON comments (status, created_at);

CREATE INDEX IF NOT EXISTS comments_ip_created_idx
  ON comments (ip_hash, created_at);

CREATE TABLE IF NOT EXISTS comment_terms (
  id TEXT PRIMARY KEY,
  phrase TEXT NOT NULL UNIQUE,
  action TEXT NOT NULL DEFAULT 'review',
  enabled INTEGER NOT NULL DEFAULT 1,
  note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS comment_terms_enabled_idx
  ON comment_terms (enabled, action);
