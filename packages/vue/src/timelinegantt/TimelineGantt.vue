<script setup lang="ts">
import { computed, ref } from 'vue';
import { addDays, startOfDay, toDate } from '../datepicker/date';
import type {
  GanttBar,
  GanttBarChangeMeta,
  GanttDependency,
  GanttRow,
  TimelineGanttProps,
} from './variants';

const props = withDefaults(defineProps<TimelineGanttProps>(), {
  unit: 'day',
  dayWidth: 32,
  rowHeight: 40,
  labelWidth: 200,
  showToday: true,
  editable: false,
  weekStartsOn: 1,
  size: 'md',
});

const emit = defineEmits<{
  (e: 'bar-click', bar: GanttBar, row: GanttRow): void;
  (e: 'row-click', row: GanttRow): void;
  (e: 'bar-change', payload: { bar: GanttBar; row: GanttRow; next: { start: Date; end: Date }; meta: GanttBarChangeMeta }): void;
}>();

const rangeStart = computed<Date>(() => startOfDay(toDate(props.start) ?? new Date()));
const rangeEnd = computed<Date>(() => startOfDay(toDate(props.end) ?? addDays(rangeStart.value, 30)));
const totalDays = computed(() => Math.max(1, Math.round((rangeEnd.value.getTime() - rangeStart.value.getTime()) / 86400000) + 1));
const totalWidth = computed(() => totalDays.value * props.dayWidth);

const today = computed(() => startOfDay(new Date()));

function dayIndex(d: Date): number {
  return Math.round((startOfDay(d).getTime() - rangeStart.value.getTime()) / 86400000);
}

function clampIndex(i: number): number {
  return Math.max(0, Math.min(totalDays.value - 1, i));
}

interface TickRow { label: string; days: number; }

/* Top axis: months that intersect the range. */
const monthTicks = computed<TickRow[]>(() => {
  const out: TickRow[] = [];
  let d = new Date(rangeStart.value);
  while (d <= rangeEnd.value) {
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const winStart = monthStart < rangeStart.value ? rangeStart.value : monthStart;
    const winEnd = next > rangeEnd.value ? addDays(rangeEnd.value, 1) : next;
    const days = Math.round((winEnd.getTime() - winStart.getTime()) / 86400000);
    out.push({ label: `${d.getFullYear()} 年 ${d.getMonth() + 1} 月`, days });
    d = next;
  }
  return out;
});

/* Day cells with weekend marker. */
interface DayCell { date: Date; isToday: boolean; isWeekend: boolean; label: string; }
const dayCells = computed<DayCell[]>(() => {
  const out: DayCell[] = [];
  for (let i = 0; i < totalDays.value; i++) {
    const d = addDays(rangeStart.value, i);
    out.push({
      date: d,
      isToday: d.getTime() === today.value.getTime(),
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
      label: String(d.getDate()),
    });
  }
  return out;
});

/* Aggregate rows + group headers */
interface RenderRow { type: 'header' | 'row'; group?: string; row?: GanttRow; }
const renderRows = computed<RenderRow[]>(() => {
  const out: RenderRow[] = [];
  const seen = new Set<string>();
  for (const r of props.rows) {
    if (r.group && !seen.has(r.group)) {
      out.push({ type: 'header', group: r.group });
      seen.add(r.group);
    }
    out.push({ type: 'row', row: r });
  }
  return out;
});

/* Bar geometry */
function barStyle(bar: GanttBar) {
  const s = toDate(bar.start);
  const e = toDate(bar.end);
  if (!s || !e) return { display: 'none' };
  const startIdx = clampIndex(dayIndex(s));
  const endIdx = clampIndex(dayIndex(e));
  const left = startIdx * props.dayWidth;
  const width = Math.max(props.dayWidth * 0.5, (endIdx - startIdx + 1) * props.dayWidth - 4);
  return {
    left: `${left}px`,
    width: `${width}px`,
    background: bar.color,
  };
}

function progressStyle(bar: GanttBar) {
  if (bar.progress == null) return { display: 'none' };
  const w = Math.max(0, Math.min(1, bar.progress));
  return { width: `${w * 100}%` };
}

const todayLeft = computed(() => {
  const idx = dayIndex(today.value);
  if (idx < 0 || idx >= totalDays.value) return -1;
  return idx * props.dayWidth + props.dayWidth / 2;
});

/* Drag interaction */
interface DragState {
  bar: GanttBar;
  row: GanttRow;
  action: GanttBarChangeMeta['action'];
  startX: number;
  prev: { start: Date; end: Date };
}
const drag = ref<DragState | null>(null);
const dragPreview = ref<{ id: string; left: number; width: number } | null>(null);

