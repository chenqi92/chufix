import type { ReactNode } from 'react';
import { computePopoverPosition, type PopoverPlacement } from '../popover/variants';

export type DropdownPlacement = PopoverPlacement;

export interface DropdownItem {
  key?: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  divider?: boolean;
  header?: boolean;
  tone?: 'default' | 'danger';
}

export interface DropdownProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  items: DropdownItem[];
  placement?: DropdownPlacement;
  offset?: number;
  closeOnSelect?: boolean;
  disabled?: boolean;
  width?: number | string;
  onSelect?: (item: DropdownItem, index: number) => void;
  children?: ReactNode;
}

export { computePopoverPosition as computeDropdownPosition };
