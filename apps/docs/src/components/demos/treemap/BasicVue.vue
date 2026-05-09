<script setup lang="ts">
import { CfTreemap } from '@chufix/vue';
const nodes = [
  { name: 'react-dom', value: 1200 },
  { name: 'react', value: 720 },
  { name: 'lodash', value: 540 },
  { name: 'moment', value: 480 },
  { name: 'rxjs', value: 380 },
  { name: 'd3', value: 320 },
  { name: 'three', value: 280 },
  { name: 'others', value: 200 },
];
</script>

<template>
  <CfTreemap :nodes="nodes" />
</template>