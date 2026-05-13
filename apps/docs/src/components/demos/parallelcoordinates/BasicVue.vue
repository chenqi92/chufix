<script setup lang="ts">
import { CfParallelCoordinates, type ParallelAxis, type ParallelItem } from '@chufix-design/vue';

const axes: ParallelAxis[] = [
  { key: 'cpu', label: 'CPU %', min: 0, max: 100 },
  { key: 'mem', label: 'Mem %', min: 0, max: 100 },
  { key: 'rt', label: 'P95 ms', min: 0, max: 800, format: (v) => v + 'ms' },
  { key: 'qps', label: 'QPS', min: 0, max: 4000 },
  { key: 'err', label: 'Err %', min: 0, max: 5, reversed: true },
];

const items: ParallelItem[] = [
  { label: 'web-01', group: 'web', values: { cpu: 38, mem: 52, rt: 120, qps: 2200, err: 0.4 } },
  { label: 'web-02', group: 'web', values: { cpu: 42, mem: 58, rt: 145, qps: 1850, err: 0.7 } },
  { label: 'web-03', group: 'web', values: { cpu: 55, mem: 60, rt: 220, qps: 1500, err: 1.2 } },
  { label: 'api-01', group: 'api', values: { cpu: 62, mem: 71, rt: 320, qps: 980, err: 1.8 } },
  { label: 'api-02', group: 'api', values: { cpu: 68, mem: 75, rt: 380, qps: 820, err: 2.4 } },
  { label: 'worker-01', group: 'worker', values: { cpu: 82, mem: 88, rt: 540, qps: 320, err: 3.2 } },
  { label: 'worker-02', group: 'worker', values: { cpu: 90, mem: 92, rt: 620, qps: 280, err: 4.1 } },
];
</script>

<template>
  <CfParallelCoordinates :axes="axes" :items="items" :height="280" />
</template>
