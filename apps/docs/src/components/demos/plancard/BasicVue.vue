<script setup lang="ts">
import { CfPlanCard, type PlanStep } from '@chufix-design/vue';

const steps: PlanStep[] = [
  {
    id: 's1',
    title: '解析用户请求',
    status: 'done',
    duration: 32,
    description: '识别意图为「修复 dashboard 加载缓慢」',
  },
  {
    id: 's2',
    title: '搜索相关代码文件',
    status: 'done',
    duration: 420,
    detail: 'grep -r "fetchDashboard" packages/web/src\n→ 3 matches',
  },
  {
    id: 's3',
    title: '分析 P99 trace',
    status: 'active',
    description: '正在解析 jaeger 数据，预计 12s',
  },
  {
    id: 's4',
    title: '提议修改',
    status: 'pending',
  },
  {
    id: 's5',
    title: '运行测试',
    status: 'pending',
  },
];
</script>

<template>
  <CfPlanCard title="oncall · dashboard 加载缓慢" :steps="steps" :initial-open-ids="['s2']" />
</template>
