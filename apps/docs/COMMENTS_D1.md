# ChuFix Docs comments on Cloudflare D1

The docs site uses Cloudflare Pages Functions under `apps/docs/functions` and a D1 binding named `CHUFIX_COMMENTS_DB`.

## Cloudflare Pages build

Use the monorepo repository as the Pages source.

```txt
Root directory: apps/docs
Build command: cd ../.. && pnpm install --frozen-lockfile && pnpm build:pages
Build output directory: dist
```

Recommended environment variables:

```txt
NODE_VERSION=22.16.0
PNPM_VERSION=9.12.0
SKIP_DEPENDENCY_INSTALL=1
```

## Create and bind D1

Create the remote database:

```bash
cd apps/docs
pnpm dlx wrangler d1 create chufix-comments
```

In Cloudflare Pages, open the project and add a D1 binding:

```txt
Settings -> Bindings -> Add -> D1 database
Variable name: CHUFIX_COMMENTS_DB
D1 database: chufix-comments
```

Then redeploy the Pages project.

## Apply schema

For production:

```bash
cd apps/docs
pnpm dlx wrangler d1 migrations apply chufix-comments --remote
```

For local development, copy `wrangler.example.toml` to `wrangler.toml`, replace `database_id`, then run:

```bash
cd apps/docs
pnpm dlx wrangler d1 migrations apply chufix-comments --local
pnpm build
pnpm dlx wrangler pages dev dist
```

## Required secrets and moderation options

Set these in Cloudflare Pages environment variables:

```txt
CHUFIX_COMMENTS_ADMIN_TOKEN=long-random-admin-password
CHUFIX_COMMENTS_IP_SALT=long-random-ip-hash-salt
```

Optional filters:

```txt
CHUFIX_COMMENTS_BLOCKED_WORDS=word1,word2
CHUFIX_COMMENTS_REVIEW_WORDS=word3,word4
CHUFIX_COMMENTS_MAX_LINKS=2
CHUFIX_COMMENTS_RATE_LIMIT_MAX=5
CHUFIX_COMMENTS_RATE_LIMIT_WINDOW=600
```

Blocked words are stored as rejected but the public API returns a generic pending result. Review words remain pending for admin moderation.

You can also store moderation terms in D1:

```sql
INSERT INTO comment_terms (id, phrase, action, enabled, note, created_at, updated_at)
VALUES ('term-1', 'example', 'reject', 1, 'manual rule', datetime('now'), datetime('now'));
```

Admin moderation lives at `/admin/comments/`.
