<script setup lang="ts">
import { CfTimingBar } from '@chufix/vue';
const phases = [
  { label: 'DNS', start: 0, end: 12, colorIndex: 6 },
  { label: 'Connect', start: 12, end: 38, colorIndex: 0 },
  { label: 'TLS', start: 38, end: 92, colorIndex: 2 },
  { label: 'TTFB', start: 92, end: 245, colorIndex: 1 },
  { label: 'Download', start: 245, end: 312, colorIndex: 3 },
];
</script>

<template>
  <CfTimingBar :phases="phases" />
</template>