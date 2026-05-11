export interface MenuBarItem {
  id: string;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
  children?: MenuBarItem[];
}

export interface MenuBarMenu {
  id: string;
  label: string;
  items: MenuBarItem[];
}

export interface MenuBarProps {
  menus: MenuBarMenu[];
  onSelect?: (menuId: string, itemId: string, item: MenuBarItem) => void;
  className?: string;
}
