<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import {
  addMonths,
  buildMonthGrid,
  formatDate,
  formatISO,
  isAfter,
  isBefore,
  isInRange,
  isSameDay,
  MONTH_LABELS_ZH,
  startOfDay,
  startOfMonth,
  toDate,
  WEEK_LABELS_ZH_MON_FIRST,
  WEEK_LABELS_ZH_SUN_FIRST,
} from '../datepicker/date';
import {
  dateRangeClass,
  type DateRangePickerProps,
  type DateRangeValue,
} from './variants';

const props = withDefaults(defineProps<DateRangePickerProps>(), {
  modelValue: () => [null, null] as DateRangeValue,
  format: 'YYYY-MM-DD',
  placeholder: () => ['开始日期', '结束日期'] as [string, string],
  separator: '至',
  variant: 'outline',
  size: 'md',
  disabled: false,
  clearable: false,
  error: false,
  weekStartsOn: 1,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: DateRangeValue): void;
  (e: 'change', start: Date | null, end: Date | null): void;
}>();

const open = ref(false);
const cursor = ref<Date>(toDate(props.modelValue?.[0]) ?? startOfMonth(new Date()));
const draftStart = ref<Date | null>(null);
const hoverDate = ref<Date | null>(null);
const rootRef = ref<HTMLDivElement | null>(null);

const startDate = computed(() => toDate(props.modelValue?.[0] ?? null));
const endDate = computed(() => toDate(props.modelValue?.[1] ?? null));
const minDate = computed(() => toDate(props.minDate));
const maxDate = computed(() => toDate(props.maxDate));
const weekLabels = computed(() =>
  props.weekStartsOn === 0 ? WEEK_LABELS_ZH_SUN_FIRST : WEEK_LABELS_ZH_MON_FIRST,
);

const leftMonth = computed(() => cursor.value);
const rightMonth = computed(() => addMonths(cursor.value, 1));
const leftGrid = computed(() => buildMonthGrid(leftMonth.value, props.weekStartsOn));
const rightGrid = computed(() => buildMonthGrid(rightMonth.value, props.weekStartsOn));

const previewRange = computed<{ start: Date | null; end: Date | null }>(() => {
  if (draftStart.value && hoverDate.value) {
    const a = draftStart.value, b = hoverDate.value;
    return isBefore(a, b) ? { start: a, end: b } : { start: b, end: a };
  }
  if (draftStart.value && !hoverDate.value) {
    return { start: draftStart.value, end: null };
  }
  return { start: startDate.value, end: endDate.value };
});

const cls = computed(() =>
  dateRangeClass({
    variant: props.variant,
    size: props.size,
    open: open.value,
    disabled: props.disabled,
    error: props.error,
  }),
);

const startDisplay = computed(() =>
  startDate.value ? formatDate(startDate.value, props.format) : '',
);
const endDisplay = computed(() =>
  endDate.value ? formatDate(endDate.value, props.format) : '',
);

watch(
  () => props.modelValue,
  (v) => {
    const start = toDate(v?.[0] ?? null);
    if (start) cursor.value = startOfMonth(start);
  },
  { immediate: true },
);

function toggle() {
  if (props.disabled) return;
  open.value = !open.value;
  if (open.value) {
    draftStart.value = null;
    hoverDate.value = null;
  }
}

function close() {
  open.value = false;
  draftStart.value = null;
  hoverDate.value = null;
}

function onDocClick(e: MouseEvent) {
  if (!rootRef.value || rootRef.value.contains(e.target as Node)) return;
  close();
}

watch(open, (v) => {
  if (v) document.addEventListener('mousedown', onDocClick);
  else document.removeEventListener('mousedown', onDocClick);
});

onBeforeUnmount(() => document.removeEventListener('mousedown', onDocClick));

function isDayDisabled(d: Date): boolean {
  if (minDate.value && isBefore(d, minDate.value)) return true;
  if (maxDate.value && isAfter(d, maxDate.value)) return true;
  if (props.disabledDate?.(d)) return true;
  return false;
}

function pickDay(d: Date) {
  if (isDayDisabled(d)) return;
  if (!draftStart.value) {
    draftStart.value = startOfDay(d);
    hoverDate.value = null;
    return;
  }
  const a = draftStart.value;
  const b = startOfDay(d);
  const start = isBefore(a, b) ? a : b;
  const end = isBefore(a, b) ? b : a;
  emit('update:modelValue', [formatISO(start), formatISO(end)]);
  emit('change', start, end);
  draftStart.value = null;
  hoverDate.value = null;
  open.value = false;
}

function onDayHover(d: Date) {
  if (!draftStart.value) return;
  hoverDate.value = startOfDay(d);
}

function clear(e: MouseEvent) {
  e.stopPropagation();
  emit('update:modelValue', [null, null]);
  emit('change', null, null);
}

function shiftMonths(n: number) {
  cursor.value = addMonths(cursor.value, n);
}

function applyPreset(daysBack: number) {
  const today = startOfDay(new Date());
  const start = new Date(today);
  start.setDate(start.getDate() - daysBack + 1);
  emit('update:modelValue', [formatISO(start), formatISO(today)]);
  emit('change', start, today);
  cursor.value = startOfMonth(start);
  open.value = false;
}

