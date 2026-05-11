export type MarkdownEditorSize = 'sm' | 'md' | 'lg';
export type MarkdownEditorMode = 'split' | 'edit' | 'preview';

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  mode?: MarkdownEditorMode;
  onModeChange?: (mode: MarkdownEditorMode) => void;
  size?: MarkdownEditorSize;
  placeholder?: string;
  rows?: number;
  readOnly?: boolean;
  render?: (markdown: string) => string;
  className?: string;
}

const ESC = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export function renderMarkdown(src: string): string {
  if (!src) return '';
  const lines = src.split('\n');
  const out: string[] = [];
  let i = 0;
  let inFence = false;
  let fenceLang = '';
  const fenceBuf: string[] = [];

  const flushFence = () => {
    out.push(
      `<pre class="cf-md__fence" data-lang="${ESC(fenceLang)}"><code>${ESC(
        fenceBuf.join('\n'),
      )}</code></pre>`,
    );
    fenceBuf.length = 0;
    fenceLang = '';
  };

  const renderInline = (text: string): string => {
    let r = ESC(text);
    r = r.replace(/`([^`]+)`/g, '<code class="cf-md__code">$1</code>');
    r = r.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    r = r.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    r = r.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a class="cf-md__link" href="$2">$1</a>',
    );
    return r;
  };

  while (i < lines.length) {
    const line = lines[i];

    if (inFence) {
      if (line.trim().startsWith('```')) {
        flushFence();
        inFence = false;
      } else {
        fenceBuf.push(line);
      }
      i++;
      continue;
    }

    const fenceMatch = line.match(/^```(\w*)\s*$/);
    if (fenceMatch) {
      inFence = true;
      fenceLang = fenceMatch[1] ?? '';
      i++;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      out.push(
        `<h${level} class="cf-md__h cf-md__h--${level}">${renderInline(
          heading[2],
        )}</h${level}>`,
      );
      i++;
      continue;
    }

    if (line.trim() === '---' || line.trim() === '***') {
      out.push('<hr class="cf-md__hr" />');
      i++;
      continue;
    }

    if (line.trim().startsWith('>')) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        buf.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      out.push(
        `<blockquote class="cf-md__quote">${renderInline(buf.join(' '))}</blockquote>`,
      );
      continue;
    }

    if (/^[-*+]\s/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*+]\s+/, ''));
        i++;
      }
      out.push(
        `<ul class="cf-md__ul">${items
          .map((it) => `<li>${renderInline(it)}</li>`)
          .join('')}</ul>`,
      );
      continue;
    }

    if (/^\d+\.\s/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      out.push(
        `<ol class="cf-md__ol">${items
          .map((it) => `<li>${renderInline(it)}</li>`)
          .join('')}</ol>`,
      );
      continue;
    }

    if (line.trim() === '') {
      i++;
      continue;
    }

    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^(#{1,6}|>|[-*+]\s|\d+\.\s|```)/.test(lines[i].trim())
    ) {
      para.push(lines[i]);
      i++;
    }
    if (para.length) {
      out.push(`<p class="cf-md__p">${renderInline(para.join(' '))}</p>`);
    }
  }

  if (inFence) flushFence();

  return out.join('\n');
}
