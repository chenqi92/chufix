<script setup lang="ts">
import { CfSankeyDiagram } from '@chufix/vue';
const nodes = [
  { id: 'a', name: '搜索引擎', layer: 0 },
  { id: 'b', name: '直接访问', layer: 0 },
  { id: 'c', name: '产品列表', layer: 1 },
  { id: 'd', name: '产品详情', layer: 1 },
  { id: 'e', name: '加入购物车', layer: 2 },
  { id: 'f', name: '完成支付', layer: 2 },
];
const links = [
  { source: 'a', target: 'c', value: 60 },
  { source: 'a', target: 'd', value: 25 },
  { source: 'b', target: 'c', value: 30 },
  { source: 'b', target: 'd', value: 40 },
  { source: 'c', target: 'e', value: 20 },
  { source: 'd', target: 'e', value: 18 },
  { source: 'e', target: 'f', value: 24 },
];
</script>

<template>
  <CfSankeyDiagram :nodes="nodes" :links="links" :height="220" />
</template>
