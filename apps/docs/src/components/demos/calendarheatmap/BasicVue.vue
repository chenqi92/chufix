<script setup lang="ts">
import { CfCalendarHeatmap, type HeatmapDay } from '@chufix-design/vue';

function genYearOfData(): HeatmapDay[] {
  const out: HeatmapDay[] = [];
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const seed = (d.getFullYear() * 137 + d.getMonth() * 31 + d.getDate()) % 100;
    let v = 0;
    if (seed > 30) v = Math.floor((seed - 30) / 12);
    out.push({
      date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      value: v,
    });
  }
  return out;
}

const data = genYearOfData();
</script>

<template>
  <CfCalendarHeatmap :data="data" />
</template>
