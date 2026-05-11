<script setup lang="ts">
import { CfMetricCard } from '@chufix-design/vue';
function trend(n: number, base: number, jitter: number, phase: number) {
  return Array.from({ length: n }, (_, i) => Number((
    base
    + Math.sin((i + phase) / 2.4) * jitter * 0.36
    + Math.cos((i + phase) / 5) * jitter * 0.18
  ).toFixed(3)));
}
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; width: 100%;">
    <CfMetricCard label="今日 PV" value="12,420" unit="" :delta="8.4" :trend="trend(20, 65, 30, 0)" />
    <CfMetricCard label="活跃用户" value="3,180" :delta="-2.1" :trend="trend(20, 80, 20, 4)" />
    <CfMetricCard label="付费转化" value="6.2" unit="%" :delta="0.4" :trend="trend(20, 55, 15, 8)" />
    <CfMetricCard label="平均停留" value="3:42" unit="" :delta="0" :trend="trend(20, 50, 8, 12)" />
    <CfMetricCard label="错误率" value="0.18" unit="%" :delta="-0.06" :trend="trend(20, 40, 25, 16)" />
  </div>
</template>
