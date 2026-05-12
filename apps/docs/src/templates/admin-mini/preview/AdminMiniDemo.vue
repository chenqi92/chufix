<script setup lang="ts">
/**
 * admin-mini · 实时演示。
 * 顶部 AdminHeader（搜索 / 消息铃铛 / 语言 / 主题齿轮 / 用户头像下拉）；
 * 中间 CfAppShell + CfSidebar / CfNavMenu + CfBreadcrumb；
 * 右抽屉 SettingsDrawer 装主题/密度/菜单/主色；个人中心 + 修改密码用 Modal；
 * 7 个子页面随菜单切换。
 */
import { computed, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue';
import { CfAppShell, CfSidebar, CfNavMenu, CfBreadcrumb, CfCommandPalette, CfTour, toast } from '@chufix-design/vue';
import type { SidebarEntry, SidebarItem, CommandPaletteItem, TourStep } from '@chufix-design/vue';
import AdminHeader from './AdminHeader.vue';
import Login from './Login.vue';
import SettingsDrawer from './SettingsDrawer.vue';
import ProfileModal from './ProfileModal.vue';
import ChangePasswordModal from './ChangePasswordModal.vue';
import Dashboard from './pages/Dashboard.vue';
import Users from './pages/Users.vue';
import Roles from './pages/Roles.vue';
import UserRoles from './pages/UserRoles.vue';
import Dict from './pages/Dict.vue';
import OperationLog from './pages/OperationLog.vue';
import LoginLog from './pages/LoginLog.vue';
import SystemSettings from './pages/SystemSettings.vue';
import Org from './pages/Org.vue';
import Menus from './pages/Menus.vue';
import {
  ACCENT_HUE,
  DemoStateKey,
  STRINGS,
  type DemoTheme,
  type DemoDensity,
  type DemoMenuForm,
  type DemoAccent,
  type DemoLocale,
} from './state';

type RouteId = 'dashboard' | 'users' | 'roles' | 'user-roles' | 'org' | 'dict' | 'op-log' | 'login-log' | 'menus' | 'sys-settings';

/* 默认主题尽量跟宿主页面一致：SSR 时先放 dark-cool 占位，hydrate 后用 onMounted 读取宿主 <html> / <body> 上的 data-theme 覆盖。 */
const theme = ref<DemoTheme>('dark-cool');
const density = ref<DemoDensity>('comfortable');
const menuForm = ref<DemoMenuForm>('sidebar');
const accent = ref<DemoAccent>('blue');
const locale = ref<DemoLocale>('zh');
const route = ref<RouteId>('dashboard');

provide(DemoStateKey, { theme, density, menuForm, accent, locale });

const t = computed(() => STRINGS[locale.value]);

// 顶部交互入口
const settingsOpen = ref(false);
const profileOpen = ref(false);
const passwordOpen = ref(false);
const paletteOpen = ref(false);
const tourOpen = ref(false);

/* ---------- 登录态 ---------- */
const AUTH_KEY = 'chufix-tpl:admin-mini:auth';
const authedUser = ref<string | null>(null);
function onLoginSuccess(payload: { username: string; remember: boolean }) {
  authedUser.value = payload.username;
  try {
    if (payload.remember) window.sessionStorage.setItem(AUTH_KEY, payload.username);
    else window.sessionStorage.removeItem(AUTH_KEY);
  } catch { /* storage blocked */ }
  toast.success(t.value.login_welcome.replace('{user}', payload.username));
  // 首次登录后弹出引导（同一 session 只弹一次）
  try {
    if (!window.sessionStorage.getItem('chufix-tpl:admin-mini:tour-done')) {
      setTimeout(() => (tourOpen.value = true), 600);
      window.sessionStorage.setItem('chufix-tpl:admin-mini:tour-done', '1');
    }
  } catch { /* */ }
}
function onLogout() {
  authedUser.value = null;
  try { window.sessionStorage.removeItem(AUTH_KEY); } catch { /* */ }
  toast.info(t.value.logout_done);
}

/* ---------- 全局快捷键：Ctrl/⌘ + K 打开 command palette ---------- */
function onGlobalKey(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    paletteOpen.value = !paletteOpen.value;
  }
}
/* ---------- 主题：从宿主页面继承默认值；把当前选择同步到 body 让 Teleport 出去的弹层（Modal / Drawer / Tour / Popover）也继承同一套主题。 ---------- */
const HOST_THEME_BACKUP_KEY = '__chufix_admin_mini_theme_backup__';

