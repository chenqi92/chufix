<script setup lang="ts">
import { CfArcDiagram } from '@chufix-design/vue';

const nodes = [
  { id: 'auth', label: 'auth', group: 'edge', size: 2 },
  { id: 'api', label: 'api', group: 'edge', size: 3 },
  { id: 'orders', label: 'orders', group: 'core', size: 2 },
  { id: 'users', label: 'users', group: 'core', size: 2.5 },
  { id: 'billing', label: 'billing', group: 'core', size: 2 },
  { id: 'cache', label: 'cache', group: 'data', size: 1.6 },
  { id: 'pg', label: 'pg', group: 'data', size: 2.2 },
  { id: 'queue', label: 'queue', group: 'data', size: 1.6 },
];

const edges = [
  { source: 'auth', target: 'api', weight: 3 },
  { source: 'api', target: 'orders', weight: 4 },
  { source: 'api', target: 'users', weight: 3 },
  { source: 'api', target: 'billing', weight: 2 },
  { source: 'orders', target: 'pg', weight: 4 },
  { source: 'users', target: 'pg', weight: 3 },
  { source: 'billing', target: 'pg', weight: 2 },
  { source: 'orders', target: 'cache', weight: 2 },
  { source: 'api', target: 'cache', weight: 3 },
  { source: 'billing', target: 'queue', weight: 1 },
  { source: 'orders', target: 'queue', weight: 2 },
];
</script>

<template>
  <CfArcDiagram :nodes="nodes" :edges="edges" :width="660" :height="280" />
</template>
