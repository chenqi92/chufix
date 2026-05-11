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

function extractVueTemplate(source: string) {
  const match = source.match(/<template\b[^>]*>([\s\S]*?)<\/template>/i);
  return match ? match[1] : '';
}

function isPlaceholderCode(value?: string) {
  const source = normalizeCode(value);
  if (!source) return false;
  return /<Cf[A-Za-z0-9]+[^>]*(?:\s|=|\{|\[)\.\.\.(?:\s|\}|\]|>|\/>)/.test(source)
    || /<Cf[A-Za-z0-9]+[^>]*>\s*(?:\.{3}|…)\s*<\/Cf[A-Za-z0-9]+>/.test(source)
    || /slots=\{\{\s*\.\.\.\s*\}\}/.test(source)
    || /content=\{\s*\.\.\.\s*\}/.test(source)
    || /<Panel[A-Za-z0-9_]*\s*\/>/.test(source)
    || /\[\s*\.\.\.\s*\]/.test(source)
    || /\/\*\s*\.\.\.\s*\*\//.test(source);
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

function camelName(value: string) {
  return value.replace(/-([a-z])/g, (_, ch: string) => ch.toUpperCase());
}

function eventName(value: string) {
  if (value.startsWith('update:')) {
    return `on${value.slice('update:'.length).split('-').map(cap).join('')}Change`;
  }
  return `on${value.split('-').map(cap).join('')}`;
}

function styleObject(value: string) {
  const rows = value.split(';')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [rawKey, ...rawValue] = item.split(':');
      const key = camelName((rawKey ?? '').trim());
      const cssValue = rawValue.join(':').trim();
      if (!key || !cssValue) return '';
      if (/^-?\d+(\.\d+)?px$/.test(cssValue)) return `${key}: ${cssValue.replace(/px$/, '')}`;
      if (/^-?\d+(\.\d+)?$/.test(cssValue)) return `${key}: ${cssValue}`;
      return `${key}: ${JSON.stringify(cssValue)}`;
    })
    .filter(Boolean);
  return rows.length ? `style={{ ${rows.join(', ')} }}` : '';
}

function transformAssignmentExpression(value: string, stateNames: Set<string>) {
  return value.replace(/\b([A-Za-z_$][\w$]*)\s*=\s*([^,;]+)/g, (match, name: string, expr: string) => {
    if (!stateNames.has(name)) return match;
    return `set${cap(name)}(${expr.trim()})`;
  });
}

function transformEventExpression(event: string, expression: string, stateNames: Set<string>) {
  const trimmed = expression.trim();
  const updateMatch = event.match(/^update:(.+)$/);
  if (updateMatch) {
    const target = updateMatch[1]!.replace(/-([a-z])/g, (_, ch: string) => ch.toUpperCase());
    const assignMatch = trimmed.match(/^\(?\s*([A-Za-z_$][\w$]*)\s*\)?\s*=>\s*([A-Za-z_$][\w$]*)\s*=\s*\1$/);
    if (assignMatch && assignMatch[2] === target && stateNames.has(target)) return `{set${cap(target)}}`;
  }
  if (/^\(?\s*[^)=]+\s*\)?\s*=>/.test(trimmed)) return `{${transformAssignmentExpression(trimmed, stateNames)}}`;
  if (/^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)?$/.test(trimmed)) return `{${trimmed}}`;
  return `{() => ${transformAssignmentExpression(trimmed, stateNames)}}`;
}

function transformVueAttributes(attrs: string, stateNames: Set<string>) {
  let out = attrs
    .replace(/\sclass=/g, ' className=')
    .replace(/\sstyle="([^"]*)"/g, (_match, value: string) => ` ${styleObject(value)}`)
    .replace(/\s:([A-Za-z0-9_:-]+)="([^"]*)"/g, (_match, name: string, value: string) => ` ${camelName(name)}={${value}}`)
    .replace(/\s@([A-Za-z0-9_:-]+)="([^"]*)"/g, (_match, name: string, value: string) => ` ${eventName(name)}=${transformEventExpression(name, value, stateNames)}`)
    .replace(/\sv-model(?::([A-Za-z0-9_-]+))?="([^"]*)"/g, (_match, modelName: string, value: string) => {
      const prop = modelName ? camelName(modelName) : 'value';
      const setter = stateNames.has(value) ? ` on${cap(prop)}Change={set${cap(value)}}` : '';
      return ` ${prop}={${value}}${setter}`;
    });

  out = out.replace(/\s([a-z][A-Za-z0-9_-]*)(?=(\s|>|\/))/g, (match, name: string) => {
    if (['data-', 'aria-'].some((prefix) => name.startsWith(prefix))) return match;
    return ` ${camelName(name)}`;
  });
  return out.replace(/\s+/g, ' ');
}

