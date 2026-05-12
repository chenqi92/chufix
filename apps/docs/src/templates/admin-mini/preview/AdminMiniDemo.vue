<script setup lang="ts">
/**
 * admin-mini · 实时演示。
 * 顶部 AdminHeader（搜索 / 消息铃铛 / 语言 / 主题齿轮 / 用户头像下拉）；
 * 中间 CfAppShell + CfSidebar / CfNavMenu + CfBreadcrumb；
 * 右抽屉 SettingsDrawer 装主题/密度/菜单/主色；个人中心 + 修改密码用 Modal；
 * 7 个子页面随菜单切换。
 */
import { computed, provide, ref } from 'vue';
import { CfAppShell, CfSidebar, CfNavMenu, CfBreadcrumb, toast } from '@chufix-design/vue';
import type { SidebarEntry, SidebarItem } from '@chufix-design/vue';
import AdminHeader from './AdminHeader.vue';
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

type RouteId = 'dashboard' | 'users' | 'roles' | 'user-roles' | 'dict' | 'op-log' | 'login-log';

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

function onLogout() {
  toast.info(t.value.logout_done);
}

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
    ],
  },
  {
    type: 'group',
    label: t.value.grp_system,
    items: [
      { key: 'dict',      label: t.value.page_dict,      icon: iconSvg('M4 4h16v3H4zM4 10h16v3H4zM4 16h16v3H4z') },
      { key: 'op-log',    label: t.value.page_op_log,    icon: iconSvg('M5 3h11l3 3v15H5z M14 3v4h4') },
      { key: 'login-log', label: t.value.page_login_log, icon: iconSvg('M10 17l5-5-5-5v3H3v4h7v3z M21 3h-8v18h8V3z') },
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

const pageComp = computed(() => {
  switch (route.value) {
    case 'dashboard':  return Dashboard;
    case 'users':      return Users;
    case 'roles':      return Roles;
    case 'user-roles': return UserRoles;
    case 'dict':       return Dict;
    case 'op-log':     return OperationLog;
    case 'login-log':  return LoginLog;
    default:           return Dashboard;
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
