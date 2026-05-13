import type { ReactNode } from 'react';

export type VariableAwareInputSize = 'sm' | 'md' | 'lg';
export type VariableAwareInputVariant = 'outline' | 'filled';
export type VariableAwareInputScope = 'global' | 'project' | 'page' | 'local' | string;

export interface VariableAwareInputVariableOption {
  name: string;
  value?: string;
  label?: string;
  description?: string;
  scope?: VariableAwareInputScope;
  editable?: boolean;
  disabled?: boolean;
}

export type VariableAwareInputVariable = string | VariableAwareInputVariableOption;

export interface NormalizedVariableOption {
  name: string;
  value?: string;
  label: string;
  description?: string;
  scope?: VariableAwareInputScope;
  editable?: boolean;
  disabled?: boolean;
}

export type Token =
  | { type: 'text'; text: string; start: number; end: number }
  | {
    type: 'var';
    name: string;
    valid: boolean;
    raw: string;
    start: number;
    end: number;
    variable?: NormalizedVariableOption;
  };

export type VariableToken = Extract<Token, { type: 'var' }>;

export interface VariableSuggestionMatch {
  start: number;
  end: number;
  query: string;
}

export interface VariableAwareInputVariableEvent {
  name: string;
  token: VariableToken;
  variable?: NormalizedVariableOption;
}

export interface VariableAwareInputVariableUpdate extends VariableAwareInputVariableEvent {
  value: string;
}

export interface VariableAwareInputOptionRenderProps {
  variable: NormalizedVariableOption;
  active: boolean;
  query: string;
}

export interface VariableAwareInputPopoverRenderProps {
  variable?: NormalizedVariableOption;
  token: VariableToken;
  draftValue: string;
  setDraftValue: (value: string) => void;
  update: () => void;
  create: () => void;
  close: () => void;
}

export interface VariableAwareInputProps {
  value: string;
  onChange: (value: string) => void;
  variables?: VariableAwareInputVariable[];
  size?: VariableAwareInputSize;
  variant?: VariableAwareInputVariant;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  suggest?: boolean;
  suggestTrigger?: string;
  interactive?: boolean;
  showVariablePopover?: boolean;
  onVariableSelect?: (variable: NormalizedVariableOption) => void;
  onVariableClick?: (event: VariableAwareInputVariableEvent) => void;
  onVariableUpdate?: (event: VariableAwareInputVariableUpdate) => void;
  onVariableCreate?: (event: VariableAwareInputVariableEvent) => void;
  renderVariableOption?: (props: VariableAwareInputOptionRenderProps) => ReactNode;
  renderVariablePopover?: (props: VariableAwareInputPopoverRenderProps) => ReactNode;
}

const VAR_RE = /\{\{\s*([^}\s]+)\s*\}\}/g;

export function normalizeVariables(variables: VariableAwareInputVariable[] = []): NormalizedVariableOption[] {
  const seen = new Set<string>();
  const list: NormalizedVariableOption[] = [];

  for (const item of variables) {
    const option = typeof item === 'string' ? { name: item } : item;
    const name = option.name.trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    list.push({
      ...option,
      name,
      label: option.label ?? name,
      value: option.value,
      description: option.description,
      scope: option.scope,
      editable: option.editable,
      disabled: option.disabled,
    });
  }

  return list;
}

export function variableMap(variables: NormalizedVariableOption[]) {
  return new Map(variables.map((item) => [item.name, item]));
}

function resolveVariable(
  known: Set<string> | Map<string, NormalizedVariableOption>,
  name: string,
) {
  if (known instanceof Map) return known.get(name);
  return known.has(name) ? { name, label: name } : undefined;
}

export function parseTokens(
  value: string,
  known: Set<string> | Map<string, NormalizedVariableOption>,
): Token[] {
  if (!value) return [];
  const tokens: Token[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  VAR_RE.lastIndex = 0;
  while ((m = VAR_RE.exec(value))) {
    if (m.index > last) {
      tokens.push({ type: 'text', text: value.slice(last, m.index), start: last, end: m.index });
    }
    const name = m[1];
    const variable = resolveVariable(known, name);
    tokens.push({
      type: 'var',
      name,
      valid: Boolean(variable),
      raw: m[0],
      start: m.index,
      end: m.index + m[0].length,
      variable,
    });
    last = m.index + m[0].length;
  }
  if (last < value.length) {
    tokens.push({ type: 'text', text: value.slice(last), start: last, end: value.length });
  }
  return tokens;
}

export function findVariableTokenAt(tokens: Token[], caret: number) {
  return tokens.find((token): token is VariableToken =>
    token.type === 'var' && caret >= token.start && caret <= token.end,
  ) ?? null;
}

export function findVariableSuggestion(
  value: string,
  caret: number,
  trigger = '{{',
): VariableSuggestionMatch | null {
  if (!trigger) return null;
  const before = value.slice(0, caret);
  const start = before.lastIndexOf(trigger);
  if (start < 0) return null;
  const query = before.slice(start + trigger.length);
  if (query.includes('}') || /\s/.test(query)) return null;
  return { start, end: caret, query };
}

export function filterVariableOptions(
  variables: NormalizedVariableOption[],
  query: string,
) {
  const q = query.trim().toLowerCase();
  if (!q) return variables;
  return variables.filter((item) => {
    const haystack = [
      item.name,
      item.label,
      item.value,
      item.description,
      item.scope,
    ].filter(Boolean).join(' ').toLowerCase();
    return haystack.includes(q);
  });
}

export function applyVariableSuggestion(
  value: string,
  match: VariableSuggestionMatch,
  variable: NormalizedVariableOption,
) {
  const insert = `{{${variable.name}}}`;
  const text = `${value.slice(0, match.start)}${insert}${value.slice(match.end)}`;
  return {
    text,
    caret: match.start + insert.length,
  };
}
