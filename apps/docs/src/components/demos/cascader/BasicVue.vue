<script setup lang="ts">
import { ref } from 'vue';
import { CfCascader, type CascaderOption } from '@chufix/vue';

const options: CascaderOption[] = [
  {
    value: 'cn',
    label: '中国',
    children: [
      {
        value: 'sh',
        label: '上海',
        children: [
          { value: 'pudong', label: '浦东新区' },
          { value: 'huangpu', label: '黄浦区' },
        ],
      },
      {
        value: 'bj',
        label: '北京',
        children: [
          { value: 'haidian', label: '海淀区' },
          { value: 'chaoyang', label: '朝阳区' },
        ],
      },
    ],
  },
  {
    value: 'us',
    label: '美国',
    children: [
      { value: 'ny', label: '纽约', children: [{ value: 'manhattan', label: 'Manhattan' }] },
    ],
  },
];

const value = ref<string[]>([]);
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-start;">
    <CfCascader v-model="value" :options="options" clearable />
    <span style="font-size: 12px; color: var(--fg-3);">选中：<code>{{ value.join(' / ') || '(无)' }}</code></span>
  </div>
</template>
