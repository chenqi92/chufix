export type MentionSize = 'sm' | 'md' | 'lg';

export interface MentionOption {
  value: string;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export interface MentionProps {
  modelValue?: string;
  defaultValue?: string;
  options: MentionOption[];
  trigger?: string;
  placeholder?: string;
  size?: MentionSize;
  rows?: number;
  disabled?: boolean;
  readonly?: boolean;
  className?: string;
}

export interface TriggerMatch {
  start: number;
  query: string;
}

export function findTrigger(text: string, caret: number, trigger: string): TriggerMatch | null {
  const before = text.slice(0, caret);
  const idx = before.lastIndexOf(trigger);
  if (idx < 0) return null;
  if (idx > 0) {
    const prev = before[idx - 1];
    if (prev && !/\s/.test(prev)) return null;
  }
  const query = before.slice(idx + trigger.length);
  if (/\s/.test(query)) return null;
  return { start: idx, query };
}

export function filterOptions(opts: MentionOption[], query: string, max = 8): MentionOption[] {
  if (!query) return opts.slice(0, max);
  const q = query.toLowerCase();
  return opts
    .filter((o) => {
      const a = o.value.toLowerCase();
      const b = (o.label ?? '').toLowerCase();
      return a.includes(q) || b.includes(q);
    })
    .slice(0, max);
}

export function applyMention(
  text: string,
  match: TriggerMatch,
  caret: number,
  trigger: string,
  picked: MentionOption,
): { text: string; caret: number } {
  const head = text.slice(0, match.start);
  const tail = text.slice(caret);
  const insert = `${trigger}${picked.value} `;
  return { text: `${head}${insert}${tail}`, caret: head.length + insert.length };
}

export function mentionClass(p: {
  size: MentionSize;
  disabled: boolean;
  readonly: boolean;
  className?: string;
}): string {
  return [
    'cf-mention',
    `cf-mention--${p.size}`,
    p.disabled && 'is-disabled',
    p.readonly && 'is-readonly',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
