#!/usr/bin/env node
/**
 * sync-docs.mjs
 *
 * Pushes the docs (apps/docs/src) and vendored built packages
 * (packages/{tokens,icons,vue,react}) into the standalone deploy repo
 * E:/workspace-freq/chufix-docs (chenqi92/chufix-docs on GitHub).
 *
 * Why vendoring:
 *   The deploy repo is built on Cloudflare Pages, which only clones the
 *   docs repo — it has no access to the chukit monorepo siblings. The old
 *   "file:../chukit/packages/*" deps fail with ERR_PNPM_LINKED_PKG_DIR_NOT_FOUND.
 *   Vendoring puts pre-built artifacts into the deploy repo so it is
 *   self-contained and Cloudflare's pnpm install resolves locally.
 *
 * Usage:
 *   pnpm sync:docs                # build + sync src + sync vendor
 *   node scripts/sync-docs.mjs    # same
 *
 * Run from repo root.
 */
import { execSync } from 'node:child_process';
import {
  cpSync,
  rmSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const candidates = [
  process.env.CHUFIX_DOCS_PATH,
  resolve(repoRoot, '../chufix-docs'),
  resolve(repoRoot, '../../chufix-docs'),
].filter(Boolean);

const deployRoot = candidates.find((p) => existsSync(p));

if (!deployRoot) {
  console.error('deploy repo not found. Tried:');
  for (const p of candidates) console.error(`  - ${p}`);
  console.error('Set CHUFIX_DOCS_PATH or place the chufix-docs clone next to this repo.');
  process.exit(1);
}
console.log(`deploy repo: ${deployRoot}`);

/* ── 1. ensure both packages have a fresh dist/ ── */
function sh(cmd) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { cwd: repoRoot, stdio: 'inherit' });
}
sh('pnpm --filter @chufix/vue build');
sh('pnpm --filter @chufix/react build');

/* ── 2. sync apps/docs/src → chufix-docs/src ── */
const docsSrc = join(repoRoot, 'apps/docs/src');
const docsDst = join(deployRoot, 'src');
console.log(`\n• sync src: ${docsSrc} → ${docsDst}`);
rmSync(docsDst, { recursive: true, force: true });
cpSync(docsSrc, docsDst, { recursive: true });

/* ── 3. sync apps/docs/public → chufix-docs/public ── */
const publicSrc = join(repoRoot, 'apps/docs/public');
const publicDst = join(deployRoot, 'public');
if (existsSync(publicSrc)) {
  console.log(`• sync public: ${publicSrc} → ${publicDst}`);
  rmSync(publicDst, { recursive: true, force: true });
  cpSync(publicSrc, publicDst, { recursive: true });
}

/* ── 3b. sync optional Cloudflare Pages Functions and schemas ── */
for (const d of ['functions', 'schema']) {
  const extraSrc = join(repoRoot, 'apps/docs', d);
  const extraDst = join(deployRoot, d);
  if (existsSync(extraSrc)) {
    console.log(`• sync ${d}: ${extraSrc} → ${extraDst}`);
    rmSync(extraDst, { recursive: true, force: true });
    cpSync(extraSrc, extraDst, { recursive: true });
  }
}

/* ── 4. vendor packages into chufix-docs/vendor/ ── */
const vendorRoot = join(deployRoot, 'vendor');
rmSync(vendorRoot, { recursive: true, force: true });
mkdirSync(vendorRoot, { recursive: true });

const pkgs = [
  { name: 'tokens', dirs: ['src'] },
  { name: 'icons',  dirs: ['src'] },
  { name: 'vue',    dirs: ['src', 'dist'] },
  { name: 'react',  dirs: ['src', 'dist'] },
];

for (const { name, dirs } of pkgs) {
  const srcPkg = join(repoRoot, 'packages', name);
  const dstPkg = join(vendorRoot, name);
  console.log(`• vendor @chufix/${name}: ${srcPkg} → ${dstPkg}`);
  mkdirSync(dstPkg, { recursive: true });

  for (const d of dirs) {
    const s = join(srcPkg, d);
    const t = join(dstPkg, d);
    if (existsSync(s)) cpSync(s, t, { recursive: true });
  }

  /* rewrite package.json: workspace:* → file:../tokens, prune devDeps */
  const pkgJson = JSON.parse(
    readFileSync(join(srcPkg, 'package.json'), 'utf8')
  );
  if (pkgJson.dependencies) {
    for (const [k, v] of Object.entries(pkgJson.dependencies)) {
      if (k === '@chufix/tokens' && /^workspace:/.test(v)) {
        pkgJson.dependencies[k] = 'file:../tokens';
      }
      if (k === '@chufix/icons' && /^workspace:/.test(v)) {
        pkgJson.dependencies[k] = 'file:../icons';
      }
    }
  }
  delete pkgJson.devDependencies;
  delete pkgJson.scripts;
  writeFileSync(
    join(dstPkg, 'package.json'),
    JSON.stringify(pkgJson, null, 2) + '\n'
  );
}

/* ── 4b. sanity-check deploy repo's .gitignore so vendor dist isn't silently
 *      dropped on commit. The deploy repo originally inherited Astro's
 *      ".gitignore = dist" which matched every directory called dist anywhere,
 *      including vendor/{vue,react}/dist/. Result: dist files were never
 *      pushed and Cloudflare's build crashed with "Failed to resolve entry
 *      for package @chufix/vue". Catch the regression here. */
{
  const giPath = join(deployRoot, '.gitignore');
  if (existsSync(giPath)) {
    const gi = readFileSync(giPath, 'utf8');
    const lines = gi.split(/\r?\n/);
    const offending = lines.find(
      (l) => l.trim() === 'dist' || l.trim() === '**/dist'
    );
    if (offending) {
      console.warn(
        `\n⚠ deploy repo .gitignore has bare "${offending.trim()}" — that ignores vendor/*/dist/ too.`
      );
      console.warn(
        '  fix: change to "/dist" so only repo-root Astro output is ignored, not vendored builds.'
      );
    }
  }
}

/* ── 5. rewrite chufix-docs/package.json deps to file:./vendor/* ── */
const deployPkgPath = join(deployRoot, 'package.json');
const deployPkg = JSON.parse(readFileSync(deployPkgPath, 'utf8'));
deployPkg.dependencies['@chufix/tokens'] = 'file:./vendor/tokens';
deployPkg.dependencies['@chufix/icons'] = 'file:./vendor/icons';
deployPkg.dependencies['@chufix/vue'] = 'file:./vendor/vue';
deployPkg.dependencies['@chufix/react'] = 'file:./vendor/react';
writeFileSync(deployPkgPath, JSON.stringify(deployPkg, null, 2) + '\n');

console.log(`\nsync · done · deploy repo at ${deployRoot}`);
console.log('next: cd into chufix-docs, commit and push to trigger Cloudflare deploy.');
