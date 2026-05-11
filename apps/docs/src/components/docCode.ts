export type DocCodeLang = 'vue' | 'tsx' | 'jsx' | 'ts' | 'js' | 'json' | 'css' | 'bash' | 'mdx' | 'astro' | 'html';
export type DocCodeFramework = 'vue' | 'react' | 'cli';
export type DocCodeVariant = 'ts' | 'js' | 'shell';

export interface DocCodeFile {
  id: string;
  framework: DocCodeFramework;
  variant: DocCodeVariant;
  label: string;
  variantLabel: string;
  name: string;
  content: string;
  lang: DocCodeLang;
}

export interface DocCodeGroup {
  framework: DocCodeFramework;
  label: string;
  files: DocCodeFile[];
}

export interface DemoCodeInput {
  vueCode?: string;
  vueSource?: string;
  reactCode?: string;
  reactSource?: string;
  cliCode?: string;
  cliSource?: string;
}

const JS_RESERVED = new Set([
  'const', 'let', 'var', 'return', 'import', 'from', 'export', 'default', 'function', 'if', 'else',
  'true', 'false', 'null', 'undefined', 'class', 'extends', 'new', 'type', 'interface', 'as',
  'React', 'Fragment', 'useState',
]);

export function normalizeCode(value?: string) {
  return String(value || '')
    .replace(/\r\n?/g, '\n')
    .trim()
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]*\n(?=\s*<\/?[A-Za-z])/g, '\n')
    .replace(/>\n[ \t]*\n(?=\s*<\/?[A-Za-z])/g, '>\n')
    .replace(/\n{3,}/g, '\n\n');
}

function countUnescapedBackticks(line: string) {
  let count = 0;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '`' && line[i - 1] !== '\\') count++;
  }
  return count;
}

export function hasTypeScript(value: string) {
  const source = normalizeCode(value);
  if (/lang=["']ts["']|\bimport\s+type\b|\binterface\s+\w+|\btype\s+\w+\s*=|\buseState\s*</m.test(source)) {
    return true;
  }
  let inTemplate = false;
  for (const line of source.split('\n')) {
    const scan = inTemplate || line.includes('`') ? '' : line;
    if (/\b(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*:\s*[^=]+?=/.test(scan)) return true;
    if (/\bfunction\s+\w+\s*\([^)]*:\s*[^)]*\)/.test(scan)) return true;
    if (countUnescapedBackticks(line) % 2 === 1) inTemplate = !inTemplate;
  }
  return false;
}

export function toJavaScript(value: string) {
  const lines = normalizeCode(value)
    .replace(/\s+lang=["']ts["']/g, '')
    .split('\n');
  let inTemplate = false;
  let skipTypeBlockDepth = 0;
  const out: string[] = [];

  for (const rawLine of lines) {
    let line = rawLine;
    const canTransform = !inTemplate && !line.includes('`');
    if (canTransform) {
      if (/^\s*import\s+type\s+/.test(line)) continue;
      if (skipTypeBlockDepth > 0) {
        skipTypeBlockDepth += (line.match(/\{/g) ?? []).length;
        skipTypeBlockDepth -= (line.match(/\}/g) ?? []).length;
        if (skipTypeBlockDepth <= 0) skipTypeBlockDepth = 0;
        continue;
      }
      if (/^\s*(export\s+)?interface\s+/.test(line)) {
        const opens = (line.match(/\{/g) ?? []).length;
        const closes = (line.match(/\}/g) ?? []).length;
        skipTypeBlockDepth = Math.max(0, opens - closes);
        continue;
      }
      if (/^\s*(export\s+)?type\s+/.test(line)) {
        if (!line.includes(';')) {
          const opens = (line.match(/\{/g) ?? []).length;
          const closes = (line.match(/\}/g) ?? []).length;
          skipTypeBlockDepth = Math.max(0, opens - closes);
        }
        continue;
      }
      line = line
        .replace(/,\s*type\s+([A-Za-z_$][\w$]*)/g, '')
        .replace(/\{\s*type\s+([A-Za-z_$][\w$]*)\s*,\s*/g, '{ ')
        .replace(/\{\s*type\s+([A-Za-z_$][\w$]*)\s*\}/g, '{}')
        .replace(/(\b(?:const|let|var)\s+[A-Za-z_$][\w$]*)\s*:\s*[^=]+(?=\s*=)/g, '$1')
        .replace(/([,(]\s*[A-Za-z_$][\w$]*)\s*:\s*[A-Za-z_$][\w$<>,\s[\]|&?]*(?=\s*(?:,|\)))/g, '$1')
        .replace(/\s+as\s+const\b/g, '')
        .replace(/\s+as\s+[A-Za-z_$][\w$<>,\s[\]|&?]*/g, '');
    }
    if (countUnescapedBackticks(rawLine) % 2 === 1) inTemplate = !inTemplate;
    out.push(line);
  }

  return normalizeCode(out.join('\n'));
}

function extractVueScript(source: string) {
  const match = source.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i);
  return match ? match[1] : '';
}

function readConstInitializer(script: string, name: string) {
  const match = new RegExp(`\\bconst\\s+${name}\\s*=`).exec(script);
  if (!match) return '';
  let i = match.index + match[0].length;
  const start = i;
  let depth = 0;
  let quote = '';
  let escaped = false;

  for (; i < script.length; i++) {
    const ch = script[i]!;
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === quote) {
        quote = '';
      }
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }
    if (ch === '(' || ch === '[' || ch === '{') depth++;
    if (ch === ')' || ch === ']' || ch === '}') depth = Math.max(0, depth - 1);
    if (ch === ';' && depth === 0) break;
  }

  return script.slice(start, i).trim();
}

