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
    || /\/\/\s*\.\.\.\s*$/m.test(source)
    || /\/\*\s*\.\.\.\s*\*\//.test(source);
}

function hasPlaceholderEllipsis(value?: string) {
  const source = normalizeCode(value);
  if (!source) return false;
  if (isPlaceholderCode(source)) return true;
  if (!/(?:\.{3}|…)/.test(source)) return false;
  return /<Cf[A-Za-z0-9]+[\s\S]*(?:\.{3}|…)/.test(source)
    || /<template\s+#/.test(source)
    || /<path\b[^>]*\bd=["'][^"']*(?:\.{3}|…)/.test(source)
    || /(?:content|trigger|message|title|subtitle|label|value|delta|trend)=\{?\s*(?:\.{3}|…)/.test(source);
}

function readConstInitializer(script: string, name: string) {
  const match = new RegExp(`\\bconst\\s+${name}\\s*=`).exec(script);
  if (!match) return '';
  return readInitializerAt(script, match.index + match[0].length);
}

function readInitializerAt(script: string, offset: number) {
  let i = offset;
  while (/\s/.test(script[i] ?? '')) i++;
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
    const match = trimmed.match(new RegExp(`^${helper}(?:<([\\s\\S]+?)>)?\\(([\\s\\S]*)\\)$`));
    if (match) return (match[2] ?? '').trim();
  }
  return trimmed;
}

function parseVueInitializer(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/^(ref|shallowRef|reactive|computed)(?:<([\s\S]+?)>)?\(([\s\S]*)\)$/);
  if (!match) return undefined;
  return {
    helper: match[1]!,
    typeArg: (match[2] ?? '').trim(),
    inner: (match[3] ?? '').trim(),
  };
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

function lowerFirst(value: string) {
  return value ? value[0]!.toLowerCase() + value.slice(1) : value;
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

function reactModelChangeProp(prop: string) {
  return prop === 'value' ? 'onChange' : `on${cap(prop)}Change`;
}

function transformVueAttributes(attrs: string, stateNames: Set<string>) {
  let out = attrs
    .replace(/\sclass=/g, ' className=')
    .replace(/\sstyle="([^"]*)"/g, (_match, value: string) => ` ${styleObject(value)}`)
    .replace(/\s:([A-Za-z0-9_:-]+)="([^"]*)"/g, (_match, name: string, value: string) => ` ${camelName(name)}={${value}}`)
    .replace(/\s@([A-Za-z0-9_:-]+)="([^"]*)"/g, (_match, name: string, value: string) => ` ${eventName(name)}=${transformEventExpression(name, value, stateNames)}`)
    .replace(/\sv-model(?::([A-Za-z0-9_-]+))?="([^"]*)"/g, (_match, modelName: string, value: string) => {
      const prop = modelName ? camelName(modelName) : 'value';
      const setter = stateNames.has(value) ? ` ${reactModelChangeProp(prop)}={set${cap(value)}}` : '';
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
      const setter = stateNames.has(value) ? ` ${reactModelChangeProp(prop)}={set${cap(value)}}` : '';
      return ` ${prop}={${value}}${setter}`;
    });

  return source
    .replace(/<([A-Za-z][A-Za-z0-9]*)([^>]*)>/g, (match, tag: string, attrs: string) => {
      if (match.startsWith('</')) return match;
      return `<${tag}${transformVueAttributes(attrs, stateNames)}>`;
    })
    .replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, expr: string, offset: number, whole: string) => (
      isInsideQuotedAttribute(whole, offset) || whole[offset - 1] === '=' ? match : `{${expr}}`
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

function isInsideQuotedAttribute(source: string, offset: number) {
  const openTag = source.lastIndexOf('<', offset);
  const closeTag = source.lastIndexOf('>', offset);
  if (openTag === -1 || closeTag > openTag) return false;
  let quote = '';
  for (let i = openTag + 1; i < offset; i++) {
    const ch = source[i]!;
    if (!quote && (ch === '"' || ch === "'")) {
      quote = ch;
    } else if (quote === ch && source[i - 1] !== '\\') {
      quote = '';
    }
  }
  return Boolean(quote);
}

function stripStringLiterals(value: string) {
  return value
    .replace(/`(?:\\.|[^`\\])*`/g, '')
    .replace(/"(?:\\.|[^"\\])*"/g, '')
    .replace(/'(?:\\.|[^'\\])*'/g, '');
}

function stripDemoImports(source: string) {
  return source
    .replace(/^\s*import\s+[\s\S]*?\s+from\s+['"]vue['"];?\s*$/gm, '')
    .replace(/^\s*import\s+[\s\S]*?\s+from\s+['"]@chufix-design\/react['"];?\s*$/gm, '');
}

function transformRefValueUsage(source: string, valueNames: Set<string>, stateNames: Set<string>) {
  let out = source;
  for (const name of stateNames) {
    const setter = `set${cap(name)}`;
    out = out.replace(
      new RegExp(`\\b${name}\\.value\\s*=\\s*([\\s\\S]*?);`, 'g'),
      (_match, value: string) => `${setter}(${value.trim()});`,
    );
  }
  for (const name of valueNames) {
    out = out.replace(new RegExp(`\\b${name}\\.value\\b`, 'g'), name);
  }
  return out;
}

function transformLifecycleUsage(source: string) {
  return source.replace(/\bonMounted\(\(\)\s*=>\s*\{/g, 'useEffect(() => {');
}

function vueScriptHasConst(script: string, name: string) {
  return Boolean(readConstInitializer(script, name));
}

function reactSnippetHasUnresolvedState(snippet: string, vueScript: string) {
  for (const exprMatch of snippet.matchAll(/\{([^{}]*)\}/g)) {
    const rawExpr = (exprMatch[1] ?? '').trim();
    if (rawExpr.startsWith('<')) continue;
    const expr = stripStringLiterals(rawExpr);
    for (const idMatch of expr.matchAll(/\b[A-Za-z_$][\w$]*\b/g)) {
      const name = idMatch[0];
      const offset = idMatch.index ?? 0;
      const prev = expr[offset - 1];
      const next = expr[offset + name.length];
      if (JS_RESERVED.has(name) || /^Cf[A-Z]/.test(name)) continue;
      if (prev === '.' || next === ':') continue;
      if (/^set[A-Z]/.test(name)) {
        if (vueScriptHasConst(vueScript, lowerFirst(name.slice(3)))) continue;
      } else if (vueScriptHasConst(vueScript, name)) {
        continue;
      }
      return true;
    }
  }
  return false;
}

function stripReactSnippetImports(source: string) {
  return source
    .replace(/^\s*import\s+[\s\S]*?\s+from\s+['"]react['"];?\s*$/gm, '')
    .replace(/^\s*import\s+[\s\S]*?\s+from\s+['"]@chufix-design\/react['"];?\s*$/gm, '');
}

function declaredNames(source: string) {
  const names = new Set<string>();
  for (const match of source.matchAll(/\b(?:const|let|var|function)\s+([A-Za-z_$][\w$]*)/g)) {
    names.add(match[1]!);
  }
  return names;
}

function splitReactSnippet(source: string) {
  const lines = normalizeCode(source).split('\n');
  const jsxStart = lines.findIndex((line) => {
    const trimmed = line.trim();
    return trimmed.startsWith('<');
  });
  if (jsxStart === -1 && normalizeCode(source).startsWith('{')) {
    return { declarations: '', jsx: normalizeCode(source) };
  }
  if (jsxStart <= 0) {
    return { declarations: '', jsx: normalizeCode(source) };
  }
  return {
    declarations: normalizeCode(lines.slice(0, jsxStart).join('\n')),
    jsx: normalizeCode(lines.slice(jsxStart).join('\n')),
  };
}

function transformVueScriptToReact(script: string) {
  const stateNames = new Set<string>();
  const valueNames = new Set<string>();
  let usesState = false;
  let usesEffect = false;
  const source = script
    .replace(/from ['"]@chufix-design\/vue['"]/g, `from '@chufix-design/react'`)
    .replace(/\bonMounted\b/g, 'onMounted');

  const out: string[] = [];
  let cursor = 0;
  const importless = stripDemoImports(source);
  const constRe = /^(\s*)const\s+([A-Za-z_$][\w$]*)\s*=/gm;
  for (const match of importless.matchAll(constRe)) {
    const start = match.index ?? 0;
    const name = match[2]!;
    const initializer = readInitializerAt(importless, start + match[0].length);
    const parsed = parseVueInitializer(initializer);
    if (!parsed) continue;

    const initializerStart = start + match[0].length + (importless.slice(start + match[0].length).match(/^\s*/)?.[0].length ?? 0);
    let end = initializerStart + initializer.length;
    if (importless[end] === ';') end++;
    out.push(importless.slice(cursor, start));

    const indentText = match[1] ?? '';
    if (parsed.helper === 'ref' || parsed.helper === 'shallowRef') {
      usesState = true;
      stateNames.add(name);
      valueNames.add(name);
      const typeArg = parsed.typeArg ? `<${parsed.typeArg}>` : '';
      out.push(`${indentText}const [${name}, set${cap(name)}] = useState${typeArg}(${parsed.inner});`);
    } else if (parsed.helper === 'reactive') {
      out.push(`${indentText}const ${name} = ${parsed.inner};`);
    } else {
      valueNames.add(name);
      const computed = parsed.inner.replace(/^\(\)\s*=>\s*/, '').replace(/,\s*$/, '');
      out.push(`${indentText}const ${name} = ${computed};`);
    }
    cursor = end;
  }
  out.push(importless.slice(cursor));

  let declarations = transformRefValueUsage(out.join(''), valueNames, stateNames);
  if (/\bonMounted\(/.test(declarations)) {
    usesEffect = true;
    declarations = transformLifecycleUsage(declarations);
  }

  return {
    declarations: normalizeCode(declarations),
    stateNames,
    usesState,
    usesEffect,
  };
}

function buildReactSourceFromVueTemplate(vueSource: string) {
  const script = extractVueScript(vueSource);
  const template = extractVueTemplate(vueSource);
  if (!template) return '';
  const transformedScript = transformVueScriptToReact(script);
  const jsx = transformVueTemplateToJsx(template, transformedScript.stateNames);
  const imports = componentNames(template);
  const reactImports = [
    transformedScript.usesEffect ? 'useEffect' : '',
    transformedScript.usesState ? 'useState' : '',
  ].filter(Boolean);
  const importLines = [
    reactImports.length ? `import { ${reactImports.join(', ')} } from 'react';` : '',
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
  if (!snippet || hasPlaceholderEllipsis(snippet)) {
    const source = buildReactSourceFromVueTemplate(vueSource);
    if (source) return source;
  }
  if (/^\s*export\s+default/m.test(snippet)) return snippet;
  if (!snippet.includes('<')) {
    const source = buildReactSourceFromVueTemplate(vueSource);
    if (source) return source;
    return snippet;
  }

  const script = extractVueScript(vueSource);
  if (reactSnippetHasUnresolvedState(snippet, script)) {
    const source = buildReactSourceFromVueTemplate(vueSource);
    if (source) return source;
  }
  const importlessSnippet = stripReactSnippetImports(snippet);
  const splitSnippet = splitReactSnippet(importlessSnippet);
  const localNames = declaredNames(splitSnippet.declarations);
  const used = namesUsedByReact(importlessSnippet);
  const declarations: string[] = [];
  let usesState = /\buseState(?:<|\()/.test(splitSnippet.declarations);

  for (const name of used) {
    if (localNames.has(name)) continue;
    const stateName = /^set[A-Z]/.test(name) ? lowerFirst(name.slice(3)) : name;
    const initializer = unwrapVueInitializer(readConstInitializer(script, stateName));
    if (!initializer) continue;
    const setter = `set${cap(stateName)}`;
    if (snippet.includes(setter) || name === setter) {
      usesState = true;
      declarations.push(`const [${stateName}, ${setter}] = useState(${initializer});`);
    } else {
      declarations.push(`const ${stateName} = ${initializer};`);
    }
  }

  if (splitSnippet.declarations) declarations.push(splitSnippet.declarations);

  const imports = componentNames(importlessSnippet);
  const importLines = [
    usesState ? `import { useState } from 'react';` : '',
    imports.length ? `import { ${imports.join(', ')} } from '@chufix-design/react';` : '',
  ].filter(Boolean);

  return normalizeCode(`${importLines.join('\n')}${importLines.length ? '\n\n' : ''}export default function Demo() {
${indent(declarations.join('\n'))}${declarations.length ? '\n' : ''}  return (
    <>
${indent(splitSnippet.jsx, 6)}
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

export interface WorkspaceFile {
  name: string;
  content: string;
  lang?: DocCodeLang;
}

export interface WorkspaceBundle {
  id: string;
  framework: 'vue' | 'react' | 'neutral';
  variant: 'ts' | 'js' | 'mixed';
  frameworkLabel: string;
  variantLabel: string;
  label: string;
  files: Array<Required<Pick<WorkspaceFile, 'name' | 'content'>> & { lang: DocCodeLang }>;
}

export interface WorkspaceProjectInput {
  vueFiles?: Record<string, string>;
  reactFiles?: Record<string, string>;
  includeJs?: boolean;
}

function inferLang(name: string): DocCodeLang {
  const ext = name.toLowerCase().split('.').pop() ?? '';
  switch (ext) {
    case 'vue': return 'vue';
    case 'tsx': return 'tsx';
    case 'jsx': return 'jsx';
    case 'ts': return 'ts';
    case 'js': return 'js';
    case 'mjs': return 'js';
    case 'json': return 'json';
    case 'css': return 'css';
    case 'sh':
    case 'bash': return 'bash';
    case 'mdx': return 'mdx';
    case 'astro': return 'astro';
    case 'html': return 'html';
    default: return 'ts';
  }
}

function withInferredLang(file: WorkspaceFile) {
  return {
    name: file.name,
    content: normalizeCode(file.content),
    lang: file.lang ?? inferLang(file.name),
  };
}

function convertNameToJs(name: string) {
  return name.replace(/\.tsx$/, '.jsx').replace(/\.ts$/, '.js');
}

function convertFileToJs(file: WorkspaceFile) {
  const base = withInferredLang(file);
  if (base.lang === 'ts' || base.lang === 'tsx') {
    return {
      name: convertNameToJs(base.name),
      content: toJavaScript(base.content),
      lang: (base.lang === 'tsx' ? 'jsx' : 'js') as DocCodeLang,
    };
  }
  if (base.lang === 'vue') {
    return {
      name: base.name,
      content: toJavaScript(base.content),
      lang: 'vue' as DocCodeLang,
    };
  }
  return base;
}

export function buildWorkspaceBundles(input: WorkspaceProjectInput): WorkspaceBundle[] {
  const bundles: WorkspaceBundle[] = [];
  const includeJs = input.includeJs !== false;

  const vueEntries = Object.entries(input.vueFiles ?? {});
  if (vueEntries.length) {
    const tsFiles = vueEntries.map(([name, content]) => withInferredLang({ name, content }));
    bundles.push({
      id: 'vue-ts',
      framework: 'vue',
      variant: 'ts',
      frameworkLabel: 'Vue',
      variantLabel: 'TypeScript',
      label: 'Vue · TypeScript',
      files: tsFiles,
    });
    if (includeJs) {
      bundles.push({
        id: 'vue-js',
        framework: 'vue',
        variant: 'js',
        frameworkLabel: 'Vue',
        variantLabel: 'JavaScript',
        label: 'Vue · JavaScript',
        files: vueEntries.map(([name, content]) => convertFileToJs({ name, content })),
      });
    }
  }

  const reactEntries = Object.entries(input.reactFiles ?? {});
  if (reactEntries.length) {
    const tsFiles = reactEntries.map(([name, content]) => withInferredLang({ name, content }));
    bundles.push({
      id: 'react-ts',
      framework: 'react',
      variant: 'ts',
      frameworkLabel: 'React',
      variantLabel: 'TypeScript',
      label: 'React · TypeScript',
      files: tsFiles,
    });
    if (includeJs) {
      bundles.push({
        id: 'react-js',
        framework: 'react',
        variant: 'js',
        frameworkLabel: 'React',
        variantLabel: 'JavaScript',
        label: 'React · JavaScript',
        files: reactEntries.map(([name, content]) => convertFileToJs({ name, content })),
      });
    }
  }

  return bundles;
}

/** Wrap a flat file list as a single framework-neutral bundle (no tabs). */
export function asSingleBundle(
  files: WorkspaceFile[],
  label = 'Source',
): WorkspaceBundle {
  return {
    id: 'single',
    framework: 'neutral',
    variant: 'mixed',
    frameworkLabel: label,
    variantLabel: '',
    label,
    files: files.map(withInferredLang),
  };
}

export function buildDemoCodeGroups(input: DemoCodeInput) {
  const groups: DocCodeGroup[] = [];
  const vueContent = normalizeCode(input.vueSource ?? input.vueCode);
  const reactContent = normalizeCode(
    input.reactSource ?? (input.vueSource
      ? buildReactSourceFromVueSource(input.vueSource, input.reactCode ?? '')
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