function applyToBody() {
  if (typeof document === 'undefined') return;
  const body = document.body;
  body.setAttribute('data-theme', theme.value);
  body.setAttribute('data-density', density.value);
  body.style.setProperty('--accent-1', ACCENT_HUE[accent.value]);
}

function restoreHostTheme() {
  if (typeof document === 'undefined') return;
  const body = document.body;
  const backup = (window as unknown as Record<string, unknown>)[HOST_THEME_BACKUP_KEY] as
    | { theme: string | null; density: string | null; accent: string }
    | undefined;
  if (!backup) return;
  if (backup.theme !== null) body.setAttribute('data-theme', backup.theme);
  else body.removeAttribute('data-theme');
  if (backup.density !== null) body.setAttribute('data-density', backup.density);
  else body.removeAttribute('data-density');
  if (backup.accent) body.style.setProperty('--accent-1', backup.accent);
  else body.style.removeProperty('--accent-1');
  delete (window as unknown as Record<string, unknown>)[HOST_THEME_BACKUP_KEY];
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', onGlobalKey);

    // 备份宿主主题，以便卸载时还原
    const body = document.body;
    (window as unknown as Record<string, unknown>)[HOST_THEME_BACKUP_KEY] = {
      theme: body.getAttribute('data-theme'),
      density: body.getAttribute('data-density'),
      accent: body.style.getPropertyValue('--accent-1') || '',
    };

    // 用宿主主题作为初始值（如果是已知值），否则保留组件默认 dark-cool
    const hostTheme = body.getAttribute('data-theme') ?? document.documentElement.getAttribute('data-theme');
    if (hostTheme === 'dark-cool' || hostTheme === 'dark-warm' || hostTheme === 'light' || hostTheme === 'dark') {
      theme.value = hostTheme === 'dark' ? 'dark-cool' : (hostTheme as DemoTheme);
    }
    const hostDensity = body.getAttribute('data-density');
    if (hostDensity === 'comfortable' || hostDensity === 'compact') {
      density.value = hostDensity;
    }

    applyToBody();

    // 恢复登录态（同一标签页刷新不需要重新登录）
    try {
      const saved = window.sessionStorage.getItem(AUTH_KEY);
      if (saved) authedUser.value = saved;
    } catch { /* */ }

    // 首次访问自动启动 tour，sessionStorage 标志防止反复弹（仅登录后才弹）
    try {
      if (authedUser.value && !window.sessionStorage.getItem('chufix-tpl:admin-mini:tour-done')) {
        setTimeout(() => (tourOpen.value = true), 400);
        window.sessionStorage.setItem('chufix-tpl:admin-mini:tour-done', '1');
      }
    } catch { /* sessionStorage blocked */ }
  }
});
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onGlobalKey);
    restoreHostTheme();
  }
});

watch([theme, density, accent], applyToBody);

const tourSteps = computed<TourStep[]>(() => [
  { target: '[data-tour="brand"]',    title: t.value.tour_brand_title,    description: t.value.tour_brand_desc,    placement: 'bottom' },
  { target: '[data-tour="search"]',   title: t.value.tour_search_title,   description: t.value.tour_search_desc,   placement: 'bottom' },
  { target: '[data-tour="settings"]', title: t.value.tour_settings_title, description: t.value.tour_settings_desc, placement: 'bottom' },
  { target: '[data-tour="user"]',     title: t.value.tour_user_title,     description: t.value.tour_user_desc,     placement: 'bottom' },
]);

