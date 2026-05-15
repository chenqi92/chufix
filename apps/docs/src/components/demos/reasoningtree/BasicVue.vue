<script setup lang="ts">
import { CfReasoningTree, type ReasoningNode } from '@chufix-design/vue';

const root: ReasoningNode = {
  id: 'root',
  thought: '用户请求：「修复 dashboard P99 慢」',
  children: [
    {
      id: 'h1',
      thought: '假设 A：数据库慢查询',
      score: 0.72,
      selected: true,
      children: [
        { id: 'h1-1', thought: '查 explain：缺索引 idx_user_created_at', score: 0.81, selected: true },
        { id: 'h1-2', thought: '查 pg_stat_statements top calls', score: 0.55 },
      ],
    },
    {
      id: 'h2',
      thought: '假设 B：N+1 查询',
      score: 0.4,
      children: [
        { id: 'h2-1', thought: '审 controller 主路径，未发现 N+1', score: 0.25 },
      ],
    },
    {
      id: 'h3',
      thought: '假设 C：前端 hydrate 慢',
      score: 0.18,
    },
  ],
};
</script>

<template>
  <CfReasoningTree :root="root" />
</template>
