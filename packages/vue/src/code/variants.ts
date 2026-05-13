import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

export type CodeBlockSize = 'sm' | 'md' | 'lg';
export type CodeBlockTone = 'auto' | 'light' | 'dark';

export interface InlineCodeProps {
  size?: 'sm' | 'md';
}

export interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  size?: CodeBlockSize;
  showLineNumbers?: boolean;
  copyable?: boolean;
  maxHeight?: number | string;
  startLine?: number;
  wrap?: boolean;
  tone?: CodeBlockTone;
  trimIndent?: boolean;
  /**
   * Internal lightweight highlighter. Set to false when passing highlightedHtml
   * from shiki / highlight.js / prism or when plain text is desired.
   */
  highlight?: boolean;
  /** Sanitized HTML from an external highlighter. */
  highlightedHtml?: string;
  className?: string;
}

export interface CodeWorkspaceFile {
  id?: string;
  name: string;
  content: string;
  language?: string;
  highlightedHtml?: string;
  readonly?: boolean;
}

/**
 * 多框架 / 多变体源码包。把同一个工程的 Vue×TS / Vue×JS / React×TS / React×JS 等
 * 平行实现塞到一个 bundles 数组里，CodeWorkspace 会在顶部渲染「框架 tab + 变体 tab」让用户切换。
 * 同一时刻只有 active bundle 的文件树与文件 tab 可见。
 *
 * - framework: 框架标识。'vue' / 'react' / 'neutral'（不归任何框架，例如 shell 命令）。
 *              相同 framework 但不同 variant 的多个 bundle 形成「变体 tab」。
 * - variant:   变体标识。'ts' / 'js' / 'shell' 等。
 * - files:     该 bundle 的源码文件，沿用 CodeWorkspaceFile 类型。
 */
export interface CodeWorkspaceBundle {
  id: string;
  framework: 'vue' | 'react' | 'neutral' | (string & {});
  variant: 'ts' | 'js' | 'shell' | (string & {});
  frameworkLabel: string;
  variantLabel: string;
  label?: string;
  files: CodeWorkspaceFile[];
}

export interface CodeWorkspaceProps {
  /** 单 bundle 模式：直接传文件数组。兼容 v0.2 之前的用法。 */
  files?: CodeWorkspaceFile[];
  /** 多 bundle 模式：每个 bundle 一组文件 + 框架/变体标签；与 files 二选一。 */
  bundles?: CodeWorkspaceBundle[];
  /** 当前激活的文件 id；files 模式下生效。 */
  activeFile?: string;
  defaultFile?: string;
  /** 当前激活的 bundle id；bundles 模式下生效。 */
  activeBundle?: string;
  defaultBundle?: string;
  title?: string;
  rootLabel?: string;
  size?: CodeBlockSize;
  showLineNumbers?: boolean;
  copyable?: boolean;
  editable?: boolean;
  readOnly?: boolean;
  wrap?: boolean;
  tone?: CodeBlockTone;
  trimIndent?: boolean;
  highlight?: boolean;
  height?: number | string;
  className?: string;
}

export interface CodeTreeItem {
  id: string;
  kind: 'folder' | 'file';
  name: string;
  path: string;
  depth: number;
  file?: CodeWorkspaceFile;
}

