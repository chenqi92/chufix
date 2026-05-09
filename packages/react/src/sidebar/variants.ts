export type SidebarSize = 'sm' | 'md' | 'lg';

export interface SidebarItem {
  key: string;
  label: string;
  icon?: import('react').ReactNode;
  href?: string;
  badge?: string | number;
  disabled?: boolean;
  children?: SidebarItem[];
}

export interface SidebarGroup {
  type: 'group';
  key?: string;
  label?: string;
  items: SidebarItem[];
}

export type SidebarEntry = SidebarItem | SidebarGroup;

export interface SidebarProps {
  items: SidebarEntry[];
  value?: string;
  defaultValue?: string;
  openKeys?: string[];
  defaultOpenKeys?: string[];
  collapsed?: boolean;
  size?: SidebarSize;
  className?: string;
  onChange?: (key: string, item: SidebarItem) => void;
  onOpenKeysChange?: (keys: string[]) => void;
  onSelect?: (item: SidebarItem) => void;
}

export function sidebarClass(p: {
  size: SidebarSize;
  collapsed: boolean;
  className?: string;
}): string {
  return [
    'cf-sidebar',
    `cf-sidebar--${p.size}`,
    p.collapsed && 'is-collapsed',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function isGroup(x: SidebarEntry): x is SidebarGroup {
  return (x as SidebarGroup).type === 'group';
}
