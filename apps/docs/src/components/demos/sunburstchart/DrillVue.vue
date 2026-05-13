<script setup lang="ts">
import { ref } from 'vue';
import { CfSunburstChart, CfTag } from '@chufix-design/vue';

const root = {
  name: '全公司',
  children: [
    {
      name: '产品',
      colorIndex: 0,
      children: [
        { name: '设计', value: 12 },
        { name: '前端', value: 18 },
        { name: '后端', value: 22 },
        { name: '移动端', value: 8 },
      ],
    },
    {
      name: '增长',
      colorIndex: 1,
      children: [
        { name: '增长黑客', value: 6 },
        { name: '内容', value: 10 },
        { name: 'BD', value: 8 },
      ],
    },
    {
      name: '后台',
      colorIndex: 2,
      children: [
        { name: 'HR', value: 4 },
        { name: '财务', value: 5 },
        { name: '法务', value: 3 },
        { name: '行政', value: 4 },
      ],
    },
  ],
};

const path = ref<string[]>([]);
</script>

<template>
  <p style="margin: 0 0 8px; color: var(--fg-3); font-size: 12px;">
    点击外环任意分类 → 该子树成为新焦点；中心 ↑ 或顶部面包屑回到上层。
  </p>
  <CfSunburstChart
    :root="root"
    :size="340"
    @drill="(p: { pathNames: string[] }) => path = p.pathNames"
  />
  <p style="margin-top: 8px; font-size: 12px;">
    <CfTag tone="info" size="sm">焦点路径</CfTag>
    {{ path.length ? path.join(' / ') : '（顶层）' }}
  </p>
</template>
