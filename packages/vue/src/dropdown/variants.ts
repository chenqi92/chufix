import { computePopoverPosition, type PopoverPlacement } from '../popover/variants';

export type DropdownPlacement = PopoverPlacement;

export interface DropdownItem {
  /** Unique key. If omitted, label is used. */
  key?: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  /** Render as section divider. label is ignored. */
  divider?: boolean;
  /** Render as non-interactive section title. */
  header?: boolean;
  /** Optional tone for destructive actions etc. */
  tone?: 'default' | 'danger';
}

export interface DropdownProps {
  open?: boolean;
  items: DropdownItem[];
  placement?: DropdownPlacement;
  offset?: number;
  closeOnSelect?: boolean;
  disabled?: boolean;
  width?: number | string;
}

export { computePopoverPosition as computeDropdownPosition };