function unwrapVueInitializer(value: string) {
  const trimmed = value.trim();
  for (const helper of ['ref', 'shallowRef', 'reactive']) {
    if (!trimmed.startsWith(`${helper}(`) || !trimmed.endsWith(')')) continue;
    return trimmed.slice(helper.length + 1, -1).trim();
  }
  return trimmed;
}

function namesUsedByReact(code: string) {
  const names = new Set<string>();
  for (const match of code.matchAll(/\b[A-Za-z_$][\w$]*\b/g)) {
    const name = match[0];
    if (!JS_RESERVED.has(name) && !/^Cf[A-Z]/.test(name)) names.add(name);
  }
  return names;
}

function componentNames(code: string) {
  return Array.from(new Set(Array.from(code.matchAll(/\bCf[A-Z][A-Za-z0-9_]*/g)).map((item) => item[0]))).sort();
}

function cap(value: string) {
  return value ? value[0]!.toUpperCase() + value.slice(1) : value;
}

function indent(value: string, spaces = 2) {
  const pad = ' '.repeat(spaces);
  return value.split('\n').map((line) => (line ? `${pad}${line}` : line)).join('\n');
}

function buildReactSourceFromVueSource(vueSource: string, reactCode: string) {
  const snippet = normalizeCode(reactCode);
  if (/^\s*(import|export\s+default|function\s+\w+)/m.test(snippet)) return snippet;
  if (!snippet.includes('<')) return snippet;

  const script = extractVueScript(vueSource);
  const used = namesUsedByReact(snippet);
  const declarations: string[] = [];
  let usesState = false;

  for (const name of used) {
    const initializer = unwrapVueInitializer(readConstInitializer(script, name));
    if (!initializer) continue;
    const setter = `set${cap(name)}`;
    if (snippet.includes(setter)) {
      usesState = true;
      declarations.push(`const [${name}, ${setter}] = useState(${initializer});`);
    } else {
      declarations.push(`const ${name} = ${initializer};`);
    }
  }

  const imports = componentNames(snippet);
  const importLines = [
    usesState ? `import { useState } from 'react';` : '',
    imports.length ? `import { ${imports.join(', ')} } from '@chufix-design/react';` : '',
  ].filter(Boolean);

  return normalizeCode(`${importLines.join('\n')}${importLines.length ? '\n\n' : ''}export default function Demo() {
${indent(declarations.join('\n'))}${declarations.length ? '\n' : ''}  return (
    <>
${indent(snippet, 6)}
    </>
  );
}`);
}

function pushVariants(
  groups: DocCodeGroup[],
  framework: DocCodeFramework,
  label: string,
  baseName: string,
  baseLang: DocCodeLang,
  content: string,
) {
  const source = normalizeCode(content);
  if (!source) return;
  const files: DocCodeFile[] = [];
  const ts = hasTypeScript(source);
  const tsExt = framework === 'react' ? 'tsx' : baseLang;
  const jsExt = framework === 'react' ? 'jsx' : baseLang;

  files.push({
    id: `${framework}-${ts ? 'ts' : 'js'}`,
    framework,
    variant: ts ? 'ts' : 'js',
    label,
    variantLabel: ts ? 'TypeScript' : 'JavaScript',
    name: ts ? baseName : baseName.replace(/\.tsx$/, '.jsx'),
    content: source,
    lang: ts ? tsExt : jsExt,
  });
  if (ts) {
    files.push({
      id: `${framework}-js`,
      framework,
      variant: 'js',
      label,
      variantLabel: 'JavaScript',
      name: baseName.replace(/\.tsx$/, '.jsx'),
      content: toJavaScript(source),
      lang: jsExt,
    });
  }
  groups.push({ framework, label, files });
}

export function buildDemoCodeGroups(input: DemoCodeInput) {
  const groups: DocCodeGroup[] = [];
  const vueContent = normalizeCode(input.vueSource ?? input.vueCode);
  const reactContent = normalizeCode(
    input.reactSource ?? (input.vueSource && input.reactCode
      ? buildReactSourceFromVueSource(input.vueSource, input.reactCode)
      : input.reactCode),
  );
  const cliContent = normalizeCode(input.cliSource ?? input.cliCode);

  pushVariants(groups, 'vue', 'Vue', 'src/App.vue', 'vue', vueContent);
  pushVariants(groups, 'react', 'React', 'src/App.tsx', 'tsx', reactContent);
  if (cliContent) {
    groups.push({
      framework: 'cli',
      label: 'CLI',
      files: [{
        id: 'cli-shell',
        framework: 'cli',
        variant: 'shell',
        label: 'CLI',
        variantLabel: 'Shell',
        name: 'scripts/setup.sh',
        content: cliContent,
        lang: 'bash',
      }],
    });
  }
  return groups;
}
