export interface MenuBarItem {
  id: string;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
  /** Sub-items for nested submenus (one level supported in v1). */
  children?: MenuBarItem[];
}

export interface MenuBarMenu {
  id: string;
  label: string;
  items: MenuBarItem[];
}

export interface MenuBarProps {
  menus: MenuBarMenu[];
}
