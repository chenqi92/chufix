<script setup lang="ts">
import { ref } from 'vue';
import { CfToggleGroup, CfText } from '@chufix-design/vue';

const align = ref<string | null>('left');
const tags = ref<string[]>(['draft']);

const alignOptions = [
  { value: 'left', label: '左对齐' },
  { value: 'center', label: '居中' },
  { value: 'right', label: '右对齐' },
  { value: 'justify', label: '两端' },
];

const tagOptions = [
  { value: 'draft', label: '草稿' },
  { value: 'review', label: '待审' },
  { value: 'archive', label: '归档' },
  { value: 'star', label: '星标' },
];
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 20px;">
    <div>
      <CfText size="sm" variant="muted">single（单选互斥）</CfText>
      <CfToggleGroup
        v-model="align"
        :options="alignOptions"
        aria-label="对齐方式"
      />
      <CfText size="sm" variant="subtle">当前：{{ align ?? '未选' }}</CfText>
    </div>

    <div>
      <CfText size="sm" variant="muted">multi（多选）</CfText>
      <CfToggleGroup
        v-model="tags"
        :options="tagOptions"
        mode="multi"
        aria-label="标签"
      />
      <CfText size="sm" variant="subtle">已选：{{ tags.join(' / ') || '无' }}</CfText>
    </div>
  </div>
</template>
