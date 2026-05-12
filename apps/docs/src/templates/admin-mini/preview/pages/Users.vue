<script setup lang="ts">
/**
 * 用户管理页 —— 系统化展示 CfTable 的能力：
 *   - 多选 + 批量删除 + 全选/反选
 *   - 列排序：id / name / createdAt
 *   - 列过滤：status（select）
 *   - 列拖拽换序（reorderable）+ 列宽拖拽（resizable）+ 列隐藏
 *   - 内联编辑：双击「手机号」单元格直接改
 *   - 客户端分页 + 翻页器 + 每页数量切换
 *   - 全局搜索 + 数据 export CSV
 *   - sticky header + 固定右侧 actions 列
 *   - 新增 / 编辑 modal（CfForm + CfInput + CfSelect）+ CfConfirmDialog 二次确认
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
  CfCheckbox,
  CfPopover,
  CfConfirmDialog,
  toast,
} from '@chufix-design/vue';
import type { TableColumn, TableColumnsState } from '@chufix-design/vue';
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

const columnsState = ref<TableColumnsState>({ hidden: [] });
const allColumnKeys = ['id', 'username', 'name', 'email', 'phone', 'status', 'createdAt', 'actions'];
const columnLabelMap = computed<Record<string, string>>(() => ({
  id:        t.value.col_id,
  username:  t.value.col_username,
  name:      t.value.col_name,
  email:     t.value.col_email,
  phone:     t.value.col_phone,
  status:    t.value.status,
  createdAt: t.value.col_created_at,
  actions:   t.value.actions,
}));
function isHidden(key: string): boolean {
  return (columnsState.value.hidden ?? []).includes(key);
}
function toggleColumn(key: string) {
  const set = new Set(columnsState.value.hidden ?? []);
  if (set.has(key)) set.delete(key);
  else set.add(key);
  columnsState.value = { ...columnsState.value, hidden: [...set] };
}
function resetColumns() {
  columnsState.value = { hidden: [], order: undefined, widths: {} };
}

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

function onCellEdit(payload: { row: AdminUser; column: TableColumn<AdminUser>; oldValue: unknown; newValue: unknown }) {
  if (payload.column.key !== 'phone') return;
  const v = String(payload.newValue).trim();
  rows.value = rows.value.map((r) => (r.id === payload.row.id ? { ...r, phone: v } : r));
  toast.success(t.value.phone_updated);
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
  { key: 'id',        title: t.value.col_id,         dataIndex: 'id',        width: 60,  sortable: true, hideable: true },
  { key: 'username',  title: t.value.col_username,   dataIndex: 'username',  width: 120, sortable: true, hideable: true },
  { key: 'name',      title: t.value.col_name,       dataIndex: 'name',      width: 150, sortable: true, hideable: true },
  { key: 'email',     title: t.value.col_email,      dataIndex: 'email',     width: 220, ellipsis: true, hideable: true },
  {
    key: 'phone', title: t.value.col_phone, dataIndex: 'phone', width: 150,
    editable: true, editType: 'text',
    editValidate: (v: unknown) => /^\d{6,15}$/.test(String(v).trim()),
    hideable: true,
  },
  {
    key: 'status', title: t.value.status, dataIndex: 'status', width: 120,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: t.value.status_active,   value: 'active' },
      { label: t.value.status_disabled, value: 'disabled' },
    ],
    hideable: true,
    render: (v: unknown) =>
      h(CfTag,
        { size: 'sm', tone: v === 'active' ? 'success' : 'danger', variant: 'soft' },
        () => (v === 'active' ? t.value.status_active : t.value.status_disabled)),
  },
  { key: 'createdAt', title: t.value.col_created_at, dataIndex: 'createdAt', width: 180, sortable: true, hideable: true },
  {
    key: 'actions', title: t.value.actions, dataIndex: 'id', width: 150, align: 'right' as const,
    fixed: 'right' as const,
    reorderable: false,
    resizable: false,
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
        <CfPopover placement="bottom" :width="220">
          <CfButton variant="tertiary" size="sm">
            {{ t.column_settings }}
          </CfButton>
          <template #content>
            <div class="adm-columns">
              <header class="adm-columns__head">
                <span>{{ t.column_settings }}</span>
                <button type="button" class="adm-columns__reset" @click="resetColumns">
                  {{ t.reset_columns }}
                </button>
              </header>
              <ul class="adm-columns__list">
                <li v-for="k in allColumnKeys" :key="k">
                  <label class="adm-columns__item">
                    <CfCheckbox :model-value="!isHidden(k)" @update:modelValue="toggleColumn(k)" />
                    <span>{{ columnLabelMap[k] }}</span>
                  </label>
                </li>
              </ul>
            </div>
          </template>
        </CfPopover>
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
      :resizable="true"
      :reorderable="true"
      persist-key="admin-mini:users"
      :columns-state="columnsState"
      @update:columns-state="(v: TableColumnsState) => (columnsState = v)"
      @cell-edit="onCellEdit"
      :pagination="{ page: 1, pageSize: 5, pageSizeOptions: [5, 10, 20], showSizeChanger: true, showJumper: true, showTotal: true }"
    />

    <p class="adm-page__tip">
      {{ state.locale.value === 'zh'
        ? '提示：拖拽表头可换列顺序，拖拽列分割线可调列宽，双击「手机号」单元格可直接编辑（需 6–15 位数字）。'
        : 'Tip: drag headers to reorder, drag the column splitter to resize, double-click the phone cell to inline-edit (6–15 digits).' }}
    </p>

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
.adm-page__tip {
  margin: 0;
  color: var(--fg-3);
  font-size: var(--t-11);
  line-height: 1.6;
}
.adm-columns {
  background: var(--bg-1);
  min-width: 200px;
}
.adm-columns__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid var(--line-1);
  font-size: var(--t-12);
  font-weight: var(--w-medium);
  color: var(--fg-1);
}
.adm-columns__reset {
  background: transparent;
  border: 0;
  color: var(--accent-1);
  font-size: var(--t-11);
  cursor: pointer;
  padding: 0;
}
.adm-columns__list {
  margin: 0;
  padding: 6px 0;
  list-style: none;
  max-height: 260px;
  overflow: auto;
}
.adm-columns__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: var(--t-12);
  color: var(--fg-1);
}
.adm-columns__item:hover { background: var(--bg-2); }
</style>
