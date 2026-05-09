export type AppShellVariant = 'default' | 'condensed' | 'spacious';

export interface AppShellProps {
  variant?: AppShellVariant;
  /** Sidebar width when expanded (px). */
  sidebarWidth?: number;
  /** Optional fixed header height (px). When set, header becomes sticky. */
  headerHeight?: number;
  /** When true, sidebar pane gets a right divider. */
  bordered?: boolean;
  /** Hide sidebar without removing it (useful for responsive). */
  sidebarCollapsed?: boolean;
}

export function appShellClass(p: {
  variant: AppShellVariant;
  bordered: boolean;
  sidebarCollapsed: boolean;
}): string {
  return [
    'cf-appshell',
    `cf-appshell--${p.variant}`,
    p.bordered && 'is-bordered',
    p.sidebarCollapsed && 'is-collapsed',
  ]
    .filter(Boolean)
    .join(' ');
}
