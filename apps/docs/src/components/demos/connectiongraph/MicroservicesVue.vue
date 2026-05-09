<script setup lang="ts">
import { CfConnectionGraph } from '@chufix/vue';
const nodes = [
  { id: 'gateway', label: 'Gateway', size: 12, colorIndex: 0 },
  { id: 'auth', label: 'Auth', size: 8, colorIndex: 1 },
  { id: 'users', label: 'Users', size: 10, colorIndex: 2 },
  { id: 'orders', label: 'Orders', size: 11, colorIndex: 3 },
  { id: 'payments', label: 'Payments', size: 10, colorIndex: 4 },
  { id: 'inventory', label: 'Inventory', size: 9, colorIndex: 5 },
  { id: 'notif', label: 'Notify', size: 7, colorIndex: 6 },
];
const edges = [
  { source: 'gateway', target: 'auth', weight: 4 },
  { source: 'gateway', target: 'users', weight: 5 },
  { source: 'gateway', target: 'orders', weight: 6 },
  { source: 'orders', target: 'payments', weight: 4 },
  { source: 'orders', target: 'inventory', weight: 3 },
  { source: 'payments', target: 'notif', weight: 2 },
  { source: 'orders', target: 'notif', weight: 2 },
];
</script>

<template>
  <CfConnectionGraph :nodes="nodes" :edges="edges" :height="320" />
</template>
