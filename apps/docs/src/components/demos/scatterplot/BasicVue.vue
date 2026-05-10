<script setup lang="ts">
import { CfScatterPlot } from '@chufix-design/vue';
const data = Array.from({ length: 60 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  group: i % 4 === 0 ? 'a' : i % 4 === 1 ? 'b' : i % 4 === 2 ? 'c' : 'd',
}));
</script>

<template>
  <CfScatterPlot :data="data" />
</template>