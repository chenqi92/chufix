#!/usr/bin/env node
/**
 * check-tokens.mjs
 *
 * Scans every CSS file in packages/{vue,react}/src/styles/ for var(--xxx)
 * references and verifies that --xxx is actually defined somewhere in
 * packages/tokens/src/tokens.css. Catches the class of bugs where a stylesheet
 * references a token that was renamed or never defined, leading to silently
 * dropped declarations (e.g. box-shadow: var(--cf-shadow-md) collapsed to
 * an empty string in the past).
 *
 * Usage:
 *   node scripts/check-tokens.mjs
 *   pnpm tokens:check
 *
 * Exits non-zero if any unresolved reference is found.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');

const tokensFile = join(repoRoot, 'packages/tokens/src/tokens.css');
const styleDirs = [
  join(repoRoot, 'packages/vue/src/styles'),
  join(repoRoot, 'packages/react/src/styles'),
];

/* ── 1. extract all defined custom property names from tokens.css ── */
const tokensSrc = readFileSync(tokensFile, 'utf8');
const defined = new Set();
for (const m of tokensSrc.matchAll(/(--[a-z0-9-]+)\s*:/gi)) {
  defined.add(m[1]);
}

/* ── 2. allowlist for tokens defined elsewhere (e.g. inside component CSS itself) ── */
const localAllow = new Set([
  /* component-scoped vars defined inline within their own .cf-* selector;
   * they exist for inheritance/cascading inside the component, not as global tokens. */
  '--cf-rs-track-h',
  '--cf-rs-knob-size',
  '--cf-status-accent',
  '--cf-status-soft',
  '--diff-add-bg',
  '--diff-add-fg',
  '--diff-del-bg',
  '--diff-del-fg',
  '--cf-col-xs-span',
  '--cf-col-xs-offset',
  '--cf-col-xs-push',
  '--cf-col-xs-pull',
  '--cf-col-sm-span',
  '--cf-col-sm-offset',
  '--cf-col-sm-push',
  '--cf-col-sm-pull',
  '--cf-col-md-span',
  '--cf-col-md-offset',
  '--cf-col-md-push',
  '--cf-col-md-pull',
  '--cf-col-lg-span',
  '--cf-col-lg-offset',
  '--cf-col-lg-push',
  '--cf-col-lg-pull',
  '--cf-col-xl-span',
  '--cf-col-xl-offset',
  '--cf-col-xl-push',
  '--cf-col-xl-pull',
  '--cf-col-xxl-span',
  '--cf-col-xxl-offset',
  '--cf-col-xxl-push',
  '--cf-col-xxl-pull',
]);

/* ── 3. walk style dirs ── */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (entry.endsWith('.css')) out.push(p);
  }
  return out;
}

const cssFiles = styleDirs.flatMap((d) => walk(d));

const missing = [];
for (const f of cssFiles) {
  const src = readFileSync(f, 'utf8');
  const localDefined = new Set();
  for (const m of src.matchAll(/(--[a-z0-9-]+)\s*:/gi)) {
    localDefined.add(m[1]);
  }
  /* var(--x) without a fallback must resolve; var(--x, fallback) is an
   * intentional component-scoped knob (consumer-overridable) and skipped. */
  for (const m of src.matchAll(/var\((--[a-z0-9-]+)\s*(,[^)]*)?\)/gi)) {
    const name = m[1];
    const hasFallback = Boolean(m[2]);
    if (hasFallback) continue;
    if (!defined.has(name) && !localDefined.has(name) && !localAllow.has(name)) {
      missing.push({ file: f.replace(repoRoot, '').replace(/\\/g, '/'), name });
    }
  }
}

if (missing.length === 0) {
  console.log(`tokens · ok · scanned ${cssFiles.length} stylesheet(s), all references resolve to ${defined.size} defined tokens.`);
  process.exit(0);
}

console.error('tokens · failed');
console.error('Stylesheets reference CSS variables that are not defined in packages/tokens/src/tokens.css:');
const grouped = new Map();
for (const { file, name } of missing) {
  if (!grouped.has(name)) grouped.set(name, new Set());
  grouped.get(name).add(file);
}
for (const [name, files] of grouped) {
  console.error(`  ${name}`);
  for (const f of files) console.error(`    in ${f}`);
}
process.exit(1);
