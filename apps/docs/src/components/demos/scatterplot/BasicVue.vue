<script setup lang="ts">
import { CfScatterPlot } from '@chufix-design/vue';
const data = Array.from({ length: 60 }, (_, i) => ({
  x: (i * 37) % 100,
  y: (i * 53 + 17) % 100,
  group: i % 4 === 0 ? 'a' : i % 4 === 1 ? 'b' : i % 4 === 2 ? 'c' : 'd',
}));
</script>

<template>
  <CfScatterPlot :data="data" />
</template>
