export type TabsVariant = 'line' | 'segmented' | 'pill';
export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsAlign = 'start' | 'center' | 'end' | 'stretch';

export interface TabsItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  items?: TabsItem[];
  variant?: TabsVariant;
  size?: TabsSize;
  align?: TabsAlign;
  onChange?: (v: string) => void;
  children?: React.ReactNode;
}

export function tabsClass(p: {
  variant: TabsVariant;
  size: TabsSize;
  align: TabsAlign;
}): string {
  return [
    'ck-tabs',
    `ck-tabs--${p.variant}`,
    `ck-tabs--${p.size}`,
    `ck-tabs--align-${p.align}`,
  ].join(' ');
}
