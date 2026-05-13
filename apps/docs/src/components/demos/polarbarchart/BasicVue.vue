<script setup lang="ts">
import { CfPolarBarChart, type PolarBarItem } from '@chufix-design/vue';

const HOURS = Array.from({ length: 24 }, (_, h) => `${h}`);
const data = [12, 8, 5, 3, 2, 4, 18, 42, 86, 95, 88, 76, 102, 118, 124, 132, 138, 145, 132, 108, 76, 52, 36, 22];

const items: PolarBarItem[] = HOURS.map((label, i) => ({
  label,
  value: data[i],
}));
</script>

<template>
  <CfPolarBarChart :items="items" :size="320" :format="(v: number) => v + ' 次'" />
  <p style="text-align: center; color: var(--fg-3); font-size: 12px; margin-top: 8px;">
    24 小时访问分布
  </p>
</template>
