<script setup lang="ts">
import { CfAgentTimeline, type AgentEvent } from '@chufix-design/vue';

const now = Date.now();
const events: AgentEvent[] = [
  {
    id: 'e1',
    type: 'thought',
    title: '理解用户意图',
    content: '修复 dashboard P99 加载慢。先看 trace 找瓶颈。',
    timestamp: now - 12000,
  },
  {
    id: 'e2',
    type: 'tool',
    title: 'jaeger.search',
    content: '{ service: "web-dashboard", lookback: "1h", min_duration: "1s" }',
    duration: 850,
    timestamp: now - 11000,
    meta: { spans: 142, slowest: '4.2s' },
  },
  {
    id: 'e3',
    type: 'observation',
    title: 'DB 查询占总时长 76%',
    content: 'SELECT * FROM entries WHERE user_id = ? ORDER BY created_at DESC',
    timestamp: now - 9000,
  },
  {
    id: 'e4',
    type: 'tool',
    title: 'sql.explain',
    duration: 220,
    content: 'EXPLAIN: Seq Scan on entries, rows=2.4M, cost=12834..98231',
    timestamp: now - 7500,
  },
  {
    id: 'e5',
    type: 'action',
    title: '创建迁移 add_idx_entries_user_created',
    duration: 50,
    timestamp: now - 6000,
  },
  {
    id: 'e6',
    type: 'message',
    title: '已开 PR #1042',
    content: '请 review；P99 预期从 4.2s → 80ms。',
    timestamp: now - 1000,
  },
];
</script>

<template>
  <CfAgentTimeline :events="events" />
</template>
