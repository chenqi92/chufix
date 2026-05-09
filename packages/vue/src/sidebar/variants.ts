export type SidebarSize = 'sm' | 'md' | 'lg';

export interface SidebarItem {
  key: string;
  label: string;
  icon?: string;
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
  modelValue?: string;
  openKeys?: string[];
  defaultOpenKeys?: string[];
  collapsed?: boolean;
  size?: SidebarSize;
}

export function sidebarClass(p: {
  size: SidebarSize;
  collapsed: boolean;
}): string {
  return [
    'cf-sidebar',
    `cf-sidebar--${p.size}`,
    p.collapsed && 'is-collapsed',
  ]
    .filter(Boolean)
    .join(' ');
}

export function isGroup(x: SidebarEntry): x is SidebarGroup {
  return (x as SidebarGroup).type === 'group';
}
