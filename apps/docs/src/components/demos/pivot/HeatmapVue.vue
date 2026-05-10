<script setup lang="ts">
import { ref } from 'vue';
import { CfPivot, CfSelect } from '@chufix-design/vue';
import type { PivotAggregator } from '@chufix-design/vue';

interface Trip {
  weekday: string;
  hour: string;
  count: number;
}

const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const HOURS = ['00', '04', '08', '12', '16', '20'];

const data: Trip[] = [];
for (const w of WEEKDAYS) {
  for (const h of HOURS) {
    let base = 50;
    if (h === '08' || h === '12' || h === '16') base += 220;
    if (w === '周六' || w === '周日') base = h === '12' || h === '20' ? 280 : 120;
    data.push({ weekday: w, hour: h, count: Math.round(base + Math.random() * 60) });
  }
}

const agg = ref<PivotAggregator>('sum');
const aggOptions = [
  { value: 'sum', label: 'sum' },
  { value: 'avg', label: 'avg' },
  { value: 'count', label: 'count' },
  { value: 'max', label: 'max' },
];
</script>

<template>
  <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
    <span style="font-size: 12px; color: var(--fg-3);">aggregator</span>
    <CfSelect v-model="agg" :options="aggOptions" size="sm" style="max-width: 120px;" />
  </div>
  <CfPivot
    :data="data"
    row-field="weekday"
    col-field="hour"
    value-field="count"
    :aggregator="agg"
    heatmap
    :show-totals="false"
    caption="周 × 小时 出行热力（模拟数据）"
  />
</template>
