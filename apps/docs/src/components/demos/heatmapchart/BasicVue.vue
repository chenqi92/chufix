<script setup lang="ts">
import { CfHeatmapChart, CfText } from '@chufix-design/vue';

const rows = 7;
const cols = 12;
const data = Array.from({ length: rows }, (_, r) =>
  Array.from({ length: cols }, (_, c) => Math.round(20 + 60 * Math.abs(Math.sin((r + 1) * (c + 1) * 0.4)))),
);
const rowLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const colLabels = Array.from({ length: cols }, (_, i) => `${i * 2}h`);
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div>
      <CfText size="sm" variant="muted">green-red（默认）</CfText>
      <CfHeatmapChart :data="data" :row-labels="rowLabels" :col-labels="colLabels" />
    </div>
    <div>
      <CfText size="sm" variant="muted">viridis</CfText>
      <CfHeatmapChart :data="data" :row-labels="rowLabels" :col-labels="colLabels" color-scale="viridis" />
    </div>
    <div>
      <CfText size="sm" variant="muted">mono-accent + 显示数值</CfText>
      <CfHeatmapChart :data="data" :row-labels="rowLabels" :col-labels="colLabels" color-scale="mono-accent" show-value-labels />
    </div>
  </div>
</template>