const sidebarItems = computed<SidebarEntry[]>(() => [
  {
    type: 'group',
    label: t.value.grp_overview,
    items: [
      { key: 'dashboard', label: t.value.page_dashboard, icon: iconSvg('M3 13h6V3H3v10zm0 8h6v-6H3v6zm8 0h10V11H11v10zm0-18v6h10V3H11z') },
    ],
  },
  {
    type: 'group',
    label: t.value.grp_authz,
    items: [
      { key: 'users',      label: t.value.page_users,      icon: iconSvg('M12 12a4 4 0 100-8 4 4 0 000 8zm-8 9a8 8 0 0116 0H4z') },
      { key: 'roles',      label: t.value.page_roles,      icon: iconSvg('M12 2l9 4v6c0 5-3.5 9-9 10-5.5-1-9-5-9-10V6l9-4z') },
      { key: 'user-roles', label: t.value.page_user_roles, icon: iconSvg('M9 12a4 4 0 100-8 4 4 0 000 8zm6 0a3 3 0 100-6 3 3 0 000 6zm-6 2c-3 0-9 1.5-9 4.5V21h12v-2.5c0-1.6 1.7-2.7 3.5-3.3-.6-.7-1.7-1.2-3-1.2zm6 .5c2 0 6 1 6 3V21h-6v-3.5z') },
      { key: 'org',        label: t.value.page_org,        icon: iconSvg('M3 21V8h6V3h6v5h6v13H3zm2-2h4v-3H5v3zm6 0h4v-3h-4v3zm6 0h4v-3h-4v3zM5 14h4v-3H5v3zm6 0h4v-3h-4v3zm6 0h4v-3h-4v3zM11 8h4V5h-4v3z') },
    ],
  },
  {
    type: 'group',
    label: t.value.grp_system,
    items: [
      { key: 'dict',         label: t.value.page_dict,         icon: iconSvg('M4 4h16v3H4zM4 10h16v3H4zM4 16h16v3H4z') },
      { key: 'op-log',       label: t.value.page_op_log,       icon: iconSvg('M5 3h11l3 3v15H5z M14 3v4h4') },
      { key: 'login-log',    label: t.value.page_login_log,    icon: iconSvg('M10 17l5-5-5-5v3H3v4h7v3z M21 3h-8v18h8V3z') },
      { key: 'menus',        label: t.value.page_menus,        icon: iconSvg('M3 5h6v6H3zm0 8h6v6H3zm10-8h6v6h-6zm0 8h6v6h-6z') },
      { key: 'sys-settings', label: t.value.page_sys_settings, icon: iconSvg('M12 8a4 4 0 100 8 4 4 0 000-8zm9.4 4a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 113.39 16.96l.06-.06a1.65 1.65 0 00.33-1.82A1.65 1.65 0 002.27 14H3a2 2 0 110-4h-.09c.36 0 .68-.13 1-.34A1.65 1.65 0 003.78 8 1.65 1.65 0 003.45 6.18l-.06-.06a2 2 0 112.83-2.83l.06.06c.5.5 1.24.63 1.82.33H8c.36 0 .68-.13 1-.34A1.65 1.65 0 0010 2.27V3a2 2 0 114 0v-.09c0 .36.13.68.34 1A1.65 1.65 0 0016 3.78a1.65 1.65 0 011.82.33l.06.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0021.4 9z') },
    ],
  },
]);

const navMenuItems = computed(() => {
  const groups: SidebarEntry[] = sidebarItems.value;
  const out: { key: string; label: string; href?: string }[] = [];
  for (const g of groups) {
    if ('type' in g && g.type === 'group' && g.items) {
      for (const item of g.items) {
        out.push({ key: item.key, label: item.label, href: '#' + item.key });
      }
    }
  }
  return out;
});

const breadcrumbItems = computed(() => {
  const item = flatItem(route.value);
  const groupLabel = findGroupLabel(route.value);
  const items: { label: string }[] = [{ label: t.value.brand }];
  if (groupLabel) items.push({ label: groupLabel });
  if (item) items.push({ label: item.label });
  return items;
});

