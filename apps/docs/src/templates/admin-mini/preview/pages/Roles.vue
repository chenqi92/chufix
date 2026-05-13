<script setup lang="ts">
/**
 * 角色管理页 —— 完整 CRUD：
 *   - 新增 / 编辑（CfModal + CfForm + CfTreeView 组成菜单 / 按钮权限树）
 *   - 删除（CfConfirmDialog 二次确认）
 *   - 多选 + 批量删除
 *   - 列排序、列过滤（按权限维度）、分页
 *   - 权限列：tag 列表（点开 CfHoverCard 显示完整权限说明）
 */
import { computed, h, inject, ref } from 'vue';
import {
  CfTable,
  CfTag,
  CfButton,
  CfModal,
  CfForm,
  CfFormField,
  CfInput,
  CfTextarea,
  CfTreeView,
  CfConfirmDialog,
  CfHoverCard,
  toast,
} from '@chufix-design/vue';
import type { TableColumn, TreeNode } from '@chufix-design/vue';
import { DemoStateKey, STRINGS } from '../state';
import { initialRoles, type AdminRole } from '../mock';

const state = inject(DemoStateKey)!;
const t = computed(() => STRINGS[state.locale.value]);

const WILDCARD_PERMS: Record<string, string[]> = {
  'user:*': ['menu:users', 'user:read', 'user:write'],
  'role:*': ['menu:roles', 'role:read', 'role:write'],
  'dict:*': ['menu:dict', 'dict:read', 'dict:write'],
  'log:*': ['menu:op-log', 'log:read', 'log:export'],
  '*': [
    'menu:dashboard',
    'menu:authz',
    'menu:users',
    'user:read',
    'user:write',
    'menu:roles',
    'role:read',
    'role:write',
    'menu:user-roles',
    'user-role:read',
    'user-role:write',
    'menu:org',
    'org:read',
    'org:write',
    'menu:system',
    'menu:dict',
    'dict:read',
    'dict:write',
    'menu:op-log',
    'log:read',
    'log:export',
    'menu:login-log',
    'login-log:read',
    'menu:menus',
    'menu:read',
    'menu:write',
    'menu:settings',
    'settings:read',
    'settings:write',
  ],
};

function normalizePermissions(perms: string[]): string[] {
  const set = new Set<string>();
  for (const perm of perms) {
    const expanded = WILDCARD_PERMS[perm] ?? [perm];
    for (const key of expanded) set.add(key);
  }
  return [...set];
}

const rows = ref<AdminRole[]>(initialRoles.map((r) => ({ ...r, permissions: normalizePermissions(r.permissions) })));
const selected = ref<string[]>([]);

const dialogOpen = ref(false);
const editing = ref<AdminRole | null>(null);
const form = ref<{ name: string; description: string; permissions: string[] }>({
  name: '', description: '', permissions: [],
});

const confirmOpen = ref(false);
const pendingDelete = ref<AdminRole | null>(null);
const batchConfirmOpen = ref(false);

const permissionTree = computed<TreeNode[]>(() => {
  const zh = state.locale.value === 'zh';
  return [
    { key: 'menu:dashboard', label: zh ? '菜单：工作台' : 'Menu: Dashboard' },
    {
      key: 'menu:authz',
      label: zh ? '菜单：权限' : 'Menu: Permissions',
      children: [
        { key: 'menu:users', label: zh ? '用户管理' : 'Users', children: [
          { key: 'user:read', label: t.value.perm_user_read },
          { key: 'user:write', label: t.value.perm_user_write },
        ] },
        { key: 'menu:roles', label: zh ? '角色管理' : 'Roles', children: [
          { key: 'role:read', label: t.value.perm_role_read },
          { key: 'role:write', label: t.value.perm_role_write },
        ] },
        { key: 'menu:user-roles', label: zh ? '用户角色' : 'User roles', children: [
          { key: 'user-role:read', label: zh ? '查看用户角色' : 'View user roles' },
          { key: 'user-role:write', label: zh ? '分配用户角色' : 'Assign user roles' },
        ] },
        { key: 'menu:org', label: zh ? '组织架构' : 'Organization', children: [
          { key: 'org:read', label: zh ? '查看组织' : 'View organization' },
          { key: 'org:write', label: zh ? '维护组织' : 'Manage organization' },
        ] },
      ],
    },
    {
      key: 'menu:system',
      label: zh ? '菜单：系统' : 'Menu: System',
      children: [
        { key: 'menu:dict', label: zh ? '字典管理' : 'Dictionary', children: [
          { key: 'dict:read', label: t.value.perm_dict_read },
          { key: 'dict:write', label: t.value.perm_dict_write },
        ] },
        { key: 'menu:op-log', label: zh ? '操作日志' : 'Operation logs', children: [
          { key: 'log:read', label: t.value.perm_log_read },
          { key: 'log:export', label: t.value.perm_log_export },
        ] },
        { key: 'menu:login-log', label: zh ? '登录日志' : 'Login logs', children: [
          { key: 'login-log:read', label: zh ? '查看登录日志' : 'View login logs' },
        ] },
        { key: 'menu:menus', label: zh ? '菜单管理' : 'Menu management', children: [
          { key: 'menu:read', label: zh ? '查看菜单' : 'View menus' },
          { key: 'menu:write', label: zh ? '维护菜单' : 'Manage menus' },
        ] },
        { key: 'menu:settings', label: zh ? '系统设置' : 'Settings', children: [
          { key: 'settings:read', label: zh ? '查看设置' : 'View settings' },
          { key: 'settings:write', label: zh ? '保存设置' : 'Save settings' },
        ] },
      ],
    },
  ];
});

