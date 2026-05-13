<script setup lang="ts">
import { CfTornadoChart, type TornadoItem } from '@chufix-design/vue';

const items: TornadoItem[] = [
  { label: '18-24', left: 5400, right: 4900 },
  { label: '25-34', left: 12400, right: 11800 },
  { label: '35-44', left: 9600, right: 10200 },
  { label: '45-54', left: 6200, right: 7400 },
  { label: '55-64', left: 3800, right: 5100 },
  { label: '65+', left: 1600, right: 2800 },
];
</script>

<template>
  <CfTornadoChart
    :items="items"
    left-label="男性"
    right-label="女性"
    :format="(v: number) => v.toLocaleString()"
  />
</template>
