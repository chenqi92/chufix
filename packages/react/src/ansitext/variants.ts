export type AnsiTextSize = 'sm' | 'md' | 'lg';

export interface AnsiTextProps {
  text: string;
  size?: AnsiTextSize;
  wrap?: boolean;
  preserveWhitespace?: boolean;
  className?: string;
}

interface Style {
  fg?: string;
  bg?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  dim?: boolean;
  inverse?: boolean;
}

export interface AnsiSpan {
  text: string;
  style: Style;
}

const FG_COLORS: Record<number, string> = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'white',
  90: 'bright-black',
  91: 'bright-red',
  92: 'bright-green',
  93: 'bright-yellow',
  94: 'bright-blue',
  95: 'bright-magenta',
  96: 'bright-cyan',
  97: 'bright-white',
};

const BG_COLORS: Record<number, string> = {
  40: 'black',
  41: 'red',
  42: 'green',
  43: 'yellow',
  44: 'blue',
  45: 'magenta',
  46: 'cyan',
  47: 'white',
  100: 'bright-black',
  101: 'bright-red',
  102: 'bright-green',
  103: 'bright-yellow',
  104: 'bright-blue',
  105: 'bright-magenta',
  106: 'bright-cyan',
  107: 'bright-white',
};

export function parseAnsi(input: string): AnsiSpan[] {
  if (!input) return [];
  const result: AnsiSpan[] = [];
  let style: Style = {};
  let i = 0;
  let buf = '';

  const flush = () => {
    if (buf.length === 0) return;
    result.push({ text: buf, style: { ...style } });
    buf = '';
  };

  while (i < input.length) {
    const ch = input.charCodeAt(i);
    if (ch === 27 && input[i + 1] === '[') {
      flush();
      let j = i + 2;
      while (j < input.length && !/[a-zA-Z]/.test(input[j])) j++;
      const params = input.slice(i + 2, j);
      const cmd = input[j];
      if (cmd === 'm') {
        const codes = params.split(';').map((s) => (s === '' ? 0 : Number(s)));
        for (let k = 0; k < codes.length; k++) {
          const c = codes[k];
          if (c === 0) style = {};
          else if (c === 1) style.bold = true;
          else if (c === 2) style.dim = true;
          else if (c === 3) style.italic = true;
          else if (c === 4) style.underline = true;
          else if (c === 7) style.inverse = true;
          else if (c === 22) {
            style.bold = false;
            style.dim = false;
          } else if (c === 23) style.italic = false;
          else if (c === 24) style.underline = false;
          else if (c === 27) style.inverse = false;
          else if (c === 39) style.fg = undefined;
          else if (c === 49) style.bg = undefined;
          else if (FG_COLORS[c]) style.fg = FG_COLORS[c];
          else if (BG_COLORS[c]) style.bg = BG_COLORS[c];
        }
      }
      i = j + 1;
      continue;
    }
    buf += input[i];
    i++;
  }
  flush();
  return result;
}

export function spanClass(span: AnsiSpan): string {
  const cls = ['cf-ansi__span'];
  if (span.style.fg) cls.push(`cf-ansi__fg-${span.style.fg}`);
  if (span.style.bg) cls.push(`cf-ansi__bg-${span.style.bg}`);
  if (span.style.bold) cls.push('cf-ansi__bold');
  if (span.style.dim) cls.push('cf-ansi__dim');
  if (span.style.italic) cls.push('cf-ansi__italic');
  if (span.style.underline) cls.push('cf-ansi__underline');
  if (span.style.inverse) cls.push('cf-ansi__inverse');
  return cls.join(' ');
}
