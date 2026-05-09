<script setup lang="ts">
import { CfDonutChart } from '@chufix/vue';
const segments = [
  { name: 'Chrome', value: 65 },
  { name: 'Safari', value: 18 },
  { name: 'Firefox', value: 9 },
  { name: 'Edge', value: 5 },
  { name: 'Other', value: 3 },
];
</script>

<template>
  <CfDonutChart :segments="segments" :size="200" :thickness="28" center-value="100%" center-label="访问占比" />
</template>