const expandedPermissionKeys = computed(() => [
  'menu:authz',
  'menu:users',
  'menu:roles',
  'menu:user-roles',
  'menu:org',
  'menu:system',
  'menu:dict',
  'menu:op-log',
  'menu:login-log',
  'menu:menus',
  'menu:settings',
]);

function openCreate() {
  editing.value = null;
  form.value = { name: '', description: '', permissions: [] };
  dialogOpen.value = true;
}
function openEdit(row: AdminRole) {
  editing.value = row;
  form.value = { name: row.name, description: row.description, permissions: [...row.permissions] };
  dialogOpen.value = true;
}
function askDelete(row: AdminRole) {
  pendingDelete.value = row;
  confirmOpen.value = true;
}
function confirmDelete() {
  const r = pendingDelete.value;
  if (!r) return;
  rows.value = rows.value.filter((x) => x.id !== r.id);
  selected.value = selected.value.filter((id) => id !== r.id);
  pendingDelete.value = null;
  toast.success(state.locale.value === 'zh' ? '已删除 1 个角色' : 'Role deleted');
}
function askBatchDelete() {
  if (!selected.value.length) return;
  batchConfirmOpen.value = true;
}
function confirmBatchDelete() {
  const removed = selected.value.length;
  const set = new Set(selected.value);
  rows.value = rows.value.filter((r) => !set.has(r.id));
  selected.value = [];
  toast.success(
    state.locale.value === 'zh' ? `已删除 ${removed} 个角色` : `Deleted ${removed} roles`,
  );
}
function save(): boolean {
  if (!form.value.name.trim()) {
    toast.error(state.locale.value === 'zh' ? '角色名必填' : 'Role name required');
    return false;
  }
  if (editing.value) {
    const id = editing.value.id;
    rows.value = rows.value.map((r) => (r.id === id ? { ...r, ...form.value } : r));
    toast.success(state.locale.value === 'zh' ? '已更新' : 'Updated');
  } else {
    const nextId = `r-${Date.now().toString(36)}`;
    rows.value = [...rows.value, { id: nextId, ...form.value }];
    toast.success(state.locale.value === 'zh' ? '已新增' : 'Created');
  }
  return true;
}
const cols = computed<TableColumn<AdminRole>[]>(() => [
  { key: 'name', title: t.value.col_role_name, dataIndex: 'name', width: 180, sortable: true },
  { key: 'description', title: t.value.col_role_desc, dataIndex: 'description', ellipsis: true },
  {
    key: 'permissions', title: t.value.col_role_perms, dataIndex: 'permissions',
    render: (v: unknown, row: AdminRole) => {
      const perms = v as string[];
      const display = perms.slice(0, 3);
      const more = perms.length - display.length;
      return h(CfHoverCard, { placement: 'top' as const }, {
        default: () => h('div', { style: 'display: inline-flex; gap: 4px; flex-wrap: wrap; cursor: help;' }, [
          ...display.map((p) =>
            h(CfTag, { size: 'sm', variant: 'outline' as const, tone: 'primary' as const }, () => p),
          ),
          ...(more > 0 ? [h(CfTag, { size: 'sm', variant: 'soft' as const, tone: 'neutral' as const }, () => `+${more}`)] : []),
        ]),
        content: () => h('div', { style: 'padding: 6px 4px; max-width: 240px;' }, [
          h('div', { style: 'font-weight: var(--w-medium); margin-bottom: 6px;' }, row.name),
          h('div', { style: 'display: flex; flex-direction: column; gap: 4px;' },
            perms.length
              ? perms.map((p) => h('code', { style: 'font-size: 11px; color: var(--fg-2);' }, p))
              : [h('span', { style: 'color: var(--fg-3); font-size: 11px;' }, '—')],
          ),
        ]),
      });
    },
  },
  {
    key: 'actions', title: t.value.actions, dataIndex: 'id', width: 140, align: 'right' as const,
    fixed: 'right' as const,
    render: (_v: unknown, row: AdminRole) =>
      h('div', { style: 'display: inline-flex; gap: 4px; justify-content: flex-end;' }, [
        h(CfButton, { size: 'sm', variant: 'tertiary', onClick: () => openEdit(row) }, () => t.value.edit),
        h(CfButton, { size: 'sm', variant: 'danger',   onClick: () => askDelete(row) }, () => t.value.delete),
      ]),
  },
]);
</script>

