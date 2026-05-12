import { useMemo, useState } from 'react';
import {
  CfAppShell,
  CfSidebar,
  CfNavMenu,
  CfBreadcrumb,
  CfTag,
  CfSearchInput,
  CfIconButton,
  CfPopover,
  CfDropdown,
  CfAvatar,
  CfBadge,
  CfDrawer,
  CfSegmentedControl,
  CfModal,
  CfForm,
  CfFormField,
  CfInput,
  CfPasswordStrength,
  toast,
} from '@chufix-design/react';
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

export default function AdminMiniDemo() {
  const [theme, setTheme] = useState<DemoTheme>('dark-cool');
  const [density, setDensity] = useState<DemoDensity>('comfortable');
  const [menuForm, setMenuForm] = useState<DemoMenuForm>('sidebar');
  const [accent, setAccent] = useState<DemoAccent>('blue');
  const [locale, setLocale] = useState<DemoLocale>('zh');
  const [route, setRoute] = useState<RouteId>('dashboard');

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

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

  function onLogout() {
    toast.info(t.logout_done);
  }

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
        <CfAppShell
          sidebarCollapsed={sidebarCollapsed}
          sidebarWidth={sidebarCollapsed ? 64 : 220}
          headerHeight={56}
          header={
            <AdminHeader
              localeLabel={locale === 'zh' ? '中' : 'EN'}
              onToggleLocale={() => setLocale((l) => (l === 'zh' ? 'en' : 'zh'))}
              onOpenSettings={() => setSettingsOpen(true)}
              onOpenProfile={() => setProfileOpen(true)}
              onOpenChangePassword={() => setPasswordOpen(true)}
              onLogout={onLogout}
              t={t}
            />
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
            {menuForm === 'topbar' && (
              <CfNavMenu
                items={sidebarItems.flatMap((g) => g.items.map((i) => ({ key: i.key, label: i.label, href: '#' + i.key })))}
                active={route}
                variant="underline"
                className="adm-body__nav"
                onNavigate={(item) => setRoute(item.key as RouteId)}
              />
            )}
            <CfBreadcrumb items={[{ label: t.brand }, { label: sidebarItems.flatMap((g) => g.items).find((i) => i.key === route)?.label ?? '' }]} />
            <h2 className="adm-body__title">{sidebarItems.flatMap((g) => g.items).find((i) => i.key === route)?.label}</h2>
            {pages[route]}
          </section>
        </CfAppShell>

        <SettingsDrawer open={settingsOpen} onOpenChange={setSettingsOpen} />
        <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
        <ChangePasswordModal open={passwordOpen} onOpenChange={setPasswordOpen} />
      </div>
    </DemoContext.Provider>
  );
}

/* ============================================================ */
/*                       AdminHeader                            */
/* ============================================================ */

interface AdminHeaderProps {
  localeLabel: string;
  onToggleLocale: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onOpenChangePassword: () => void;
  onLogout: () => void;
  t: (typeof STRINGS)[DemoLocale];
}

