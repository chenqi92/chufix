<script setup lang="ts">
/**
 * 工作台（Dashboard）—— 概览大屏：
 *   - 4 张 CfMetricCard 含趋势 sparkline + delta
 *   - CfLineChart 七日登录 / 操作趋势
 *   - CfDonutChart 操作类型占比
 *   - 最近操作 + 最近登录 两张 CfTable
 */
import { computed, inject } from 'vue';
import {
  CfMetricCard,
  CfLineChart,
  CfDonutChart,
  CfTable,
  CfTag,
} from '@chufix-design/vue';
import type { TableColumn } from '@chufix-design/vue';
import { DemoStateKey, STRINGS } from '../state';
import {
  initialUsers,
  initialRoles,
  initialOpLogs,
  initialLoginLogs,
  type OperationLog,
  type LoginLog,
} from '../mock';

const state = inject(DemoStateKey)!;
const t = computed(() => STRINGS[state.locale.value]);

const kpis = computed(() => [
  {
    label: t.value.kpi_users,
    value: initialUsers.length,
    delta: 33,
    trend: [3, 4, 4, 5, 5, 6, 6],
  },
  {
    label: t.value.kpi_roles,
    value: initialRoles.length,
    delta: 25,
    trend: [3, 3, 3, 4, 4, 4, 4],
  },
  {
    label: t.value.kpi_login_today,
    value: 38,
    delta: 12,
    trend: [22, 28, 24, 30, 35, 33, 38],
  },
  {
    label: t.value.kpi_op_today,
    value: 142,
    delta: -4,
    trend: [160, 152, 148, 138, 142, 150, 142],
  },
]);

const trendDays = computed(() =>
  state.locale.value === 'zh'
    ? ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
);
const trendSeries = computed(() => [
  { name: state.locale.value === 'zh' ? '登录数' : 'Logins',     data: [22, 28, 24, 30, 35, 33, 38] },
  { name: state.locale.value === 'zh' ? '操作数' : 'Operations', data: [120, 138, 150, 142, 158, 160, 142] },
]);

const donutSegments = computed(() => {
  const counts: Record<string, number> = {};
  for (const r of initialOpLogs) counts[r.action] = (counts[r.action] ?? 0) + 1;
  return Object.entries(counts).map(([name, value], i) => ({
    name,
    value,
    colorIndex: i,
  }));
});
const donutTotal = computed(() => initialOpLogs.length);

const opCols = computed<TableColumn<OperationLog>[]>(() => [
  { key: 'user',     title: t.value.col_log_user,     dataIndex: 'user',     width: 100 },
  { key: 'action',   title: t.value.col_log_action,   dataIndex: 'action',   width: 90 },
  { key: 'resource', title: t.value.col_log_resource, dataIndex: 'resource', ellipsis: true },
  { key: 'at',       title: t.value.col_log_at,       dataIndex: 'at',       width: 180 },
]);
const loginCols = computed<TableColumn<LoginLog>[]>(() => [
  { key: 'user', title: t.value.col_log_user, dataIndex: 'user', width: 100 },
  { key: 'ip',   title: t.value.col_log_ip,   dataIndex: 'ip',   width: 130 },
  { key: 'ua',   title: t.value.col_log_ua,   dataIndex: 'ua',   ellipsis: true },
  { key: 'at',   title: t.value.col_log_at,   dataIndex: 'at',   width: 180 },
]);

const opRows = computed<OperationLog[]>(() => initialOpLogs.slice(0, 5));
const loginRows = computed<LoginLog[]>(() => initialLoginLogs.slice(0, 5));
</script>

<template>
  <div class="adm-dashboard">
    <div class="adm-dashboard__kpis">
      <CfMetricCard
        v-for="k in kpis"
        :key="k.label"
        :label="k.label"
        :value="k.value"
        :delta="k.delta"
        :trend="k.trend"
      />
    </div>

    <div class="adm-dashboard__charts">
      <section class="adm-card">
        <header class="adm-card__head">
          <h3>{{ state.locale.value === 'zh' ? '近 7 天趋势' : '7-day trend' }}</h3>
          <CfTag size="sm" tone="info">trend</CfTag>
        </header>
        <div class="adm-card__body">
          <CfLineChart
            :series="trendSeries"
            :labels="trendDays"
            :height="200"
            :show-grid="true"
            :show-labels="true"
            :show-legend="true"
            :show-tooltip="true"
            smooth
          />
        </div>
      </section>
      <section class="adm-card">
        <header class="adm-card__head">
          <h3>{{ state.locale.value === 'zh' ? '操作类型占比' : 'Operation breakdown' }}</h3>
          <CfTag size="sm" tone="success">share</CfTag>
        </header>
        <div class="adm-card__body adm-card__body--donut">
          <CfDonutChart
            :segments="donutSegments"
            :size="180"
            :thickness="22"
            :show-legend="true"
            :center-label="state.locale.value === 'zh' ? '总数' : 'Total'"
            :center-value="donutTotal"
          />
        </div>
      </section>
    </div>

    <div class="adm-dashboard__pair">
      <section class="adm-card">
        <header class="adm-card__head">
          <h3>{{ t.recent_op }}</h3>
          <CfTag size="sm" tone="info">live</CfTag>
        </header>
        <CfTable :columns="opCols" :rows="opRows" :row-key="(r: OperationLog) => String(r.id)" size="sm" />
      </section>
      <section class="adm-card">
        <header class="adm-card__head">
          <h3>{{ t.recent_login }}</h3>
          <CfTag size="sm" tone="success">stable</CfTag>
        </header>
        <CfTable :columns="loginCols" :rows="loginRows" :row-key="(r: LoginLog) => String(r.id)" size="sm" />
      </section>
    </div>
  </div>
</template>

<style scoped>
.adm-dashboard { display: flex; flex-direction: column; gap: 16px; }
.adm-dashboard__kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}
.adm-dashboard__charts {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}
.adm-dashboard__pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 1100px) {
  .adm-dashboard__charts,
  .adm-dashboard__pair { grid-template-columns: 1fr; }
}
.adm-card {
  background: var(--bg-1);
  border: 1px solid var(--line-1);
  border-radius: var(--r-6);
  overflow: hidden;
}
.adm-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid var(--line-1);
}
.adm-card__head h3 {
  margin: 0;
  font-size: var(--t-13);
  font-weight: var(--w-medium);
  color: var(--fg-1);
}
.adm-card__body { padding: 12px 14px; }
.adm-card__body--donut {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}
</style>
