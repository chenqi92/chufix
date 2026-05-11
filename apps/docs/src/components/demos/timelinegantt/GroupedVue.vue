<script setup lang="ts">
import { CfTimelineGantt, type GanttRow } from '@chufix-design/vue';

function iso(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

const rows: GanttRow[] = [
  { id: 'p1-design', group: 'Phase 1', label: '设计', bars: [{ id: 'p1d', label: 'wireframe', start: iso(-2), end: iso(2) }] },
  { id: 'p1-dev', group: 'Phase 1', label: '开发', bars: [{ id: 'p1v', label: 'auth + db', start: iso(2), end: iso(7) }] },
  { id: 'p2-design', group: 'Phase 2', label: '设计', bars: [{ id: 'p2d', label: 'feature flow', start: iso(7), end: iso(11), color: 'oklch(70% 0.13 175)' }] },
  { id: 'p2-dev', group: 'Phase 2', label: '开发', bars: [{ id: 'p2v', label: 'shipping', start: iso(11), end: iso(16), color: 'oklch(70% 0.13 175)' }] },
];

const dependencies = [
  { from: 'p1d', to: 'p1v' },
  { from: 'p1v', to: 'p2d' },
  { from: 'p2d', to: 'p2v' },
];
</script>

<template>
  <CfTimelineGantt
    :rows="rows"
    :dependencies="dependencies"
    :start="iso(-5)"
    :end="iso(20)"
    :day-width="26"
  />
</template>
