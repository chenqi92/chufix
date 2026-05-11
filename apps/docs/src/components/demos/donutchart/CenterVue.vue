<script setup lang="ts">
import { CfDonutChart } from '@chufix-design/vue';
const segments = [
  { name: '已完成', value: 78 },
  { name: '进行中', value: 14, colorIndex: 4 },
  { name: '未开始', value: 8, colorIndex: 5 },
];
</script>

<template>
  <div class="demo-row" style="gap: 32px; align-items: center;">
    <CfDonutChart :segments="segments" :size="160" :thickness="14" :show-legend="false" center-value="78%" center-label="完成率" />
    <CfDonutChart :segments="segments" :size="160" :thickness="22" :show-legend="false" center-value="78%" center-label="完成率" />
    <CfDonutChart :segments="segments" :size="160" :thickness="32" :show-legend="false" center-value="78%" center-label="完成率" />
  </div>
</template>
