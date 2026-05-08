export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DrawerProps {
  open?: boolean;
  title?: string;
  placement?: DrawerPlacement;
  size?: DrawerSize;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  showClose?: boolean;
  /** Where to teleport. Defaults to body. */
  to?: string;
}
