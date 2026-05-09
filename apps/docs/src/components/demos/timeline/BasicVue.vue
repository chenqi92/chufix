<script setup lang="ts">
import { CfTimeline, type TimelineItem } from '@chufix/vue';

const items: TimelineItem[] = [
  { title: '提交了 PR #128', time: '2026-05-08 10:14', color: 'primary' },
  { title: 'CI 通过', content: '构建 / 测试 / 类型检查全部通过', time: '2026-05-08 10:18', color: 'success' },
  { title: '触发 staging 部署', time: '2026-05-08 10:30', color: 'primary' },
  { title: '收到性能回归告警', content: '/api/list P99 上升 220ms', time: '2026-05-08 11:02', color: 'warning' },
  { title: '回滚到上一版本', time: '2026-05-08 11:08', color: 'danger' },
];
</script>

<template>
  <div style="max-width: 28rem;">
    <CfTimeline :items="items" />
  </div>
</template>
