<script setup lang="ts">
/**
 * 操作日志 —— 展示更多 CfTable 能力：
 *   - 全局搜索 + 按 action / status 列过滤
 *   - 排序：时间倒序为默认
 *   - 多选 + 批量删除（演示态）
 *   - 分页 / 翻页 / 调整每页数量
 *   - sticky header + 固定右侧 actions 列
 *   - 导出 CSV
 *   - row-click 展开详情（CfDescriptionList）
 */
import { computed, h, inject, ref } from 'vue';
import {
  CfTable,
  CfTag,
  CfButton,
  CfSearchInput,
  CfDescriptionList,
  CfConfirmDialog,
  toast,
} from '@chufix-design/vue';
import type { TableColumn, DescriptionItem } from '@chufix-design/vue';
import { DemoStateKey, STRINGS } from '../state';
import { initialOpLogs, type OperationLog } from '../mock';

const state = inject(DemoStateKey)!;
const t = computed(() => STRINGS[state.locale.value]);

const rows = ref<OperationLog[]>(initialOpLogs.map((r) => ({ ...r })));
const search = ref('');
const selected = ref<string[]>([]);
const expanded = ref<string[]>([]);

const batchConfirmOpen = ref(false);
function askBatchDelete() {
  if (selected.value.length) batchConfirmOpen.value = true;
}
function confirmBatchDelete() {
  const set = new Set(selected.value);
  const n = selected.value.length;
  rows.value = rows.value.filter((r) => !set.has(String(r.id)));
  selected.value = [];
  toast.success(state.locale.value === 'zh' ? `已删除 ${n} 条日志` : `Deleted ${n} log entries`);
}
function exportCsv() {
  const lines = [
    ['id', 'user', 'action', 'resource', 'ip', 'at', 'status'].join(','),
    ...rows.value.map((r) =>
      [r.id, r.user, r.action, r.resource, r.ip, r.at, r.status]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','),
    ),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'operation-log.csv';
  a.click();
  URL.revokeObjectURL(a.href);
  toast.info(state.locale.value === 'zh' ? `已导出 ${rows.value.length} 条记录` : `Exported ${rows.value.length} rows`);
}

const cols = computed<TableColumn<OperationLog>[]>(() => [
  { key: 'user', title: t.value.col_log_user, dataIndex: 'user', width: 110, sortable: true },
  {
    key: 'action', title: t.value.col_log_action, dataIndex: 'action', width: 110,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'create', value: 'create' },
      { label: 'update', value: 'update' },
      { label: 'delete', value: 'delete' },
      { label: 'login',  value: 'login' },
      { label: 'export', value: 'export' },
    ],
    render: (v: unknown) =>
      h(CfTag, { size: 'sm', variant: 'outline', tone: v === 'delete' ? 'danger' : 'neutral' }, () => String(v)),
  },
  { key: 'resource', title: t.value.col_log_resource, dataIndex: 'resource', ellipsis: true },
  { key: 'ip', title: t.value.col_log_ip, dataIndex: 'ip', width: 130 },
  {
    key: 'status', title: t.value.status, dataIndex: 'status', width: 100,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: t.value.status_ok,   value: 'ok' },
      { label: t.value.status_fail, value: 'fail' },
    ],
    render: (v: unknown) =>
      h(CfTag,
        { size: 'sm', tone: v === 'ok' ? 'success' : 'danger', variant: 'soft' },
        () => (v === 'ok' ? t.value.status_ok : t.value.status_fail)),
  },
  { key: 'at', title: t.value.col_log_at, dataIndex: 'at', width: 180, sortable: true },
]);

function descItems(row: OperationLog): DescriptionItem[] {
  return [
    { label: t.value.col_log_user,     value: row.user },
    { label: t.value.col_log_action,   value: row.action },
    { label: t.value.col_log_resource, value: row.resource },
    { label: t.value.col_log_ip,       value: row.ip },
    { label: t.value.col_log_at,       value: row.at },
    { label: t.value.status,           value: row.status },
  ];
}
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
      </div>
    </header>

    <CfTable
      v-model="selected"
      :columns="cols"
      :rows="rows"
      :row-key="(r: OperationLog) => String(r.id)"
      selectable="multiple"
      size="sm"
      :global-search="search"
      :default-sort="{ key: 'at', direction: 'desc' }"
      :sticky-header="true"
      :hoverable="true"
      :expandable="true"
      v-model:expanded-row-keys="expanded"
      :expand-render="(row: OperationLog) => h('div', { style: 'padding: 8px 12px;' }, [h(CfDescriptionList, { items: descItems(row), layout: 'horizontal', size: 'sm' })])"
      :pagination="{ page: 1, pageSize: 5, pageSizeOptions: [5, 10, 20], showSizeChanger: true, showJumper: true, showTotal: true }"
    />

    <CfConfirmDialog
      v-model:open="batchConfirmOpen"
      tone="warning"
      :title="state.locale.value === 'zh' ? `删除 ${selected.length} 条日志？` : `Delete ${selected.length} log entries?`"
      :description="state.locale.value === 'zh' ? '审计日志一般不应删除，此处仅作演示。' : 'Audit logs are typically immutable — this is demo only.'"
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
