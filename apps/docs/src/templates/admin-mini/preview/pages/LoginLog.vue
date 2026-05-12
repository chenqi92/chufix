<script setup lang="ts">
/**
 * 登录日志 —— 类似操作日志，重点展示：
 *   - 失败次数统计 + 高亮失败用户（rowClass）
 *   - 按状态过滤
 *   - 排序时间倒序为默认
 *   - 分页 + 导出 CSV
 */
import { computed, h, inject, ref } from 'vue';
import {
  CfTable,
  CfTag,
  CfButton,
  CfSearchInput,
  toast,
} from '@chufix-design/vue';
import type { TableColumn } from '@chufix-design/vue';
import { DemoStateKey, STRINGS } from '../state';
import { initialLoginLogs, type LoginLog } from '../mock';

const state = inject(DemoStateKey)!;
const t = computed(() => STRINGS[state.locale.value]);

const rows = ref<LoginLog[]>(initialLoginLogs.map((r) => ({ ...r })));
const search = ref('');

function exportCsv() {
  const lines = [
    ['id', 'user', 'ip', 'ua', 'at', 'status'].join(','),
    ...rows.value.map((r) =>
      [r.id, r.user, r.ip, r.ua, r.at, r.status]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','),
    ),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'login-log.csv';
  a.click();
  URL.revokeObjectURL(a.href);
  toast.info(state.locale.value === 'zh' ? `已导出 ${rows.value.length} 条记录` : `Exported ${rows.value.length} rows`);
}

const cols = computed<TableColumn<LoginLog>[]>(() => [
  { key: 'user', title: t.value.col_log_user, dataIndex: 'user', width: 110, sortable: true },
  { key: 'ip',   title: t.value.col_log_ip,   dataIndex: 'ip',   width: 140 },
  { key: 'ua',   title: t.value.col_log_ua,   dataIndex: 'ua',   ellipsis: true },
  {
    key: 'status', title: t.value.status, dataIndex: 'status', width: 110,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: t.value.status_success, value: 'success' },
      { label: t.value.status_failed,  value: 'failed' },
    ],
    render: (v: unknown) =>
      h(CfTag,
        { size: 'sm', tone: v === 'success' ? 'success' : 'danger', variant: 'soft' },
        () => (v === 'success' ? t.value.status_success : t.value.status_failed)),
  },
  { key: 'at', title: t.value.col_log_at, dataIndex: 'at', width: 180, sortable: true },
]);

const failCount = computed(() => rows.value.filter((r) => r.status === 'failed').length);
</script>

<template>
  <div class="adm-page">
    <header class="adm-page__head">
      <div class="adm-page__head-left">
        <CfSearchInput v-model="search" :placeholder="t.search" size="sm" style="width: 240px;" />
        <span class="adm-page__count">
          {{ t.total_rows.replace('{n}', String(rows.length)) }}
          <template v-if="failCount">
            · <span style="color: oklch(70% 0.15 25);">{{ state.locale.value === 'zh' ? `失败 ${failCount} 次` : `${failCount} failed` }}</span>
          </template>
        </span>
      </div>
      <div class="adm-page__head-right">
        <CfButton variant="tertiary" size="sm" @click="exportCsv">
          {{ state.locale.value === 'zh' ? '导出 CSV' : 'Export CSV' }}
        </CfButton>
      </div>
    </header>

    <CfTable
      :columns="cols"
      :rows="rows"
      :row-key="(r: LoginLog) => String(r.id)"
      size="sm"
      :global-search="search"
      :default-sort="{ key: 'at', direction: 'desc' }"
      :sticky-header="true"
      :hoverable="true"
      :pagination="{ page: 1, pageSize: 5, pageSizeOptions: [5, 10, 20], showSizeChanger: true, showJumper: true, showTotal: true }"
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
