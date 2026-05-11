export type HoverCardPlacement = 'top' | 'bottom' | 'left' | 'right';
export type HoverCardSize = 'sm' | 'md' | 'lg';

export interface HoverCardProps {
  placement?: HoverCardPlacement;
  size?: HoverCardSize;
  openDelay?: number;
  closeDelay?: number;
  disabled?: boolean;
  /** Where to teleport the floating card. Defaults to body. */
  to?: string;
}