function flatItem(key: string): SidebarItem | null {
  for (const g of sidebarItems.value) {
    if ('type' in g && g.type === 'group') {
      const found = g.items.find((i) => i.key === key);
      if (found) return found;
    }
  }
  return null;
}
function findGroupLabel(key: string): string | undefined {
  for (const g of sidebarItems.value) {
    if ('type' in g && g.type === 'group') {
      if (g.items.some((i) => i.key === key)) return g.label;
    }
  }
  return undefined;
}
function iconSvg(d: string) {
  return `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
}

const shellStyle = computed(() => ({
  '--accent-1': ACCENT_HUE[accent.value],
}));

const showSidebar = computed(() => menuForm.value !== 'topbar');
const sidebarCollapsed = computed(() => menuForm.value === 'collapsed');

const paletteItems = computed<CommandPaletteItem[]>(() => {
  const navs: CommandPaletteItem[] = [];
  for (const g of sidebarItems.value) {
    if ('type' in g && g.type === 'group') {
      for (const item of g.items) {
        navs.push({
          id: `nav:${item.key}`,
          label: item.label,
          group: t.value.cmd_navigate,
          keywords: [item.key],
        });
      }
    }
  }
  return [
    ...navs,
    { id: 'act:settings',  label: t.value.cmd_open_settings,    group: t.value.cmd_actions, shortcut: '⇧S' },
    { id: 'act:profile',   label: t.value.cmd_open_profile,     group: t.value.cmd_actions },
    { id: 'act:password',  label: t.value.cmd_change_password,  group: t.value.cmd_actions },
    { id: 'act:logout',    label: t.value.cmd_logout,           group: t.value.cmd_actions },
  ];
});

function onPaletteSelect(id: string) {
  paletteOpen.value = false;
  if (id.startsWith('nav:')) {
    route.value = id.slice(4) as RouteId;
  } else if (id === 'act:settings')  settingsOpen.value = true;
  else if (id === 'act:profile')   profileOpen.value = true;
  else if (id === 'act:password')  passwordOpen.value = true;
  else if (id === 'act:logout')    onLogout();
}

const pageComp = computed(() => {
  switch (route.value) {
    case 'dashboard':  return Dashboard;
    case 'users':      return Users;
    case 'roles':      return Roles;
    case 'user-roles': return UserRoles;
    case 'org':        return Org;
    case 'dict':       return Dict;
    case 'op-log':     return OperationLog;
    case 'login-log':    return LoginLog;
    case 'menus':        return Menus;
    case 'sys-settings': return SystemSettings;
    default:             return Dashboard;
  }
});
</script>

<template>
  <div
    class="adm-root"
    :data-theme="theme"
    :data-density="density"
    :style="shellStyle"
  >
    <Login v-if="!authedUser" @login-success="onLoginSuccess" />

    <template v-else>
    <CfAppShell
      :sidebar-collapsed="sidebarCollapsed"
      :sidebar-width="sidebarCollapsed ? 64 : 220"
      :header-height="56"
    >
      <template #header>
        <AdminHeader
          @open-settings="settingsOpen = true"
          @open-profile="profileOpen = true"
          @open-change-password="passwordOpen = true"
          @logout="onLogout"
        />
      </template>

      <template v-if="showSidebar" #sidebar>
        <CfSidebar
          :items="sidebarItems"
          :model-value="route"
          :collapsed="sidebarCollapsed"
          @update:modelValue="(key) => (route = key as RouteId)"
        />
      </template>

      <section class="adm-body">
        <CfNavMenu
          v-if="menuForm === 'topbar'"
          :items="navMenuItems"
          :active="route"
          variant="underline"
          class="adm-body__nav"
          @navigate="(item) => (route = item.key as RouteId)"
        />
        <CfBreadcrumb :items="breadcrumbItems" />
        <h2 class="adm-body__title">{{ flatItem(route)?.label ?? '' }}</h2>
        <component :is="pageComp" :key="route + '|' + locale" />
      </section>
    </CfAppShell>

    <SettingsDrawer v-model:open="settingsOpen" />
    <ProfileModal v-model:open="profileOpen" />
    <ChangePasswordModal v-model:open="passwordOpen" />

    <CfCommandPalette
      :open="paletteOpen"
      :items="paletteItems"
      :placeholder="t.cmd_placeholder"
      :empty-text="t.cmd_empty"
      @update:open="(v) => (paletteOpen = v)"
      @select="onPaletteSelect"
    />
    <CfTour
      v-model="tourOpen"
      :steps="tourSteps"
    />
    </template>
  </div>
</template>

<style scoped>
.adm-root {
  display: flex;
  flex-direction: column;
  background: var(--bg-0);
  color: var(--fg-1);
  font-family: var(--font-sans);
  height: 100%;
  min-height: 720px;
  isolation: isolate;
  border-radius: var(--r-6);
  overflow: hidden;
  border: 1px solid var(--line-1);
}
.adm-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px 20px 24px;
}
.adm-body__title {
  margin: 0;
  font-size: var(--t-18);
  font-weight: var(--w-medium);
  color: var(--fg-1);
}
</style>
