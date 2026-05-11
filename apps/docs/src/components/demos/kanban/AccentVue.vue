<script setup lang="ts">
import { ref } from 'vue';
import { CfKanban, type KanbanColumn } from '@chufix-design/vue';

const board = ref<KanbanColumn[]>([
  {
    id: 'backlog',
    title: 'Backlog',
    accent: 'oklch(70% 0.04 260)',
    cards: [
      { id: 'b1', title: '设计 Brand 系统', tag: 'design' },
      { id: 'b2', title: '梳理 SLA 表', tag: 'docs' },
      { id: 'b3', title: '调研监控方案' },
    ],
  },
  {
    id: 'wip',
    title: '进行中',
    limit: 2,
    accent: 'oklch(70% 0.16 60)',
    cards: [
      { id: 'w1', title: '新版仪表盘', tag: 'frontend', meta: '@小明' },
      { id: 'w2', title: '统一鉴权 SDK', tag: 'backend', meta: '@小红' },
    ],
  },
  {
    id: 'review',
    title: '待评审',
    accent: 'oklch(70% 0.16 280)',
    cards: [{ id: 'r1', title: '埋点白名单', tag: 'data' }],
  },
  {
    id: 'done',
    title: '已完成',
    accent: 'oklch(70% 0.16 145)',
    cards: [
      { id: 'd1', title: '部署稳定性周报', meta: '昨天' },
      { id: 'd2', title: '修复时区 bug', tag: 'bugfix', meta: '前天' },
    ],
  },
]);
</script>

<template>
  <CfKanban v-model="board" />
</template>
