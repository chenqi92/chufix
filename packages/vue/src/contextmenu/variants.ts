export interface ContextMenuItem {
  label?: string;
  value?: string;
  disabled?: boolean;
  danger?: boolean;
  shortcut?: string;
  separator?: boolean;
}

export interface ContextMenuProps {
  items: ContextMenuItem[];
  disabled?: boolean;
  /** Where to teleport the menu. Defaults to body. */
  to?: string;
}