function onBarPointerDown(e: PointerEvent, bar: GanttBar, row: GanttRow, action: GanttBarChangeMeta['action']) {
  if (!props.editable || bar.disabled) return;
  e.preventDefault();
  e.stopPropagation();
  const s = toDate(bar.start) ?? rangeStart.value;
  const en = toDate(bar.end) ?? rangeStart.value;
  drag.value = {
    bar,
    row,
    action,
    startX: e.clientX,
    prev: { start: s, end: en },
  };
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}

function onBarPointerMove(e: PointerEvent) {
  if (!drag.value) return;
  const dx = e.clientX - drag.value.startX;
  const dDays = Math.round(dx / props.dayWidth);
  const { bar, action, prev } = drag.value;
  let newStart = prev.start;
  let newEnd = prev.end;
  if (action === 'move') {
    newStart = addDays(prev.start, dDays);
    newEnd = addDays(prev.end, dDays);
  } else if (action === 'resize-start') {
    newStart = addDays(prev.start, dDays);
    if (newStart > prev.end) newStart = prev.end;
  } else if (action === 'resize-end') {
    newEnd = addDays(prev.end, dDays);
    if (newEnd < prev.start) newEnd = prev.start;
  }
  const startIdx = clampIndex(dayIndex(newStart));
  const endIdx = clampIndex(dayIndex(newEnd));
  dragPreview.value = {
    id: bar.id,
    left: startIdx * props.dayWidth,
    width: Math.max(props.dayWidth * 0.5, (endIdx - startIdx + 1) * props.dayWidth - 4),
  };
}

function onBarPointerEnd(e: PointerEvent) {
  if (!drag.value) return;
  const dx = e.clientX - drag.value.startX;
  const dDays = Math.round(dx / props.dayWidth);
  const { bar, row, action, prev } = drag.value;
  let nextStart = prev.start;
  let nextEnd = prev.end;
  if (action === 'move') {
    nextStart = addDays(prev.start, dDays);
    nextEnd = addDays(prev.end, dDays);
  } else if (action === 'resize-start') {
    nextStart = addDays(prev.start, dDays);
    if (nextStart > prev.end) nextStart = prev.end;
  } else if (action === 'resize-end') {
    nextEnd = addDays(prev.end, dDays);
    if (nextEnd < prev.start) nextEnd = prev.start;
  }
  if (dDays !== 0) {
    emit('bar-change', { bar, row, next: { start: nextStart, end: nextEnd }, meta: { action, prev } });
  }
  drag.value = null;
  dragPreview.value = null;
}

function onBarClick(bar: GanttBar, row: GanttRow) {
  if (drag.value) return;
  emit('bar-click', bar, row);
}

/* Dependencies — render as svg arrows in the timeline area. */
interface DepLine { x1: number; y1: number; x2: number; y2: number; key: string; }
const depLines = computed<DepLine[]>(() => {
  if (!props.dependencies?.length) return [];
  const lines: DepLine[] = [];
  // index bars by id with their pixel center coords
  const positions = new Map<string, { left: number; right: number; rowIdx: number }>();
  let visibleRowIdx = 0;
  for (const r of renderRows.value) {
    if (r.type === 'header') {
      visibleRowIdx++;
      continue;
    }
    const row = r.row!;
    for (const bar of row.bars) {
      const s = toDate(bar.start);
      const e = toDate(bar.end);
      if (!s || !e) continue;
      const startIdx = clampIndex(dayIndex(s));
      const endIdx = clampIndex(dayIndex(e));
      positions.set(bar.id, {
        left: startIdx * props.dayWidth,
        right: (endIdx + 1) * props.dayWidth,
        rowIdx: visibleRowIdx,
      });
    }
    visibleRowIdx++;
  }
  for (const dep of props.dependencies) {
    const from = positions.get(dep.from);
    const to = positions.get(dep.to);
    if (!from || !to) continue;
    const y1 = from.rowIdx * props.rowHeight + props.rowHeight / 2;
    const y2 = to.rowIdx * props.rowHeight + props.rowHeight / 2;
    lines.push({
      x1: from.right,
      y1,
      x2: to.left,
      y2,
      key: `${dep.from}->${dep.to}`,
    });
  }
  return lines;
});

const totalHeight = computed(() => renderRows.value.length * props.rowHeight);
</script>

