<script setup lang="ts">
import { CfMarimekkoChart, type MarimekkoColumn } from '@chufix-design/vue';

const columns: MarimekkoColumn[] = [
  {
    label: '华东',
    segments: [
      { label: 'Pro', value: 1820 },
      { label: 'Standard', value: 2400 },
      { label: 'Lite', value: 1080 },
    ],
  },
  {
    label: '华南',
    segments: [
      { label: 'Pro', value: 1240 },
      { label: 'Standard', value: 1680 },
      { label: 'Lite', value: 920 },
    ],
  },
  {
    label: '华北',
    segments: [
      { label: 'Pro', value: 980 },
      { label: 'Standard', value: 1480 },
      { label: 'Lite', value: 620 },
    ],
  },
  {
    label: '西部',
    segments: [
      { label: 'Pro', value: 540 },
      { label: 'Standard', value: 820 },
      { label: 'Lite', value: 380 },
    ],
  },
];
</script>

<template>
  <CfMarimekkoChart
    :columns="columns"
    :format="(v: number) => '¥' + v.toLocaleString()"
  />
</template>
