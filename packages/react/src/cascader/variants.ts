export type CascaderSize = 'sm' | 'md' | 'lg';

export interface CascaderOption {
  value: string;
  label: string;
  disabled?: boolean;
  children?: CascaderOption[];
}

export interface CascaderProps {
  options: CascaderOption[];
  value?: string[];
  defaultValue?: string[];
  placeholder?: string;
  separator?: string;
  size?: CascaderSize;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
  onChange?: (value: string[]) => void;
}

export function cascaderClass(p: {
  size: CascaderSize;
  disabled: boolean;
  className?: string;
}): string {
  return [
    'cf-cascader',
    `cf-cascader--${p.size}`,
    p.disabled && 'is-disabled',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function getLabelPath(options: CascaderOption[], path: string[]): string[] {
  const labels: string[] = [];
  let level = options;
  for (const v of path) {
    const found = level.find((o) => o.value === v);
    if (!found) break;
    labels.push(found.label);
    level = found.children ?? [];
  }
  return labels;
}
