<script setup lang="ts">
import { CfGauge, CfSparkline, CfLatencyHeatmap, CfStatusCodeBadge } from '@chufix-design/vue';

function rand(n: number, base: number, jit: number) {
  return Array.from({ length: n }, () => base + (Math.random() - 0.5) * jit);
}
function row(peak: number) {
  return Array.from({ length: 24 }, (_, h) => {
    const dist = Math.abs(h - peak);
    return 60 + (24 - dist) * 8 + Math.random() * 40;
  });
}
const heatmap = [row(15), row(15), row(15), row(16), row(15), row(13), row(13)];
const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const hours = Array.from({ length: 24 }, (_, i) => (i % 4 === 0 ? `${i}h` : ''));

const services = [
  { name: 'gateway', uptime: 99.9, errors: 0 },
  { name: 'auth', uptime: 99.5, errors: 4 },
  { name: 'orders', uptime: 99.7, errors: 1 },
  { name: 'payments', uptime: 98.2, errors: 12 },
  { name: 'inventory', uptime: 99.9, errors: 0 },
  { name: 'notify', uptime: 100, errors: 0 },
];
</script>

<template>
  <div class="mon">
    <header class="mon__head">
      <h2>Monitoring</h2>
      <p>实时系统状态 · 自动刷新 30s</p>
    </header>

    <section class="mon__gauges">
      <CfGauge :value="42" label="CPU" unit="%" tone="success" :size="140" />
      <CfGauge :value="78" label="Memory" unit="%" tone="warning" :size="140" />
      <CfGauge :value="92" label="Disk" unit="%" tone="error" :size="140" />
      <CfGauge :value="34" label="GPU" unit="%" tone="success" :size="140" />
    </section>

    <section class="mon__card">
      <h3>请求延迟热力图 · 7 天 × 24 小时</h3>
      <CfLatencyHeatmap :data="heatmap" :row-labels="days" :col-labels="hours" :height="220" />
    </section>

    <section class="mon__card">
      <h3>服务健康度</h3>
      <ul class="mon__svc">
        <li v-for="s in services" :key="s.name">
          <span class="mon__svc-name">{{ s.name }}</span>
          <CfSparkline :data="rand(20, 50, 12)" :width="140" :height="22" filled smooth :color-index="s.errors > 5 ? 3 : 2" />
          <span class="mon__svc-uptime" :data-warn="s.uptime < 99 ? 'true' : null">{{ s.uptime }}%</span>
          <CfStatusCodeBadge :code="s.errors === 0 ? 200 : s.errors > 5 ? 500 : 304" :reason="s.errors === 0 ? 'OK' : s.errors > 5 ? 'errors' : 'warn'" size="sm" />
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.mon {
  display: flex;
  flex-direction: column;
  gap: 14px;
  font-family: var(--font-sans);
}
.mon__head h2 {
  margin: 0;
  font-size: var(--t-22);
  font-weight: var(--w-medium);
  color: var(--fg-1);
}
.mon__head p {
  margin: 4px 0 0;
  color: var(--fg-3);
  font-size: var(--t-12);
}
.mon__gauges {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.mon__card {
  background: var(--bg-1);
  border: 1px solid var(--line-1);
  border-radius: var(--r-6);
  padding: 14px 16px;
}
.mon__card h3 {
  margin: 0 0 10px;
  font-size: var(--t-13);
  color: var(--fg-1);
  font-weight: var(--w-medium);
}
.mon__svc {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: var(--t-12);
}
.mon__svc > li {
  display: grid;
  grid-template-columns: 100px 1fr 60px auto;
  align-items: center;
  gap: 12px;
  padding: 6px 8px;
  border-radius: var(--r-3);
  background: var(--bg-2);
}
.mon__svc-name {
  font-family: var(--font-mono);
  color: var(--fg-1);
}
.mon__svc-uptime {
  color: var(--status-success);
  font-family: var(--font-mono);
  text-align: right;
}
.mon__svc-uptime[data-warn='true'] {
  color: var(--status-warning);
}
</style>
