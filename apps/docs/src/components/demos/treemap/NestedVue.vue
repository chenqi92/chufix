<script setup lang="ts">
import { ref } from 'vue';
import { CfTag, CfTreemap } from '@chufix-design/vue';

const nodes = [
  {
    name: '亚太',
    children: [
      { name: '中国', value: 4280 },
      { name: '日本', value: 1820 },
      { name: '东南亚', value: 1240 },
      { name: '澳洲', value: 760 },
    ],
  },
  {
    name: '欧洲',
    children: [
      { name: '英国', value: 1420 },
      { name: '德国', value: 1380 },
      { name: '法国', value: 980 },
      { name: '北欧', value: 820 },
    ],
  },
  {
    name: '北美',
    children: [
      { name: '美国', value: 3920 },
      { name: '加拿大', value: 1080 },
    ],
  },
  {
    name: '其他',
    children: [
      { name: '南美', value: 620 },
      { name: '中东', value: 540 },
      { name: '非洲', value: 380 },
    ],
  },
];

const focus = ref<string[]>([]);
</script>

<template>
  <p style="margin: 0 0 8px; color: var(--fg-3); font-size: 12px;">
    顶层方块直接展示子分类的嵌套排版;单击有子项的方块即可下钻聚焦到该子树。
  </p>
  <CfTreemap
    :nodes="nodes"
    :width="640"
    :height="320"
    @drill="(p: { pathNames: string[] }) => focus = p.pathNames"
  />
  <p style="margin-top: 8px; font-size: 12px;">
    <CfTag tone="info" size="sm">焦点</CfTag>
    {{ focus.length ? focus.join(' / ') : '全部' }}
  </p>
</template>
