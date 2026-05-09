<script setup lang="ts">
import { CfHistogram } from '@chufix/vue';
const bins = [
  { label: '0-50', count: 4 },
  { label: '50-100', count: 8 },
  { label: '100-200', count: 16 },
  { label: '200-500', count: 28 },
  { label: '500-1k', count: 22 },
  { label: '1k-2k', count: 12 },
  { label: '2k-5k', count: 5 },
  { label: '5k+', count: 1 },
];
</script>

<template>
  <CfHistogram :bins="bins" />
</template>