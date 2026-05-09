<script setup lang="ts">
import { CfCandlestickChart } from '@chufix/vue';
const data = [
  { open: 100, close: 108, high: 112, low: 98 },
  { open: 108, close: 105, high: 110, low: 103 },
  { open: 105, close: 115, high: 117, low: 104 },
  { open: 115, close: 110, high: 118, low: 108 },
  { open: 110, close: 120, high: 122, low: 109 },
  { open: 120, close: 118, high: 124, low: 116 },
  { open: 118, close: 125, high: 128, low: 117 },
  { open: 125, close: 122, high: 127, low: 120 },
  { open: 122, close: 130, high: 132, low: 121 },
  { open: 130, close: 128, high: 133, low: 126 },
];
</script>

<template>
  <CfCandlestickChart :data="data" />
</template>