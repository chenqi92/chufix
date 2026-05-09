export type AppShellVariant = 'default' | 'condensed' | 'spacious';

export interface AppShellProps {
  variant?: AppShellVariant;
  sidebarWidth?: number;
  headerHeight?: number;
  bordered?: boolean;
  sidebarCollapsed?: boolean;
  header?: import('react').ReactNode;
  sidebar?: import('react').ReactNode;
  aside?: import('react').ReactNode;
  footer?: import('react').ReactNode;
  className?: string;
  children?: import('react').ReactNode;
}

export function appShellClass(p: {
  variant: AppShellVariant;
  bordered: boolean;
  sidebarCollapsed: boolean;
  className?: string;
}): string {
  return [
    'cf-appshell',
    `cf-appshell--${p.variant}`,
    p.bordered && 'is-bordered',
    p.sidebarCollapsed && 'is-collapsed',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
