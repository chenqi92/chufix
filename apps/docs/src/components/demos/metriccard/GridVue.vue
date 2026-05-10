<script setup lang="ts">
import { CfMetricCard } from '@chufix-design/vue';
function rand(n: number, base: number, jitter: number) {
  return Array.from({ length: n }, () => base + (Math.random() - 0.5) * jitter);
}
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
    <CfMetricCard label="今日 PV" value="12,420" unit="" :delta="8.4" :trend="rand(20, 65, 30)" />
    <CfMetricCard label="活跃用户" value="3,180" :delta="-2.1" :trend="rand(20, 80, 20)" />
    <CfMetricCard label="付费转化" value="6.2" unit="%" :delta="0.4" :trend="rand(20, 55, 15)" />
    <CfMetricCard label="平均停留" value="3:42" unit="" :delta="0" :trend="rand(20, 50, 8)" />
    <CfMetricCard label="错误率" value="0.18" unit="%" :delta="-0.06" :trend="rand(20, 40, 25)" />
  </div>
</template>