export function codeBlockClass(p: {
  size: CodeBlockSize;
  showLineNumbers: boolean;
  wrap?: boolean;
  tone?: CodeBlockTone;
  className?: string;
}): string {
  return [
    'cf-code-block',
    `cf-code-block--${p.size}`,
    `cf-code-block--${p.tone ?? 'light'}`,
    p.showLineNumbers && 'has-numbers',
    p.wrap && 'is-wrap',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function codeWorkspaceClass(p: {
  size: CodeBlockSize;
  showLineNumbers: boolean;
  editable?: boolean;
  wrap?: boolean;
  tone?: CodeBlockTone;
  className?: string;
}): string {
  return [
    'cf-code-workspace',
    `cf-code-workspace--${p.size}`,
    `cf-code-workspace--${p.tone ?? 'light'}`,
    p.showLineNumbers && 'has-numbers',
    p.editable && 'is-editable',
    p.wrap && 'is-wrap',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function codeFileId(file: CodeWorkspaceFile): string {
  return file.id ?? file.name;
}

export function codeFileName(path: string): string {
  const parts = path.split('/').filter(Boolean);
  return parts.at(-1) ?? path;
}

export function detectLanguageFromName(name: string): string {
  const ext = name.split('.').at(-1)?.toLowerCase();
  switch (ext) {
    case 'vue':
      return 'vue';
    case 'tsx':
    case 'jsx':
      return ext;
    case 'ts':
      return 'typescript';
    case 'js':
    case 'mjs':
    case 'cjs':
      return 'javascript';
    case 'json':
      return 'json';
    case 'css':
    case 'scss':
    case 'less':
      return 'css';
    case 'html':
    case 'astro':
    case 'mdx':
      return ext;
    case 'sh':
    case 'bash':
    case 'zsh':
      return 'bash';
    default:
      return ext ?? 'plaintext';
  }
}

export function codeFileLanguage(file: CodeWorkspaceFile): string {
  return file.language ?? detectLanguageFromName(file.name);
}

export function normalizeCodeIndent(code: string): string {
  const lines = code.replace(/\r\n/g, '\n').split('\n');
  while (lines.length > 1 && lines[0]?.trim() === '') lines.shift();
  while (lines.length > 1 && lines.at(-1)?.trim() === '') lines.pop();
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^ */)?.[0].length ?? 0);
  const min = indents.length > 0 ? Math.min(...indents) : 0;
  return min > 0 ? lines.map((line) => line.slice(min)).join('\n') : lines.join('\n');
}

export function codeLines(code: string, trimIndent?: boolean): string[] {
  return (trimIndent ? normalizeCodeIndent(code) : code).split('\n');
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const JS_KEYWORDS = new Set([
  'as',
  'async',
  'await',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'default',
  'else',
  'export',
  'extends',
  'false',
  'finally',
  'for',
  'from',
  'function',
  'if',
  'import',
  'in',
  'interface',
  'let',
  'new',
  'null',
  'return',
  'switch',
  'throw',
  'true',
  'try',
  'type',
  'undefined',
  'while',
]);

function languageGroup(language?: string): 'markup' | 'css' | 'shell' | 'js' | 'json' | 'plain' {
  const lang = (language ?? '').toLowerCase();
  if (['vue', 'html', 'astro', 'mdx', 'xml', 'svg'].includes(lang)) return 'markup';
  if (['css', 'scss', 'less'].includes(lang)) return 'css';
  if (['bash', 'sh', 'zsh', 'shell'].includes(lang)) return 'shell';
  if (['json', 'jsonc'].includes(lang)) return 'json';
  if (['js', 'jsx', 'javascript', 'ts', 'tsx', 'typescript'].includes(lang)) return 'js';
  return 'plain';
}

function tokenClass(raw: string, group: ReturnType<typeof languageGroup>): string {
  if (/^(\/\/|\/\*|#|<!--)/.test(raw)) return 'comment';
  if (/^['"`]/.test(raw)) return 'string';
  if (/^<\/?/.test(raw)) return 'tag';
  if (/^--[\w-]+/.test(raw) || /^#[\da-fA-F]{3,8}\b/.test(raw)) return 'property';
  if (/^-{1,2}[\w-]+/.test(raw)) return 'property';
  if (/^\d/.test(raw)) return 'number';
  if (group === 'css' && /:$/.test(raw)) return 'property';
  if (JS_KEYWORDS.has(raw)) return 'keyword';
  if (group === 'shell' && /^(pnpm|npm|yarn|git|cd|mkdir|export|curl|npx|node)$/.test(raw)) {
    return 'keyword';
  }
  return 'text';
}

function tokenPattern(group: ReturnType<typeof languageGroup>): RegExp | null {
  if (group === 'plain') return null;
  if (group === 'markup') {
    return /<!--.*?-->|<\/?[A-Za-z][\w:.-]*(?:\s+[^<>]*?)?\/?>|(['"])(?:\\.|(?!\1)[\s\S])*?\1|\b\d+(?:\.\d+)?\b/g;
  }
  if (group === 'css') {
    return /\/\*.*?\*\/|(['"])(?:\\.|(?!\1)[\s\S])*?\1|--[\w-]+|#[\da-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw)?\b|[A-Za-z-]+(?=\s*:)/g;
  }
  if (group === 'shell') {
    return /#.*|(['"])(?:\\.|(?!\1)[\s\S])*?\1|--[\w-]+|\b(?:pnpm|npm|yarn|git|cd|mkdir|export|curl|npx|node)\b/g;
  }
  if (group === 'json') {
    return /"(?:\\.|[^"\\])*"|\b(?:true|false|null)\b|-?\b\d+(?:\.\d+)?\b/g;
  }
  return /\/\/.*|\/\*.*?\*\/|(['"`])(?:\\.|(?!\1)[\s\S])*?\1|\b(?:as|async|await|break|case|catch|class|const|continue|default|else|export|extends|false|finally|for|from|function|if|import|in|interface|let|new|null|return|switch|throw|true|try|type|undefined|while)\b|\b\d+(?:\.\d+)?\b/g;
}

function prismLanguage(language?: string): string {
  const lang = (language ?? '').toLowerCase();
  switch (lang) {
    case 'bash':
    case 'sh':
    case 'shell':
    case 'zsh':
      return 'bash';
    case 'html':
    case 'vue':
    case 'xml':
    case 'svg':
      return 'markup';
    case 'js':
    case 'mjs':
    case 'cjs':
      return 'javascript';
    case 'ts':
      return 'typescript';
    case 'jsonc':
      return 'json';
    default:
      return lang || 'plain';
  }
}

function highlightWithPrism(source: string, language?: string): string | null {
  const lang = prismLanguage(language);
  const grammar = Prism.languages[lang];
  if (!grammar) return null;
  try {
    return Prism.highlight(source, grammar, lang);
  } catch {
    return null;
  }
}

export function highlightCode(code: string, language?: string, trimIndent?: boolean): string {
  const source = trimIndent ? normalizeCodeIndent(code) : code;
  const prismHtml = highlightWithPrism(source, language);
  if (prismHtml) return prismHtml;

  const group = languageGroup(language);
  const pattern = tokenPattern(group);
  if (!pattern) return escapeHtml(source);

  return source
    .split('\n')
    .map((line) => {
      let out = '';
      let last = 0;
      for (const match of line.matchAll(pattern)) {
        const raw = match[0];
        const index = match.index ?? 0;
        out += escapeHtml(line.slice(last, index));
        const cls = tokenClass(raw, group);
        out += cls === 'text'
          ? escapeHtml(raw)
          : `<span class="cf-code-token cf-code-token--${cls}">${escapeHtml(raw)}</span>`;
        last = index + raw.length;
      }
      out += escapeHtml(line.slice(last));
      return out || ' ';
    })
    .join('\n');
}

export function buildCodeTree(files: CodeWorkspaceFile[]): CodeTreeItem[] {
  const rows: CodeTreeItem[] = [];
  const seen = new Set<string>();
  for (const file of files) {
    const parts = file.name.split('/').filter(Boolean);
    let path = '';
    for (let i = 0; i < parts.length - 1; i++) {
      path = path ? `${path}/${parts[i]}` : parts[i]!;
      if (!seen.has(path)) {
        seen.add(path);
        rows.push({
          id: `folder:${path}`,
          kind: 'folder',
          name: parts[i]!,
          path,
          depth: i,
        });
      }
    }
    rows.push({
      id: `file:${codeFileId(file)}`,
      kind: 'file',
      name: parts.at(-1) ?? file.name,
      path: file.name,
      depth: Math.max(0, parts.length - 1),
      file,
    });
  }
  return rows;
}