function isInPreview(d: Date) {
  const { start, end } = previewRange.value;
  return start && end ? isInRange(d, start, end) : false;
}

function isPreviewStart(d: Date) {
  return previewRange.value.start
    ? isSameDay(d, previewRange.value.start)
    : false;
}
function isPreviewEnd(d: Date) {
  return previewRange.value.end
    ? isSameDay(d, previewRange.value.end)
    : false;
}
</script>

<template>
  <div ref="rootRef" :class="cls">
    <button
      type="button"
      class="cf-date__trigger cf-date__trigger--range"
      :disabled="disabled"
      :aria-haspopup="'dialog'"
      :aria-expanded="open"
      @click="toggle"
    >
      <svg class="cf-date__icon" viewBox="0 0 16 16" aria-hidden="true">
        <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" stroke="currentColor" stroke-width="1.2" fill="none"/>
        <path d="M2.5 6.5h11M5 2v3M11 2v3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
      </svg>
      <span class="cf-date__value">
        <template v-if="startDisplay">{{ startDisplay }}</template>
        <span v-else class="cf-date__placeholder">{{ placeholder[0] }}</span>
      </span>
      <span class="cf-date__separator">{{ separator }}</span>
      <span class="cf-date__value">
        <template v-if="endDisplay">{{ endDisplay }}</template>
        <span v-else class="cf-date__placeholder">{{ placeholder[1] }}</span>
      </span>
      <span
        v-if="clearable && (startDate || endDate) && !disabled"
        class="cf-date__clear"
        role="button"
        tabindex="-1"
        aria-label="清除"
        @click="clear"
      >×</span>
    </button>

    <div v-if="open" class="cf-date__panel cf-date__panel--range" role="dialog">
      <div class="cf-date__range-grids">
        <div class="cf-date__range-pane">
          <header class="cf-date__header">
            <button type="button" class="cf-date__nav" aria-label="上个月" @click="shiftMonths(-1)">‹</button>
            <div class="cf-date__title">
              <span class="cf-date__title-btn">{{ MONTH_LABELS_ZH[leftMonth.getMonth()] }}</span>
              <span class="cf-date__title-btn">{{ leftMonth.getFullYear() }}</span>
            </div>
            <span class="cf-date__nav" aria-hidden="true" />
          </header>
          <div class="cf-date__weekdays">
            <span v-for="w in weekLabels" :key="`l-${w}`">{{ w }}</span>
          </div>
          <div class="cf-date__grid">
            <button
              v-for="cell in leftGrid"
              :key="`l-${cell.date.toISOString()}`"
              type="button"
              class="cf-date__day"
              :class="{
                'is-out': !cell.inMonth,
                'is-today': cell.isToday,
                'is-selected': isPreviewStart(cell.date) || isPreviewEnd(cell.date),
                'is-in-range': isInPreview(cell.date),
                'is-range-start': isPreviewStart(cell.date),
                'is-range-end': isPreviewEnd(cell.date),
                'is-disabled': isDayDisabled(cell.date),
              }"
              :disabled="isDayDisabled(cell.date)"
              @click="pickDay(cell.date)"
              @mouseenter="onDayHover(cell.date)"
            >{{ cell.date.getDate() }}</button>
          </div>
        </div>

        <div class="cf-date__range-pane">
          <header class="cf-date__header">
            <span class="cf-date__nav" aria-hidden="true" />
            <div class="cf-date__title">
              <span class="cf-date__title-btn">{{ MONTH_LABELS_ZH[rightMonth.getMonth()] }}</span>
              <span class="cf-date__title-btn">{{ rightMonth.getFullYear() }}</span>
            </div>
            <button type="button" class="cf-date__nav" aria-label="下个月" @click="shiftMonths(1)">›</button>
          </header>
          <div class="cf-date__weekdays">
            <span v-for="w in weekLabels" :key="`r-${w}`">{{ w }}</span>
          </div>
          <div class="cf-date__grid">
            <button
              v-for="cell in rightGrid"
              :key="`r-${cell.date.toISOString()}`"
              type="button"
              class="cf-date__day"
              :class="{
                'is-out': !cell.inMonth,
                'is-today': cell.isToday,
                'is-selected': isPreviewStart(cell.date) || isPreviewEnd(cell.date),
                'is-in-range': isInPreview(cell.date),
                'is-range-start': isPreviewStart(cell.date),
                'is-range-end': isPreviewEnd(cell.date),
                'is-disabled': isDayDisabled(cell.date),
              }"
              :disabled="isDayDisabled(cell.date)"
              @click="pickDay(cell.date)"
              @mouseenter="onDayHover(cell.date)"
            >{{ cell.date.getDate() }}</button>
          </div>
        </div>
      </div>

      <footer class="cf-date__footer">
        <div class="cf-date__presets">
          <button type="button" class="cf-date__action" @click="applyPreset(7)">近 7 天</button>
          <button type="button" class="cf-date__action" @click="applyPreset(30)">近 30 天</button>
          <button type="button" class="cf-date__action" @click="applyPreset(90)">近 90 天</button>
        </div>
        <button type="button" class="cf-date__action" @click="close">关闭</button>
      </footer>
    </div>
  </div>
</template>
