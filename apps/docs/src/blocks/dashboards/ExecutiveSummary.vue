<script setup lang="ts">
import { CfSparkline, CfStat } from '@chufix-design/vue';

function r(n: number, base: number, jit: number) {
  return Array.from({ length: n }, (_, i) => Number((base + Math.sin(i / 2.2) * jit * 0.32 + Math.cos(i / 3.6) * jit * 0.18).toFixed(3)));
}
const kpis = [
  { label: 'ARR', value: '$ 12.4M', delta: 18.4, trend: r(20, 60, 30), unit: '' },
  { label: 'MAU', value: '284k', delta: 6.2, trend: r(20, 70, 25), unit: '' },
  { label: 'NPS', value: 67, delta: 4, trend: r(20, 50, 20), unit: '' },
  { label: '人均 LTV', value: '$ 412', delta: -2.1, trend: r(20, 80, 15), unit: '' },
];
</script>

<template>
  <div class="exec">
    <header class="exec__head">
      <h2>Executive Summary</h2>
      <p>2026 Q1 经营摘要 · 适合做月会幻灯片首页</p>
    </header>
    <section class="exec__kpis">
      <article v-for="k in kpis" :key="k.label" class="exec__kpi">
        <div class="exec__kpi-label">{{ k.label }}</div>
        <div class="exec__kpi-value">{{ k.value }}</div>
        <div class="exec__kpi-delta" :data-tone="k.delta > 0 ? 'pos' : k.delta < 0 ? 'neg' : 'flat'">
          {{ k.delta > 0 ? '+' : '' }}{{ k.delta }}%
          <span class="exec__kpi-vs">vs 上季度</span>
        </div>
        <CfSparkline :data="k.trend" :width="220" :height="48" filled smooth />
      </article>
    </section>
  </div>
</template>

<style scoped>
.exec {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: var(--font-sans);
}
.exec__head h2 {
  margin: 0;
  font-size: var(--t-22);
  font-weight: var(--w-medium);
  color: var(--fg-1);
}
.exec__head p {
  margin: 4px 0 0;
  color: var(--fg-3);
  font-size: var(--t-12);
}
.exec__kpis {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.exec__kpi {
  background: var(--bg-1);
  border: 1px solid var(--line-1);
  border-radius: var(--r-6);
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.exec__kpi-label {
  font-size: var(--t-11);
  color: var(--fg-3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.exec__kpi-value {
  font-size: 32px;
  font-weight: 600;
  color: var(--fg-1);
  line-height: 1.1;
}
.exec__kpi-delta {
  font-size: var(--t-13);
  font-family: var(--font-mono);
  font-weight: var(--w-medium);
}
.exec__kpi-delta[data-tone='pos'] { color: var(--status-success); }
.exec__kpi-delta[data-tone='neg'] { color: var(--status-error); }
.exec__kpi-delta[data-tone='flat'] { color: var(--fg-3); }
.exec__kpi-vs {
  color: var(--fg-3);
  font-weight: 400;
  margin-left: 6px;
}
</style>
