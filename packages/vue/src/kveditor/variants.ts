export type KVEditorSize = 'sm' | 'md' | 'lg';

export interface KVRow {
  key: string;
  value: string;
  /** Optional flag for "include in request" toggle. */
  enabled?: boolean;
  description?: string;
}

export interface KVEditorProps {
  modelValue?: KVRow[];
  size?: KVEditorSize;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  showToggle?: boolean;
  showDescription?: boolean;
  /** Auto-add an empty trailing row. */
  autoAppend?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  bordered?: boolean;
}

export function kvEditorClass(p: {
  size: KVEditorSize;
  bordered: boolean;
  disabled: boolean;
  readonly: boolean;
}): string {
  return [
    'cf-kv',
    `cf-kv--${p.size}`,
    p.bordered && 'is-bordered',
    p.disabled && 'is-disabled',
    p.readonly && 'is-readonly',
  ]
    .filter(Boolean)
    .join(' ');
}
