<script setup lang="ts">
import { ref } from 'vue';
import { CfMention } from '@chufix/vue';

const text = ref('在评论里输入 # 试试');
const tags = [
  { value: 'bug', label: '#bug', description: '缺陷类问题' },
  { value: 'feature', label: '#feature', description: '新功能' },
  { value: 'question', label: '#question', description: '提问 / 讨论' },
  { value: 'docs', label: '#docs', description: '文档变更' },
];
</script>

<template>
  <CfMention
    v-model="text"
    trigger="#"
    :options="tags"
    placeholder="输入 # 选择标签"
  />
</template>
