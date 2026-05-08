#!/usr/bin/env node
/**
 * gen-favicons.mjs
 *
 * Generate rounded-corner favicon variants from apps/docs/public/chufix.png:
 *  - favicon-32.png  (32×32, ~22% rounded)
 *  - favicon-180.png (180×180, ~22% rounded — apple-touch-icon)
 *  - favicon.svg     (vector wrapper that embeds the 180px PNG with rounded clip,
 *                     so modern browsers render crisp at any DPR)
 *
 * Why: the source chufix.png is square (1620 KB). Without this, the browser tab
 * shows a hard-cornered square that doesn't match the in-page nav logo (CSS-rounded).
 *
 * Run: node scripts/gen-favicons.mjs (sharp comes from apps/docs deps).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsRoot = resolve(__dirname, '..');
const publicDir = join(docsRoot, 'public');
const src = join(publicDir, 'chufix.png');

async function rounded(size, radiusPct) {
  const r = Math.round((size * radiusPct) / 100);
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <rect x="0" y="0" width="${size}" height="${size}" rx="${r}" ry="${r}" fill="#fff"/>
    </svg>`
  );
  return sharp(src)
    .resize(size, size, { fit: 'cover' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

const out32 = await rounded(32, 22);
writeFileSync(join(publicDir, 'favicon-32.png'), out32);

const out180 = await rounded(180, 22);
writeFileSync(join(publicDir, 'favicon-180.png'), out180);

/* SVG wrapper — embeds the 180px PNG as base64 with rounded clip-path.
 * Modern browsers (Chrome/Firefox/Safari 16+) prefer SVG favicons. */
const b64 = out180.toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <defs>
    <clipPath id="r"><rect x="0" y="0" width="180" height="180" rx="40" ry="40"/></clipPath>
  </defs>
  <image href="data:image/png;base64,${b64}" width="180" height="180" clip-path="url(#r)"/>
</svg>`;
writeFileSync(join(publicDir, 'favicon.svg'), svg);

console.log(`favicons · ok`);
console.log(`  ${(out32.length / 1024).toFixed(1)} KB  favicon-32.png`);
console.log(`  ${(out180.length / 1024).toFixed(1)} KB  favicon-180.png`);
console.log(`  ${(svg.length / 1024).toFixed(1)} KB  favicon.svg`);