<template>
  <div :class="['cf-gantt', `cf-gantt--${size}`]">
    <p v-if="caption" class="cf-gantt__caption">{{ caption }}</p>
    <div class="cf-gantt__frame" :style="{ '--gantt-row-h': `${rowHeight}px` } as Record<string, string>">
      <!-- Left: row labels -->
      <div class="cf-gantt__sidebar" :style="{ width: `${labelWidth}px`, flex: `0 0 ${labelWidth}px` }">
        <div class="cf-gantt__sidebar-head">名称</div>
        <div class="cf-gantt__sidebar-body">
          <template v-for="(r, i) in renderRows" :key="i">
            <div v-if="r.type === 'header'" class="cf-gantt__sidebar-group">{{ r.group }}</div>
            <button
              v-else
              type="button"
              class="cf-gantt__sidebar-row"
              @click="emit('row-click', r.row!)"
            >
              {{ r.row!.label }}
            </button>
          </template>
        </div>
      </div>

      <!-- Right: scrollable timeline -->
      <div
        class="cf-gantt__viewport"
        @pointermove="onBarPointerMove"
        @pointerup="onBarPointerEnd"
        @pointercancel="onBarPointerEnd"
      >
        <div class="cf-gantt__inner" :style="{ width: `${totalWidth}px` }">
          <!-- Axis header -->
          <div class="cf-gantt__axis">
            <div class="cf-gantt__axis-row">
              <div
                v-for="(t, i) in monthTicks"
                :key="i"
                class="cf-gantt__axis-cell cf-gantt__axis-cell--month"
                :style="{ width: `${t.days * dayWidth}px` }"
              >{{ t.label }}</div>
            </div>
            <div class="cf-gantt__axis-row">
              <div
                v-for="(c, i) in dayCells"
                :key="i"
                class="cf-gantt__axis-cell cf-gantt__axis-cell--day"
                :class="{ 'is-today': c.isToday, 'is-weekend': c.isWeekend }"
                :style="{ width: `${dayWidth}px` }"
              >{{ c.label }}</div>
            </div>
          </div>

          <!-- Body grid -->
          <div class="cf-gantt__body" :style="{ height: `${totalHeight}px` }">
            <!-- Vertical day grid lines + weekend tint -->
            <div class="cf-gantt__grid">
              <div
                v-for="(c, i) in dayCells"
                :key="i"
                class="cf-gantt__grid-col"
                :class="{ 'is-weekend': c.isWeekend }"
                :style="{ left: `${i * dayWidth}px`, width: `${dayWidth}px` }"
              />
            </div>

            <!-- Today vertical line -->
            <span
              v-if="showToday && todayLeft >= 0"
              class="cf-gantt__today"
              :style="{ left: `${todayLeft}px` }"
            />

            <!-- Rows + bars -->
            <template v-for="(r, i) in renderRows" :key="i">
              <div
                v-if="r.type === 'header'"
                class="cf-gantt__group-row"
                :style="{ top: `${i * rowHeight}px`, height: `${rowHeight}px` }"
              />
              <div
                v-else
                class="cf-gantt__row"
                :style="{ top: `${i * rowHeight}px`, height: `${rowHeight}px` }"
              >
                <div
                  v-for="bar in r.row!.bars"
                  :key="bar.id"
                  class="cf-gantt__bar"
                  :class="{ 'is-disabled': bar.disabled, 'is-editable': editable && !bar.disabled }"
                  :style="dragPreview && dragPreview.id === bar.id
                    ? { left: `${dragPreview.left}px`, width: `${dragPreview.width}px`, background: bar.color }
                    : barStyle(bar)"
                  @click="onBarClick(bar, r.row!)"
                  @pointerdown="(e: PointerEvent) => onBarPointerDown(e, bar, r.row!, 'move')"
                >
                  <span
                    v-if="editable && !bar.disabled"
                    class="cf-gantt__bar-handle cf-gantt__bar-handle--start"
                    @pointerdown.stop="(e: PointerEvent) => onBarPointerDown(e, bar, r.row!, 'resize-start')"
                  />
                  <span class="cf-gantt__bar-progress" :style="progressStyle(bar)" />
                  <span class="cf-gantt__bar-label">{{ bar.label }}</span>
                  <span
                    v-if="editable && !bar.disabled"
                    class="cf-gantt__bar-handle cf-gantt__bar-handle--end"
                    @pointerdown.stop="(e: PointerEvent) => onBarPointerDown(e, bar, r.row!, 'resize-end')"
                  />
                </div>
              </div>
            </template>

            <!-- Dependencies overlay (svg) -->
            <svg
              v-if="depLines.length"
              class="cf-gantt__deps"
              :width="totalWidth"
              :height="totalHeight"
              aria-hidden="true"
            >
              <defs>
                <marker id="cf-gantt-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0 0L10 5L0 10z" fill="currentColor" />
                </marker>
              </defs>
              <path
                v-for="line in depLines"
                :key="line.key"
                :d="`M${line.x1} ${line.y1} L${line.x1 + 12} ${line.y1} L${line.x1 + 12} ${line.y2} L${line.x2} ${line.y2}`"
                fill="none"
                stroke="currentColor"
                stroke-width="1.4"
                marker-end="url(#cf-gantt-arrow)"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
