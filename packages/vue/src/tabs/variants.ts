export type TabsVariant = 'line' | 'segmented' | 'pill';
export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsAlign = 'start' | 'center' | 'end' | 'stretch';

export interface TabsItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  modelValue?: string;
  items?: TabsItem[];
  variant?: TabsVariant;
  size?: TabsSize;
  align?: TabsAlign;
}

export function tabsClass(p: {
  variant: TabsVariant;
  size: TabsSize;
  align: TabsAlign;
}): string {
  return [
    'cf-tabs',
    `cf-tabs--${p.variant}`,
    `cf-tabs--${p.size}`,
    `cf-tabs--align-${p.align}`,
  ].join(' ');
}