function AdminHeader({
  localeLabel,
  onToggleLocale,
  onOpenSettings,
  onOpenProfile,
  onOpenChangePassword,
  onLogout,
  t,
}: AdminHeaderProps) {
  const [search, setSearch] = useState('');
  const [notifs, setNotifs] = useState([
    { id: 1, title: '用户 ada 提交了新角色申请', from: 'system', at: '2 分钟前', unread: true },
    { id: 2, title: '操作日志：grace 导出了登录日志', from: 'audit',  at: '8 分钟前', unread: true },
    { id: 3, title: '字典「日志级别」新增 DEBUG 项', from: 'admin',  at: '32 分钟前', unread: false },
    { id: 4, title: '今日凌晨完成数据库自动备份', from: 'cron',   at: '昨天',       unread: false },
  ]);
  const unreadCount = notifs.filter((n) => n.unread).length;

  const userMenuItems = [
    { key: 'user-info', label: 'Admin · admin@chufix.dev', header: true },
    { key: 'divider-1', divider: true },
    { key: 'profile',         label: t.profile },
    { key: 'change-password', label: t.change_password },
    { key: 'divider-2', divider: true },
    { key: 'logout',          label: t.logout, tone: 'danger' as const },
  ];

  return (
    <div className="adm-header">
      <div className="adm-header__brand">
        <span className="adm-header__logo" />
        <span className="adm-header__title">{t.brand}</span>
        <CfTag size="sm" tone="info" variant="soft">demo</CfTag>
      </div>

      <div className="adm-header__center">
        <CfSearchInput
          modelValue={search}
          onUpdateModelValue={setSearch}
          placeholder={t.search_placeholder}
          size="sm"
        />
      </div>

      <div className="adm-header__actions">
        <CfPopover placement="bottom" width={320}>
          <button className="adm-iconbtn" type="button" aria-label={t.notifications}>
            <CfBadge count={unreadCount} max={99} dot={false} showZero={false} placement="top-right">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 1112 0c0 6 3 7 3 7H3s3-1 3-7" />
                <path d="M10 19a2 2 0 004 0" />
              </svg>
            </CfBadge>
          </button>
          <CfPopover.Content>
            <div className="adm-notif">
              <header className="adm-notif__head">
                <span className="adm-notif__title">{t.notifications}</span>
                <button
                  type="button"
                  className="adm-notif__link"
                  onClick={() => setNotifs((ns) => ns.map((n) => ({ ...n, unread: false })))}
                >
                  {t.mark_all_read}
                </button>
              </header>
              {notifs.length ? (
                <ul className="adm-notif__list">
                  {notifs.map((n) => (
                    <li
                      key={n.id}
                      className={`adm-notif__item${n.unread ? ' is-unread' : ''}`}
                    >
                      <span className="adm-notif__dot" />
                      <div className="adm-notif__body">
                        <div className="adm-notif__text">{n.title}</div>
                        <div className="adm-notif__meta">{n.from} · {n.at}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="adm-notif__empty">{t.no_notifications}</div>
              )}
            </div>
          </CfPopover.Content>
        </CfPopover>

        <button
          className="adm-iconbtn adm-iconbtn--lang"
          type="button"
          aria-label={t.switch_locale}
          onClick={onToggleLocale}
        >
          {localeLabel}
        </button>

        <button className="adm-iconbtn" type="button" aria-label={t.settings} onClick={onOpenSettings}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06A2 2 0 017.04 4.04l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.36.94 1.18 1.5 2.15 1.51H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>

        <CfDropdown
          items={userMenuItems}
          placement="bottom"
          width={200}
          onSelect={(item) => {
            if (item.key === 'profile') onOpenProfile();
            else if (item.key === 'change-password') onOpenChangePassword();
            else if (item.key === 'logout') onLogout();
          }}
        >
          <button className="adm-user" type="button">
            <CfAvatar name="Admin" size="sm" />
            <span className="adm-user__name">Admin</span>
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>
        </CfDropdown>
      </div>
    </div>
  );
}

/* ============================================================ */
/*                      SettingsDrawer                          */
/* ============================================================ */

interface SettingsDrawerProps { open: boolean; onOpenChange: (v: boolean) => void }

function SettingsDrawer({ open, onOpenChange }: SettingsDrawerProps) {
  // 简化引用：实际实现中读取 DemoContext。这里仅展示结构。
  return (
    <CfDrawer
      open={open}
      placement="right"
      size="sm"
      title="主题设置"
      onUpdateOpen={onOpenChange}
    >
      <div className="adm-settings">
        {/* theme / density / menu form / accent CfSegmentedControl + accent dots */}
      </div>
    </CfDrawer>
  );
}

/* ============================================================ */
/*                       ProfileModal                           */
/* ============================================================ */

interface ProfileModalProps { open: boolean; onOpenChange: (v: boolean) => void }

function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const [form, setForm] = useState({ name: '系统管理员', email: 'admin@chufix.dev', phone: '13800000001' });

  return (
    <CfModal
      open={open}
      onUpdateOpen={onOpenChange}
      title="个人中心"
      size="md"
      okText="保存"
      cancelText="取消"
      onBeforeOk={() => {
        toast.success('资料已保存');
        return true;
      }}
    >
      <CfForm model={form} layout="vertical">
        <CfFormField label="姓名" name="name">
          <CfInput modelValue={form.name} onUpdateModelValue={(v) => setForm({ ...form, name: v })} />
        </CfFormField>
        <CfFormField label="邮箱" name="email">
          <CfInput modelValue={form.email} onUpdateModelValue={(v) => setForm({ ...form, email: v })} />
        </CfFormField>
        <CfFormField label="手机号" name="phone">
          <CfInput modelValue={form.phone} onUpdateModelValue={(v) => setForm({ ...form, phone: v })} />
        </CfFormField>
      </CfForm>
    </CfModal>
  );
}

/* ============================================================ */
/*                     ChangePasswordModal                      */
/* ============================================================ */

interface ChangePasswordModalProps { open: boolean; onOpenChange: (v: boolean) => void }

function ChangePasswordModal({ open, onOpenChange }: ChangePasswordModalProps) {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });

  return (
    <CfModal
      open={open}
      onUpdateOpen={onOpenChange}
      title="修改密码"
      size="sm"
      okText="保存"
      cancelText="取消"
      onBeforeOk={() => {
        if (!form.current || !form.next || !form.confirm) {
          toast.error('请填写完整');
          return false;
        }
        if (form.next !== form.confirm) {
          toast.error('两次输入的新密码不一致');
          return false;
        }
        toast.success('密码已更新');
        return true;
      }}
    >
      <CfForm model={form} layout="vertical">
        <CfFormField label="当前密码" name="current">
          <CfInput modelValue={form.current} type="password" onUpdateModelValue={(v) => setForm({ ...form, current: v })} />
        </CfFormField>
        <CfFormField label="新密码" name="next">
          <CfInput modelValue={form.next} type="password" onUpdateModelValue={(v) => setForm({ ...form, next: v })} />
          {form.next ? <CfPasswordStrength value={form.next} size="sm" style={{ marginTop: 6 }} /> : null}
        </CfFormField>
        <CfFormField label="确认新密码" name="confirm">
          <CfInput modelValue={form.confirm} type="password" onUpdateModelValue={(v) => setForm({ ...form, confirm: v })} />
        </CfFormField>
      </CfForm>
    </CfModal>
  );
}
