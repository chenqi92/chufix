<script setup lang="ts">
import { computed, ref } from 'vue';
import { CfChartToolbar, CfLineChart } from '@chufix-design/vue';
const series = ref([
  { name: 'CPU', colorIndex: 0, hidden: false, data: [20, 35, 30, 50, 65, 45, 60, 75, 65, 80] },
  { name: 'Memory', colorIndex: 1, hidden: false, data: [40, 38, 50, 55, 60, 58, 62, 68, 72, 70] },
  { name: 'Disk', colorIndex: 2, hidden: true, data: [10, 12, 14, 18, 22, 25, 28, 32, 30, 35] },
]);
const visible = computed(() => series.value.filter((s) => !s.hidden));
function toggle(name: string) {
  series.value = series.value.map((s) =>
    s.name === name ? { ...s, hidden: !s.hidden } : s,
  );
}
</script>

<template>
  <div style="border: 1px solid var(--line-1); border-radius: var(--r-6); overflow: hidden;">
    <CfChartToolbar
      title="系统资源"
      subtitle="last 10m · live"
      :series="series"
      show-zoom
      show-export
      show-refresh
      @series-toggle="(name: string) => toggle(name)"
      @action="(kind: string) => alert(`Action: ${kind}`)"
    />
    <div style="padding: 12px;">
      <CfLineChart :series="visible" :height="180" smooth />
    </div>
  </div>
</template>
