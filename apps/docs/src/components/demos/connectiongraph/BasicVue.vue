<script setup lang="ts">
import { CfConnectionGraph } from '@chufix/vue';
const nodes = [
  { id: 'web', label: 'Web' },
  { id: 'api', label: 'API' },
  { id: 'auth', label: 'Auth' },
  { id: 'db', label: 'DB' },
  { id: 'cache', label: 'Cache' },
  { id: 'queue', label: 'Queue' },
];
const edges = [
  { source: 'web', target: 'api', weight: 4 },
  { source: 'api', target: 'auth', weight: 2 },
  { source: 'api', target: 'db', weight: 5 },
  { source: 'api', target: 'cache', weight: 3 },
  { source: 'api', target: 'queue', weight: 1.5 },
  { source: 'queue', target: 'db', weight: 1 },
];
</script>

<template>
  <CfConnectionGraph :nodes="nodes" :edges="edges" />
</template>