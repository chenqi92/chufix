export type VariableAwareInputSize = 'sm' | 'md' | 'lg';
export type VariableAwareInputVariant = 'outline' | 'filled';

export type Token =
  | { type: 'text'; text: string }
  | { type: 'var'; name: string; valid: boolean; raw: string };

export interface VariableAwareInputProps {
  modelValue?: string;
  variables?: string[];
  size?: VariableAwareInputSize;
  variant?: VariableAwareInputVariant;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}

const VAR_RE = /\{\{\s*([^}\s]+)\s*\}\}/g;

export function parseTokens(value: string, known: Set<string>): Token[] {
  if (!value) return [];
  const tokens: Token[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  VAR_RE.lastIndex = 0;
  while ((m = VAR_RE.exec(value))) {
    if (m.index > last) {
      tokens.push({ type: 'text', text: value.slice(last, m.index) });
    }
    const name = m[1];
    tokens.push({
      type: 'var',
      name,
      valid: known.has(name),
      raw: m[0],
    });
    last = m.index + m[0].length;
  }
  if (last < value.length) {
    tokens.push({ type: 'text', text: value.slice(last) });
  }
  return tokens;
}
