<script setup lang="ts">
import { CfStreamGraph, type StreamSeries } from '@chufix-design/vue';

const categories = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

const series: StreamSeries[] = [
  { label: '搜索', data: [120, 142, 158, 180, 220, 268, 290, 312, 340, 360, 380, 400] },
  { label: '直接', data: [220, 232, 248, 260, 270, 268, 272, 290, 310, 330, 348, 360] },
  { label: '社交', data: [82, 88, 102, 138, 178, 220, 262, 304, 340, 320, 290, 240] },
  { label: '邮件', data: [60, 62, 66, 72, 78, 86, 92, 100, 110, 124, 138, 150] },
];
</script>

<template>
  <CfStreamGraph
    :categories="categories"
    :series="series"
    :height="240"
    :format="(v: number) => v.toLocaleString()"
  />
</template>
