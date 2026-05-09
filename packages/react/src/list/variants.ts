export type ListSize = 'sm' | 'md' | 'lg';
export type ListVariant = 'default' | 'divided' | 'card';
export type ListSelectable = 'single' | 'multiple';

export interface ListItem {
  key: string;
  label?: string;
  description?: string;
  leading?: import('react').ReactNode;
  trailing?: import('react').ReactNode;
  disabled?: boolean;
  group?: string;
  [extra: string]: unknown;
}

export interface ListProps {
  items: ListItem[];
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  selectable?: ListSelectable;
  size?: ListSize;
  variant?: ListVariant;
  bordered?: boolean;
  hoverable?: boolean;
  emptyText?: import('react').ReactNode;
  className?: string;
  renderItem?: (item: ListItem, ctx: { selected: boolean }) => import('react').ReactNode;
  onChange?: (value: string | string[] | null) => void;
  onSelect?: (item: ListItem) => void;
}

export function listClass(p: {
  size: ListSize;
  variant: ListVariant;
  bordered: boolean;
  hoverable: boolean;
  selectable: boolean;
  className?: string;
}): string {
  return [
    'cf-list',
    `cf-list--${p.size}`,
    `cf-list--${p.variant}`,
    p.bordered && 'is-bordered',
    p.hoverable && 'is-hoverable',
    p.selectable && 'is-selectable',
    p.className,
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
