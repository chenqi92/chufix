import { useMemo, useState } from 'react';
import { CfAppShell, CfSidebar, CfNavMenu, CfBreadcrumb, CfTag } from '@chufix-design/react';
import Toolbar from './Toolbar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Roles from './pages/Roles';
import UserRoles from './pages/UserRoles';
import Dict from './pages/Dict';
import OperationLog from './pages/OperationLog';
import LoginLog from './pages/LoginLog';
import {
  ACCENT_HUE,
  DemoContext,
  STRINGS,
  type DemoTheme,
  type DemoDensity,
  type DemoMenuForm,
  type DemoAccent,
  type DemoLocale,
} from './state';

type RouteId = 'dashboard' | 'users' | 'roles' | 'user-roles' | 'dict' | 'op-log' | 'login-log';

interface Props { sourceOpen?: boolean; onToggleSource?: () => void }

export default function AdminMiniDemo({ sourceOpen, onToggleSource }: Props) {
  const [theme, setTheme] = useState<DemoTheme>('dark-cool');
  const [density, setDensity] = useState<DemoDensity>('comfortable');
  const [menuForm, setMenuForm] = useState<DemoMenuForm>('sidebar');
  const [accent, setAccent] = useState<DemoAccent>('blue');
  const [locale, setLocale] = useState<DemoLocale>('zh');
  const [route, setRoute] = useState<RouteId>('dashboard');

  const t = STRINGS[locale];

  const sidebarItems = useMemo(() => [
    {
      type: 'group' as const,
      label: t.grp_overview,
      items: [{ key: 'dashboard', label: t.page_dashboard }],
    },
    {
      type: 'group' as const,
      label: t.grp_authz,
      items: [
        { key: 'users',      label: t.page_users },
        { key: 'roles',      label: t.page_roles },
        { key: 'user-roles', label: t.page_user_roles },
      ],
    },
    {
      type: 'group' as const,
      label: t.grp_system,
      items: [
        { key: 'dict',      label: t.page_dict },
        { key: 'op-log',    label: t.page_op_log },
        { key: 'login-log', label: t.page_login_log },
      ],
    },
  ], [t]);

  const pages: Record<RouteId, JSX.Element> = {
    'dashboard':  <Dashboard />,
    'users':      <Users />,
    'roles':      <Roles />,
    'user-roles': <UserRoles />,
    'dict':       <Dict />,
    'op-log':     <OperationLog />,
    'login-log':  <LoginLog />,
  };

  const showSidebar = menuForm !== 'topbar';
  const sidebarCollapsed = menuForm === 'collapsed';

  return (
    <DemoContext.Provider
      value={{ theme, setTheme, density, setDensity, menuForm, setMenuForm, accent, setAccent, locale, setLocale }}
    >
      <div
        className="adm-root"
        data-theme={theme}
        data-density={density}
        style={{ ['--accent-1' as never]: ACCENT_HUE[accent] }}
      >
        <Toolbar sourceOpen={!!sourceOpen} onToggleSource={() => onToggleSource?.()} />

        <CfAppShell
          sidebarCollapsed={sidebarCollapsed}
          sidebarWidth={sidebarCollapsed ? 64 : 220}
          header={
            <div className="adm-header">
              <div className="adm-header__brand">
                <span className="adm-header__logo" />
                <span className="adm-header__title">{t.brand}</span>
                <CfTag size="sm" tone="info" variant="soft">demo</CfTag>
              </div>
              {menuForm === 'topbar' && (
                <CfNavMenu
                  items={sidebarItems.flatMap((g) => g.items.map((i) => ({ key: i.key, label: i.label, href: '#' + i.key })))}
                  active={route}
                  variant="underline"
                  onNavigate={(item) => setRoute(item.key as RouteId)}
                />
              )}
            </div>
          }
          sidebar={
            showSidebar ? (
              <CfSidebar
                items={sidebarItems}
                modelValue={route}
                collapsed={sidebarCollapsed}
                onUpdateModelValue={(key) => setRoute(key as RouteId)}
              />
            ) : undefined
          }
        >
          <section className="adm-body">
            <CfBreadcrumb items={[{ label: t.brand }, { label: t.page_dashboard /* 简化示意 */ }]} />
            <h2 className="adm-body__title">{sidebarItems.flatMap((g) => g.items).find((i) => i.key === route)?.label}</h2>
            {pages[route]}
          </section>
        </CfAppShell>
      </div>
    </DemoContext.Provider>
  );
}
