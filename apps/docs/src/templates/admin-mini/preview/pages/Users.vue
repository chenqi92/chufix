<script setup lang="ts">
/**
 * 用户管理页 —— 系统化展示 CfTable 的能力：
 *   - 多选 + 批量删除 + 全选/反选
 *   - 列排序：id / name / createdAt
 *   - 列过滤：status（select）
 *   - 客户端分页 + 翻页器
 *   - 全局搜索 + 数据 export CSV
 *   - sticky header + 固定右侧 actions 列
 *   - 新增 / 编辑 modal（CfForm + CfInput + CfSelect）
 *   - 单行删除（CfConfirmDialog 确认）
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
  CfSelect,
  CfSearchInput,
  CfConfirmDialog,
  toast,
} from '@chufix-design/vue';
import type { TableColumn } from '@chufix-design/vue';
import { DemoStateKey, STRINGS } from '../state';
import { initialUsers, type AdminUser } from '../mock';

const state = inject(DemoStateKey)!;
const t = computed(() => STRINGS[state.locale.value]);

const rows = ref<AdminUser[]>(initialUsers.map((u) => ({ ...u })));
const search = ref('');
const selected = ref<string[]>([]);

const dialogOpen = ref(false);
const editing = ref<AdminUser | null>(null);
const form = ref<Pick<AdminUser, 'username' | 'name' | 'email' | 'phone' | 'status'>>({
  username: '', name: '', email: '', phone: '', status: 'active',
});

const confirmOpen = ref(false);
const pendingDelete = ref<AdminUser | null>(null);
const batchConfirmOpen = ref(false);

function openCreate() {
  editing.value = null;
  form.value = { username: '', name: '', email: '', phone: '', status: 'active' };
  dialogOpen.value = true;
}
function openEdit(row: AdminUser) {
  editing.value = row;
  form.value = {
    username: row.username, name: row.name, email: row.email, phone: row.phone, status: row.status,
  };
  dialogOpen.value = true;
}
function askDelete(row: AdminUser) {
  pendingDelete.value = row;
  confirmOpen.value = true;
}
function confirmDelete() {
  const row = pendingDelete.value;
  if (!row) return;
  rows.value = rows.value.filter((r) => r.id !== row.id);
  selected.value = selected.value.filter((id) => id !== String(row.id));
  pendingDelete.value = null;
  toast.success(state.locale.value === 'zh' ? '已删除 1 个用户' : 'User deleted');
}
function askBatchDelete() {
  if (!selected.value.length) return;
  batchConfirmOpen.value = true;
}
function confirmBatchDelete() {
  const removed = selected.value.length;
  const set = new Set(selected.value);
  rows.value = rows.value.filter((r) => !set.has(String(r.id)));
  selected.value = [];
  toast.success(
    state.locale.value === 'zh'
      ? `已删除 ${removed} 个用户`
      : `Deleted ${removed} users`,
  );
}
function save() {
  if (!form.value.username.trim() || !form.value.name.trim()) {
    toast.error(state.locale.value === 'zh' ? '账号和姓名必填' : 'Username and name required');
    return false;
  }
  if (editing.value) {
    const id = editing.value.id;
    rows.value = rows.value.map((r) => (r.id === id ? { ...r, ...form.value } : r));
    toast.success(state.locale.value === 'zh' ? '已更新' : 'Updated');
  } else {
    const nextId = (rows.value.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
    rows.value = [
      ...rows.value,
      { id: nextId, ...form.value, createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ') },
    ];
    toast.success(state.locale.value === 'zh' ? '已新增' : 'Created');
  }
  return true;
}

function exportCsv() {
  const lines = [
    ['id', 'username', 'name', 'email', 'phone', 'status', 'createdAt'].join(','),
    ...rows.value.map((r) =>
      [r.id, r.username, r.name, r.email, r.phone, r.status, r.createdAt]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(','),
    ),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'users.csv';
  a.click();
  URL.revokeObjectURL(url);
  toast.info(state.locale.value === 'zh' ? `已导出 ${rows.value.length} 条记录` : `Exported ${rows.value.length} rows`);
}

const cols = computed<TableColumn<AdminUser>[]>(() => [
  { key: 'id',        title: t.value.col_id,         dataIndex: 'id',        width: 60,  sortable: true },
  { key: 'username',  title: t.value.col_username,   dataIndex: 'username',  width: 110, sortable: true },
  { key: 'name',      title: t.value.col_name,       dataIndex: 'name',      width: 140, sortable: true },
  { key: 'email',     title: t.value.col_email,      dataIndex: 'email',     ellipsis: true },
  { key: 'phone',     title: t.value.col_phone,      dataIndex: 'phone',     width: 130 },
  {
    key: 'status', title: t.value.status, dataIndex: 'status', width: 110,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: t.value.status_active,   value: 'active' },
      { label: t.value.status_disabled, value: 'disabled' },
    ],
    render: (v: unknown) =>
      h(CfTag,
        { size: 'sm', tone: v === 'active' ? 'success' : 'danger', variant: 'soft' },
        () => (v === 'active' ? t.value.status_active : t.value.status_disabled)),
  },
  { key: 'createdAt', title: t.value.col_created_at, dataIndex: 'createdAt', width: 160, sortable: true },
  {
    key: 'actions', title: t.value.actions, dataIndex: 'id', width: 140, align: 'right' as const,
    fixed: 'right' as const,
    render: (_v: unknown, row: AdminUser) =>
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
        <CfSearchInput v-model="search" :placeholder="t.search" size="sm" style="width: 240px;" />
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
        <CfButton variant="tertiary" size="sm" @click="exportCsv">
          {{ state.locale.value === 'zh' ? '导出 CSV' : 'Export CSV' }}
        </CfButton>
        <CfButton variant="primary" size="sm" @click="openCreate">+ {{ t.create }}</CfButton>
      </div>
    </header>

    <CfTable
      v-model="selected"
      :columns="cols"
      :rows="rows"
      :row-key="(r: AdminUser) => String(r.id)"
      selectable="multiple"
      size="sm"
      :global-search="search"
      :sticky-header="true"
      :hoverable="true"
      variant="default"
      :pagination="{ page: 1, pageSize: 5, pageSizeOptions: [5, 10, 20], showSizeChanger: true, showJumper: true, showTotal: true }"
    />

    <!-- 新增 / 编辑 modal -->
    <CfModal
      v-model:open="dialogOpen"
      :title="editing ? t.edit : t.create"
      :ok-text="t.save"
      :cancel-text="t.cancel"
      :on-before-ok="save"
      size="md"
    >
      <CfForm :model="form" layout="vertical">
        <CfFormField :label="t.col_username" name="username">
          <CfInput v-model="form.username" :placeholder="t.col_username" />
        </CfFormField>
        <CfFormField :label="t.col_name" name="name">
          <CfInput v-model="form.name" :placeholder="t.col_name" />
        </CfFormField>
        <CfFormField :label="t.col_email" name="email">
          <CfInput v-model="form.email" type="email" :placeholder="t.col_email" />
        </CfFormField>
        <CfFormField :label="t.col_phone" name="phone">
          <CfInput v-model="form.phone" :placeholder="t.col_phone" />
        </CfFormField>
        <CfFormField :label="t.status" name="status">
          <CfSelect
            v-model="form.status"
            :options="[
              { value: 'active',   label: t.status_active },
              { value: 'disabled', label: t.status_disabled },
            ]"
          />
        </CfFormField>
      </CfForm>
    </CfModal>

    <!-- 单行删除确认 -->
    <CfConfirmDialog
      v-model:open="confirmOpen"
      tone="warning"
      :title="state.locale.value === 'zh' ? '确认删除？' : 'Delete this user?'"
      :description="pendingDelete ? `${pendingDelete.name} (${pendingDelete.username})` : ''"
      :ok-text="t.delete"
      :cancel-text="t.cancel"
      ok-variant="danger"
      @ok="confirmDelete"
    />

    <!-- 批量删除确认 -->
    <CfConfirmDialog
      v-model:open="batchConfirmOpen"
      tone="warning"
      :title="state.locale.value === 'zh' ? `批量删除 ${selected.length} 个用户？` : `Delete ${selected.length} users?`"
      :description="state.locale.value === 'zh' ? '该操作不可撤销。' : 'This action cannot be undone.'"
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
</style>
