import type { ReactNode } from 'react';

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
  container?: HTMLElement | null;
  children?: ReactNode;
  onSelect?: (value: string, item: ContextMenuItem) => void;
  onOpen?: () => void;
  onClose?: () => void;
}
