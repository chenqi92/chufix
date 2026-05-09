<script setup lang="ts">
import { CfChartToolbar } from '@chufix/vue';
const series = [
  { name: 'CPU', colorIndex: 0 },
  { name: 'Memory', colorIndex: 1 },
  { name: 'Disk', colorIndex: 2, hidden: true },
];
</script>

<template>
  <div style="border: 1px solid var(--line-1); border-radius: var(--r-6); overflow: hidden;">
    <CfChartToolbar
      title="系统资源"
      subtitle="last 24h · 1m sampling"
      :series="series"
      show-zoom
      show-export
      show-refresh
      @series-toggle="(name) => alert(`Toggle: ${name}`)"
      @action="(kind) => alert(`Action: ${kind}`)"
    />
    <div style="height: 80px; background: var(--bg-inset); display: flex; align-items: center; justify-content: center; color: var(--fg-3);">图表区</div>
  </div>
</template>