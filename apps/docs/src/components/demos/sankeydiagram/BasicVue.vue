<script setup lang="ts">
import { CfSankeyDiagram } from '@chufix-design/vue';
const nodes = [
  { id: 'organic', name: 'Organic', layer: 0 },
  { id: 'paid', name: 'Paid', layer: 0 },
  { id: 'referral', name: 'Referral', layer: 0 },
  { id: 'web', name: 'Web', layer: 1 },
  { id: 'mobile', name: 'Mobile', layer: 1 },
  { id: 'success', name: '2xx', layer: 2 },
  { id: 'redirect', name: '3xx', layer: 2 },
  { id: 'error', name: '4xx/5xx', layer: 2 },
];
const links = [
  { source: 'organic', target: 'web', value: 50 },
  { source: 'organic', target: 'mobile', value: 30 },
  { source: 'paid', target: 'web', value: 20 },
  { source: 'paid', target: 'mobile', value: 25 },
  { source: 'referral', target: 'web', value: 10 },
  { source: 'referral', target: 'mobile', value: 5 },
  { source: 'web', target: 'success', value: 60 },
  { source: 'web', target: 'redirect', value: 12 },
  { source: 'web', target: 'error', value: 8 },
  { source: 'mobile', target: 'success', value: 45 },
  { source: 'mobile', target: 'redirect', value: 8 },
  { source: 'mobile', target: 'error', value: 7 },
];
</script>

<template>
  <CfSankeyDiagram :nodes="nodes" :links="links" />
</template>