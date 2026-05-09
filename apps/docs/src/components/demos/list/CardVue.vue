<script setup lang="ts">
import { CfList, type ListItem } from '@chufix/vue';

const items: ListItem[] = [
  { key: '1', label: '订单 #2026-001', description: '总额 ¥1,280 · 已支付' },
  { key: '2', label: '订单 #2026-002', description: '总额 ¥698 · 已发货' },
  { key: '3', label: '订单 #2026-003', description: '总额 ¥3,450 · 处理中' },
];
</script>

<template>
  <CfList :items="items" variant="card" :bordered="false" />
</template>
