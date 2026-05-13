<script setup lang="ts">
import { CfDualAxisChart } from '@chufix-design/vue';

const categories = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
const bar = {
  label: '营收（万）',
  data: [82, 105, 121, 98, 134, 168, 192, 178, 205, 224, 248, 286],
};
const line = {
  label: '同比增长',
  data: [4, 12, 8, -3, 15, 22, 28, 18, 24, 30, 32, 36],
  smooth: true,
};
</script>

<template>
  <CfDualAxisChart
    :categories="categories"
    :bar="bar"
    :line="line"
    :format-bar="(v: number) => v + ' 万'"
    :format-line="(v: number) => v + '%'"
  />
</template>
