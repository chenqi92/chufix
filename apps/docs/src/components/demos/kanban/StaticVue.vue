<script setup lang="ts">
import { ref } from 'vue';
import { CfKanban, type KanbanColumn } from '@chufix-design/vue';

const board = ref<KanbanColumn[]>([
  {
    id: 'todo',
    title: '待办',
    cards: [
      { id: 'c1', title: '设计登录页', tag: 'design' },
      { id: 'c2', title: '梳理 API 字段', tag: 'backend' },
    ],
  },
  {
    id: 'doing',
    title: '进行中',
    cards: [{ id: 'c3', title: '埋点 SDK 接入', tag: 'frontend', meta: '@小明' }],
  },
  {
    id: 'done',
    title: '已完成',
    cards: [{ id: 'c4', title: '更新 README', meta: '昨天' }],
  },
]);
</script>

<template>
  <CfKanban v-model="board" :draggable="false" />
</template>
