<script setup lang="ts">
import { CfTimelineGantt, type GanttRow } from '@chufix-design/vue';

const today = new Date();
function iso(offset: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

const rows: GanttRow[] = [
  {
    id: 'design',
    label: '设计稿',
    bars: [{ id: 'd1', label: '高保真', start: iso(-3), end: iso(2), progress: 0.6 }],
  },
  {
    id: 'frontend',
    label: '前端开发',
    bars: [{ id: 'f1', label: '组件实现', start: iso(0), end: iso(8) }],
  },
  {
    id: 'backend',
    label: '后端接口',
    bars: [
      { id: 'b1', label: 'API 联调', start: iso(2), end: iso(7), color: 'oklch(70% 0.13 175)' },
    ],
  },
  {
    id: 'qa',
    label: '测试 / 上线',
    bars: [
      { id: 'q1', label: '回归', start: iso(8), end: iso(11), color: 'oklch(74% 0.16 80)' },
      { id: 'q2', label: '上线', start: iso(12), end: iso(13), color: 'oklch(64% 0.18 30)' },
    ],
  },
];
</script>

<template>
  <CfTimelineGantt
    :rows="rows"
    :start="iso(-7)"
    :end="iso(15)"
    :day-width="28"
  />
</template>
