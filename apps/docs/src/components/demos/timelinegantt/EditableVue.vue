<script setup lang="ts">
import { ref } from 'vue';
import { CfTimelineGantt, toast, type GanttRow } from '@chufix-design/vue';

function iso(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

const rows = ref<GanttRow[]>([
  {
    id: 'r1',
    label: '里程碑 A',
    bars: [{ id: 'a1', label: '设计', start: iso(-2), end: iso(3), progress: 0.4 }],
  },
  {
    id: 'r2',
    label: '里程碑 B',
    bars: [{ id: 'b1', label: '开发', start: iso(2), end: iso(8) }],
  },
  {
    id: 'r3',
    label: '里程碑 C',
    bars: [{ id: 'c1', label: '验收', start: iso(8), end: iso(12), color: 'oklch(74% 0.16 80)' }],
  },
]);

function onChange(payload: {
  bar: { id: string };
  next: { start: Date; end: Date };
}) {
  for (const row of rows.value) {
    const b = row.bars.find((x) => x.id === payload.bar.id);
    if (b) {
      b.start = payload.next.start.toISOString().slice(0, 10);
      b.end = payload.next.end.toISOString().slice(0, 10);
    }
  }
  toast({
    type: 'info',
    message: `${payload.bar.id}: ${payload.next.start.toISOString().slice(5, 10)} → ${payload.next.end.toISOString().slice(5, 10)}`,
  });
}
</script>

<template>
  <p style="margin: 0 0 8px; color: var(--fg-3); font-size: 12px;">
    拖拽条体移动；拖拽左/右边缘缩放（每格 = 1 天）。
  </p>
  <CfTimelineGantt
    :rows="rows"
    :start="iso(-7)"
    :end="iso(15)"
    :day-width="28"
    editable
    @bar-change="onChange"
  />
</template>
