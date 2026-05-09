export type NavMenuVariant = 'underline' | 'pill' | 'minimal';

export interface NavMenuLink {
  label: string;
  description?: string;
  href: string;
  icon?: string;
}

export interface NavMenuItem {
  key: string;
  label: string;
  href?: string;
  /** When provided, hovering / clicking the trigger opens a rich panel. */
  links?: NavMenuLink[];
  /** Number of columns when rendering links grid. */
  columns?: 1 | 2 | 3;
  disabled?: boolean;
}

export interface NavMenuProps {
  items: NavMenuItem[];
  active?: string;
  variant?: NavMenuVariant;
  trigger?: 'hover' | 'click';
}

export function navMenuClass(p: { variant: NavMenuVariant }): string {
  return ['cf-navmenu', `cf-navmenu--${p.variant}`].join(' ');
}
