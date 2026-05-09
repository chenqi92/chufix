import { type CSSProperties } from 'react';
import { appShellClass, type AppShellProps } from './variants';

export function AppShell(props: AppShellProps) {
  const {
    variant = 'default',
    sidebarWidth = 240,
    headerHeight,
    bordered = true,
    sidebarCollapsed = false,
    header,
    sidebar,
    aside,
    footer,
    className,
    children,
  } = props;

  const styles: CSSProperties = {
    ['--cf-appshell-sidebar-width' as never]: `${sidebarWidth}px`,
    ...(headerHeight
      ? { ['--cf-appshell-header-height' as never]: `${headerHeight}px` }
      : {}),
  };

  return (
    <div
      className={appShellClass({ variant, bordered, sidebarCollapsed, className })}
      style={styles}
    >
      {header ? <header className="cf-appshell__header">{header}</header> : null}
      {sidebar ? <aside className="cf-appshell__sidebar">{sidebar}</aside> : null}
      <main className="cf-appshell__main">{children}</main>
      {aside ? <aside className="cf-appshell__aside">{aside}</aside> : null}
      {footer ? <footer className="cf-appshell__footer">{footer}</footer> : null}
    </div>
  );
}
