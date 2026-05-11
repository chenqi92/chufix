<script setup lang="ts">
import {
  CfMetricCard,
  CfLineChart,
  CfDonutChart,
  CfDataGrid,
  CfMethodBadge,
  CfStatusCodeBadge,
  CfStat,
} from '@chufix-design/vue';

const series = [
  { name: '请求量', data: [1240, 1480, 1650, 2030, 2180, 2310, 2620, 2480, 2790, 3020, 3140, 3380] },
  { name: '错误数', data: [12, 18, 21, 26, 22, 30, 38, 32, 41, 47, 52, 58] },
];

const trafficSeg = [
  { name: '搜索', value: 4280 },
  { name: '直接', value: 2240 },
  { name: '社交', value: 1820 },
  { name: '邮件', value: 940 },
];

const cols = [
  { key: 'method', title: '方法', dataIndex: 'method', width: 80 },
  { key: 'path', title: '路径', dataIndex: 'path' },
  { key: 'status', title: '状态', dataIndex: 'status', width: 110 },
  { key: 'time', title: '耗时', dataIndex: 'time', width: 80 },
  { key: 'when', title: '时间', dataIndex: 'when', width: 90 },
];
const rows = [
  { id: '1', method: 'GET', path: '/v1/orders', status: 200, time: '88ms', when: '2m 前' },
  { id: '2', method: 'POST', path: '/v1/orders', status: 201, time: '142ms', when: '3m 前' },
  { id: '3', method: 'PUT', path: '/v1/orders/{id}', status: 200, time: '94ms', when: '4m 前' },
  { id: '4', method: 'GET', path: '/v1/users/me', status: 304, time: '14ms', when: '5m 前' },
  { id: '5', method: 'POST', path: '/v1/login', status: 401, time: '38ms', when: '6m 前' },
  { id: '6', method: 'DELETE', path: '/v1/orders/{id}', status: 500, time: '212ms', when: '7m 前' },
];
function rand(n: number, base: number, jit: number) {
  return Array.from({ length: n }, (_, i) => Number((base + Math.sin(i / 2.5) * jit * 0.34 + Math.cos(i / 4) * jit * 0.18).toFixed(3)));
}
</script>

<template>
  <div class="dash">
    <header class="dash__head">
      <div>
        <h2 class="dash__title">Overview</h2>
        <p class="dash__sub">2026 年 5 月 · 实时数据</p>
      </div>
    </header>

    <section class="dash__metrics">
      <CfMetricCard label="今日请求" value="28,420" :delta="12.4" :trend="rand(20, 65, 28)" />
      <CfMetricCard label="活跃用户" value="3,180" :delta="-2.1" :trend="rand(20, 80, 18)" />
      <CfMetricCard label="错误率" value="0.42" unit="%" :delta="-0.08" :trend="rand(20, 40, 22)" />
      <CfMetricCard label="付费转化" value="6.2" unit="%" :delta="0.4" :trend="rand(20, 55, 12)" />
    </section>

    <section class="dash__row">
      <div class="dash__card dash__card--wide">
        <header class="dash__card-head">
          <span>请求量趋势 · 12h</span>
          <span class="dash__card-sub">peak 3,380</span>
        </header>
        <CfLineChart :series="series" smooth :height="200" />
      </div>
      <div class="dash__card">
        <header class="dash__card-head">
          <span>流量来源</span>
        </header>
        <CfDonutChart :segments="trafficSeg" :size="160" :thickness="20" center-value="9.3k" center-label="今日访问" />
      </div>
    </section>

    <section class="dash__card">
      <header class="dash__card-head">
        <span>最近请求</span>
        <span class="dash__card-sub">last 6</span>
      </header>
      <CfDataGrid :columns="cols" :rows="rows">
        <template #cell-method="{ row }">
          <CfMethodBadge :kind="row.method" />
        </template>
        <template #cell-status="{ row }">
          <CfStatusCodeBadge :code="row.status" />
        </template>
      </CfDataGrid>
    </section>
  </div>
</template>

<style scoped>
.dash {
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: var(--font-sans);
}
.dash__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.dash__title {
  margin: 0;
  font-size: var(--t-22);
  font-weight: var(--w-medium);
  color: var(--fg-1);
}
.dash__sub {
  margin: 4px 0 0;
  color: var(--fg-3);
  font-size: var(--t-12);
}
.dash__metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}
.dash__row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 12px;
}
.dash__card {
  background: var(--bg-1);
  border: 1px solid var(--line-1);
  border-radius: var(--r-6);
  padding: 14px 16px;
}
.dash__card--wide {
  /* spans full width via grid */
}
.dash__card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: var(--t-13);
  color: var(--fg-1);
  font-weight: var(--w-medium);
}
.dash__card-sub {
  color: var(--fg-3);
  font-family: var(--font-mono);
  font-size: var(--t-11);
  font-weight: 400;
}
</style>
