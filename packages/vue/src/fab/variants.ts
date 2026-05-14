export type FabSize = 'sm' | 'md' | 'lg';
export type FabVariant = 'primary' | 'secondary' | 'tertiary';
export type FabPosition = 'bottom-right' | 'bottom-left' | 'bottom-center';

export interface FabProps {
  /** Visible label (auto enables extended mode). */
  label?: string;
  /** Force extended (pill with label). Default: auto from `label` presence. */
  extended?: boolean;
  size?: FabSize;
  variant?: FabVariant;
  position?: FabPosition;
  /** Hide on scroll down, reveal on scroll up. */
  hideOnScroll?: boolean;
  /** Numeric / textual badge. Falsy values hide. */
  badge?: number | string;
  /** Disable button. */
  disabled?: boolean;
  /** Aria label for icon-only FAB. */
  ariaLabel?: string;
}
