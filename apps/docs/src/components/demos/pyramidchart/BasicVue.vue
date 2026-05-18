<script setup lang="ts">
import { CfPyramidChart } from '@chufix-design/vue';

const data = [
  { label: '0–14', left: 6.8, right: 6.2 },
  { label: '15–24', left: 5.9, right: 5.4 },
  { label: '25–34', left: 8.1, right: 7.8 },
  { label: '35–44', left: 9.4, right: 9.1 },
  { label: '45–54', left: 8.7, right: 8.6 },
  { label: '55–64', left: 6.9, right: 7.1 },
  { label: '65+', left: 5.2, right: 6.4 },
];

function fmt(v: number) {
  return `${v.toFixed(1)}%`;
}
</script>

<template>
  <CfPyramidChart
    :data="data"
    :width="540"
    :height="340"
    left-label="男性"
    right-label="女性"
    :format="fmt"
  />
</template>
