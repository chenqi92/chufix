export type KVEditorSize = 'sm' | 'md' | 'lg';

export interface KVRow {
  key: string;
  value: string;
  enabled?: boolean;
  description?: string;
}

export interface KVEditorProps {
  value?: KVRow[];
  defaultValue?: KVRow[];
  size?: KVEditorSize;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  showToggle?: boolean;
  showDescription?: boolean;
  autoAppend?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  bordered?: boolean;
  className?: string;
  onChange?: (rows: KVRow[]) => void;
}

export function kvEditorClass(p: {
  size: KVEditorSize;
  bordered: boolean;
  disabled: boolean;
  readonly: boolean;
  className?: string;
}): string {
  return [
    'cf-kv',
    `cf-kv--${p.size}`,
    p.bordered && 'is-bordered',
    p.disabled && 'is-disabled',
    p.readonly && 'is-readonly',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