function transformSimpleVueMarkup(template: string, stateNames: Set<string>) {
  const source = normalizeCode(template)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<template\s+#[^>]+>|<\/template>/g, '')
    .replace(/\sclass=/g, ' className=')
    .replace(/\sstyle="([^"]*)"/g, (_match, value: string) => ` ${styleObject(value)}`)
    .replace(/\s:([A-Za-z0-9_:-]+)="([^"]*)"/g, (_match, name: string, value: string) => ` ${camelName(name)}={${value}}`)
    .replace(/\s@([A-Za-z0-9_:-]+)="([^"]*)"/g, (_match, name: string, value: string) => ` ${eventName(name)}=${transformEventExpression(name, value, stateNames)}`)
    .replace(/\sv-model(?::([A-Za-z0-9_-]+))?="([^"]*)"/g, (_match, modelName: string, value: string) => {
      const prop = modelName ? camelName(modelName) : 'value';
      const setter = stateNames.has(value) ? ` on${cap(prop)}Change={set${cap(value)}}` : '';
      return ` ${prop}={${value}}${setter}`;
    });

  return source
    .replace(/<([A-Za-z][A-Za-z0-9]*)([^>]*)>/g, (match, tag: string, attrs: string) => {
      if (match.startsWith('</')) return match;
      return `<${tag}${transformVueAttributes(attrs, stateNames)}>`;
    })
    .replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, expr: string, offset: number, whole: string) => (
      whole[offset - 1] === '=' ? match : `{${expr}}`
    ));
}

function transformContentSlots(template: string, stateNames: Set<string>) {
  return template.replace(
    /<(?<component>Cf[A-Za-z0-9]+)(?<attrs>[^>]*)>(?<body>[\s\S]*?<template\s+#content>[\s\S]*?<\/template>[\s\S]*?)<\/\k<component>>/g,
    (...args) => {
      const groups = args.at(-1) as { component: string; attrs: string; body: string };
      const contentMatch = groups.body.match(/<template\s+#content>([\s\S]*?)<\/template>/);
      if (!contentMatch) return args[0] as string;
      const children = groups.body.replace(contentMatch[0], '').trim();
      const content = transformSimpleVueMarkup(contentMatch[1] ?? '', stateNames);
      const childMarkup = transformSimpleVueMarkup(children, stateNames);
      return `<${groups.component}${transformVueAttributes(groups.attrs, stateNames)} content={(
${indent(content, 2)}
)}>
${indent(childMarkup, 2)}
</${groups.component}>`;
    },
  );
}

function transformNamedSlots(template: string, stateNames: Set<string>) {
  return template.replace(
    /<(?<component>Cf[A-Za-z0-9]+)(?<attrs>[^>]*)>\s*(?<slots>(?:<template\s+#[\s\S]*?<\/template>\s*)+)<\/\k<component>>/g,
    (...args) => {
      const groups = args.at(-1) as { component: string; attrs: string; slots: string };
      const slotRows = Array.from(groups.slots.matchAll(/<template\s+#([A-Za-z0-9_-]+)>([\s\S]*?)<\/template>/g))
        .map(([, name, body]) => {
          const content = transformSimpleVueMarkup(body ?? '', stateNames);
          return `  '${name}': (\n${indent(content, 4)}\n  )`;
        });
      return `<${groups.component}${transformVueAttributes(groups.attrs, stateNames)} slots={{\n${slotRows.join(',\n')}\n}} />`;
    },
  );
}

function transformVueTemplateToJsx(template: string, stateNames: Set<string>) {
  const withContent = transformContentSlots(template, stateNames);
  const withSlots = transformNamedSlots(withContent, stateNames);
  return transformSimpleVueMarkup(withSlots, stateNames);
}

function transformVueScriptToReact(script: string) {
  const stateNames = new Set<string>();
  let usesState = false;
  const lines = script
    .replace(/from ['"]@chufix-design\/vue['"]/g, `from '@chufix-design/react'`)
    .split('\n');
  const out: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (/^\s*import\s+\{[^}]*\}\s+from\s+['"]vue['"];?/.test(line)) continue;
    if (/^\s*import\s+\{[^}]*Cf[A-Za-z0-9_,\s]*\}\s+from\s+['"]@chufix-design\/react['"];?/.test(line)) continue;
    const refMatch = line.match(/^(\s*)const\s+([A-Za-z_$][\w$]*)\s*=\s*ref\((.*)\);?\s*$/);
    if (refMatch) {
      usesState = true;
      stateNames.add(refMatch[2]!);
      out.push(`${refMatch[1]}const [${refMatch[2]}, set${cap(refMatch[2]!)}] = useState(${refMatch[3]});`);
      continue;
    }
    out.push(line);
  }

  return {
    declarations: normalizeCode(out.join('\n')),
    stateNames,
    usesState,
  };
}

function buildReactSourceFromVueTemplate(vueSource: string) {
  const script = extractVueScript(vueSource);
  const template = extractVueTemplate(vueSource);
  if (!template) return '';
  const transformedScript = transformVueScriptToReact(script);
  const jsx = transformVueTemplateToJsx(template, transformedScript.stateNames);
  const imports = componentNames(template);
  const importLines = [
    transformedScript.usesState ? `import { useState } from 'react';` : '',
    imports.length ? `import { ${imports.join(', ')} } from '@chufix-design/react';` : '',
  ].filter(Boolean);
  const declarations = transformedScript.declarations
    ? `${indent(transformedScript.declarations)}\n`
    : '';

  return normalizeCode(`${importLines.join('\n')}${importLines.length ? '\n\n' : ''}export default function Demo() {
${declarations}  return (
    <>
${indent(jsx, 6)}
    </>
  );
}`);
}

function buildReactSourceFromVueSource(vueSource: string, reactCode: string) {
  const snippet = normalizeCode(reactCode);
  if (isPlaceholderCode(snippet)) {
    const source = buildReactSourceFromVueTemplate(vueSource);
    if (source) return source;
  }
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
  const ts = framework === 'react' || hasTypeScript(source);
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
