<script setup lang="ts">
import { CfVennDiagram, type VennIntersection, type VennSet } from '@chufix-design/vue';

const sets: VennSet[] = [
  { label: '邮件订阅', count: 12800 },
  { label: 'App 用户', count: 9400 },
  { label: '付费会员', count: 5200 },
];

const intersections: VennIntersection[] = [
  { sets: [0, 1], count: 3200, label: '邮件 ∩ App' },
  { sets: [0, 2], count: 1800, label: '邮件 ∩ 付费' },
  { sets: [1, 2], count: 2400, label: 'App ∩ 付费' },
  { sets: [0, 1, 2], count: 1200, label: '全部' },
];
</script>

<template>
  <CfVennDiagram :sets="sets" :intersections="intersections" :size="320" />
</template>
