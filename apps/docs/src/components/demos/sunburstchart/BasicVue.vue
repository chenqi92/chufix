<script setup lang="ts">
import { CfSunburstChart } from '@chufix-design/vue';

const root = {
  name: '总流量',
  children: [
    {
      name: '搜索',
      colorIndex: 0,
      children: [
        { name: 'Google', value: 420 },
        { name: 'Bing', value: 80 },
        { name: 'Baidu', value: 60 },
      ],
    },
    {
      name: '社交',
      colorIndex: 1,
      children: [
        { name: 'Twitter', value: 180 },
        { name: 'LinkedIn', value: 90 },
        { name: 'Reddit', value: 60 },
      ],
    },
    {
      name: '直访',
      colorIndex: 2,
      children: [
        { name: 'App', value: 240 },
        { name: 'Bookmark', value: 120 },
      ],
    },
    {
      name: '引荐',
      colorIndex: 3,
      children: [
        { name: 'Blog', value: 70 },
        { name: 'Partner', value: 50 },
        { name: 'Other', value: 30 },
      ],
    },
  ],
};
</script>

<template>
  <CfSunburstChart :root="root" :size="320" />
</template>
