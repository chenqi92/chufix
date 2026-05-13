// One-off: strip prop-style meta-labels from demo Vue files.
// Target patterns (all on a single line):
//   <div style="...">prop = value...</div>
//   <span style="...">prop = value...</span>
//   <span class="..._label">prop = value</span>
//   <div>size = sm</div>  (no style attr, bare text)
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDocs = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const demosDir = resolve(projectDocs, 'src/components/demos');

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.isFile() && full.endsWith('.vue')) out.push(full);
  }
  return out;
}

const targets = (await walk(demosDir)).map((p) => relative(demosDir, p));

// Test: does this single line look like a meta-label tag (small grey caption
// above a demo, carrying prop=value / prop+value text)?
// Constraint: must have a fg-3 color in the inline style, to avoid stripping
// real content (e.g. Grid panel labels, NavMenu link text).
const META_TAG_RE =
  /^\s*<(div|span)\b[^>]*style=[^>]*color:\s*var\(--fg-3\)[^>]*>\s*[\w-]+\s*(?:=|\+)\s*[^<]*<\/\1>\s*$/;

function stripMetaLabels(source) {
  // 1) drop whole lines matching META_TAG_RE
  const kept = source
    .split('\n')
    .filter((line) => !META_TAG_RE.test(line));
  let out = kept.join('\n');

  // 2) collapse any 3+ blank lines that may result
  out = out.replace(/\n{3,}/g, '\n\n');

  return out;
}

let touched = 0;
for (const rel of targets) {
  const path = resolve(demosDir, rel);
  const before = await readFile(path, 'utf8');
  const after = stripMetaLabels(before);
  if (before !== after) {
    await writeFile(path, after);
    touched += 1;
    console.log(`stripped: ${rel}`);
  } else {
    console.log(`unchanged: ${rel}`);
  }
}
console.log(`done; touched ${touched} files.`);
