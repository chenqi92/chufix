<script setup lang="ts">
import { CfSlopeChart, type SlopeItem } from '@chufix-design/vue';

const items: SlopeItem[] = [
  { label: '主页', before: 8.4, after: 10.2 },
  { label: '搜索', before: 6.1, after: 7.9 },
  { label: '商品详情', before: 5.5, after: 5.1 },
  { label: '购物车', before: 3.2, after: 4.8 },
  { label: '结算', before: 2.9, after: 2.0 },
  { label: '帮助中心', before: 1.4, after: 1.6 },
];
</script>

<template>
  <CfSlopeChart
    :items="items"
    before-label="Q1（百万 PV）"
    after-label="Q2"
    :format="(v: number) => v.toFixed(1)"
  />
</template>