<template>
  <div class="adm-page">
    <header class="adm-page__head">
      <div class="adm-page__head-left">
        <span class="adm-page__count">
          {{ t.total_rows.replace('{n}', String(rows.length)) }}
          <template v-if="selected.length">
            · {{ state.locale.value === 'zh' ? `已选 ${selected.length} 项` : `${selected.length} selected` }}
          </template>
        </span>
      </div>
      <div class="adm-page__head-right">
        <CfButton v-if="selected.length" variant="danger" size="sm" @click="askBatchDelete">
          {{ state.locale.value === 'zh' ? `批量删除 (${selected.length})` : `Delete (${selected.length})` }}
        </CfButton>
        <CfButton variant="primary" size="sm" @click="openCreate">+ {{ t.create }}</CfButton>
      </div>
    </header>

    <CfTable
      v-model="selected"
      :columns="cols"
      :rows="rows"
      :row-key="(r: AdminRole) => r.id"
      selectable="multiple"
      size="sm"
      :sticky-header="true"
      :hoverable="true"
      :pagination="{ page: 1, pageSize: 5, pageSizeOptions: [5, 10], showSizeChanger: true, showTotal: true }"
    />

    <!-- 新增 / 编辑 modal -->
    <CfModal
      v-model:open="dialogOpen"
      :title="editing ? `${t.edit}：${editing.name}` : t.create"
      :ok-text="t.save"
      :cancel-text="t.cancel"
      :on-before-ok="save"
      size="md"
    >
      <CfForm :model="form" layout="vertical">
        <CfFormField :label="t.col_role_name" name="name">
          <CfInput v-model="form.name" />
        </CfFormField>
        <CfFormField :label="t.col_role_desc" name="description">
          <CfTextarea v-model="form.description" :rows="2" />
        </CfFormField>
        <CfFormField :label="t.col_role_perms" name="permissions">
          <div class="adm-roles__perm-tree">
            <CfTreeView
              v-model="form.permissions"
              :nodes="permissionTree"
              :default-expanded-keys="expandedPermissionKeys"
              checkable
              :cascade="true"
              size="sm"
              :show-line="true"
            />
          </div>
        </CfFormField>
      </CfForm>
    </CfModal>

    <!-- 单行删除确认 -->
    <CfConfirmDialog
      v-model:open="confirmOpen"
      tone="warning"
      :title="state.locale.value === 'zh' ? '确认删除？' : 'Delete this role?'"
      :description="pendingDelete ? pendingDelete.name : ''"
      :ok-text="t.delete"
      :cancel-text="t.cancel"
      ok-variant="danger"
      @ok="confirmDelete"
    />

    <CfConfirmDialog
      v-model:open="batchConfirmOpen"
      tone="warning"
      :title="state.locale.value === 'zh' ? `批量删除 ${selected.length} 个角色？` : `Delete ${selected.length} roles?`"
      :description="state.locale.value === 'zh' ? '已分配用户将丢失对应角色，该操作不可撤销。' : 'Users with these roles will lose them. This cannot be undone.'"
      :ok-text="t.delete"
      :cancel-text="t.cancel"
      ok-variant="danger"
      @ok="confirmBatchDelete"
    />
  </div>
</template>

<style scoped>
.adm-page { display: flex; flex-direction: column; gap: 12px; }
.adm-page__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.adm-page__head-left,
.adm-page__head-right {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.adm-page__count { color: var(--fg-3); font-size: var(--t-12); }

.adm-roles__perm-tree {
  max-height: 320px;
  overflow: auto;
  padding: 8px;
  border: 1px solid var(--line-1);
  border-radius: var(--r-4);
  background: var(--bg-1);
}
</style>
