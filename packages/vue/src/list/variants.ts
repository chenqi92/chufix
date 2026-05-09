export type ListSize = 'sm' | 'md' | 'lg';
export type ListVariant = 'default' | 'divided' | 'card';
export type ListSelectable = 'single' | 'multiple';

export interface ListItem {
  key: string;
  label?: string;
  description?: string;
  leading?: string;
  trailing?: string;
  disabled?: boolean;
  group?: string;
  [extra: string]: unknown;
}

export interface ListProps {
  items: ListItem[];
  modelValue?: string | string[] | null;
  selectable?: ListSelectable;
  size?: ListSize;
  variant?: ListVariant;
  bordered?: boolean;
  hoverable?: boolean;
  emptyText?: string;
}

export function listClass(p: {
  size: ListSize;
  variant: ListVariant;
  bordered: boolean;
  hoverable: boolean;
  selectable: boolean;
}): string {
  return [
    'cf-list',
    `cf-list--${p.size}`,
    `cf-list--${p.variant}`,
    p.bordered && 'is-bordered',
    p.hoverable && 'is-hoverable',
    p.selectable && 'is-selectable',
  ]
    .filter(Boolean)
    .join(' ');
}

export function groupItems(items: ListItem[]): Array<[string | null, ListItem[]]> {
  const groups = new Map<string | null, ListItem[]>();
  const order: Array<string | null> = [];
  for (const item of items) {
    const key = item.group ?? null;
    if (!groups.has(key)) {
      groups.set(key, []);
      order.push(key);
    }
    groups.get(key)!.push(item);
  }
  return order.map((key) => [key, groups.get(key)!]);
}
