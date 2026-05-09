export type NavMenuVariant = 'underline' | 'pill' | 'minimal';

export interface NavMenuLink {
  label: string;
  description?: string;
  href: string;
  icon?: import('react').ReactNode;
}

export interface NavMenuItem {
  key: string;
  label: string;
  href?: string;
  links?: NavMenuLink[];
  columns?: 1 | 2 | 3;
  disabled?: boolean;
}

export interface NavMenuProps {
  items: NavMenuItem[];
  active?: string;
  variant?: NavMenuVariant;
  trigger?: 'hover' | 'click';
  className?: string;
  onNavigate?: (item: NavMenuItem) => void;
}

export function navMenuClass(p: {
  variant: NavMenuVariant;
  className?: string;
}): string {
  return ['cf-navmenu', `cf-navmenu--${p.variant}`, p.className]
    .filter(Boolean)
    .join(' ');
}
