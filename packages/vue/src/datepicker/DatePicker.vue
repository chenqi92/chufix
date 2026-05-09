<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import {
  addMonths,
  addYears,
  buildMonthGrid,
  clampToBounds,
  formatDate,
  formatISO,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  MONTH_LABELS_ZH,
  startOfDay,
  toDate,
  WEEK_LABELS_ZH_MON_FIRST,
  WEEK_LABELS_ZH_SUN_FIRST,
} from './date';
import {
  datePickerClass,
  type DatePickerProps,
  type DatePickerView,
} from './variants';

const props = withDefaults(defineProps<DatePickerProps>(), {
  modelValue: null,
  format: 'YYYY-MM-DD',
  placeholder: '选择日期',
  variant: 'outline',
  size: 'md',
  disabled: false,
  clearable: false,
  error: false,
  weekStartsOn: 1,
  view: 'day',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void;
  (e: 'change', value: Date | null): void;
}>();

const open = ref(false);
const view = ref<DatePickerView>(props.view);
const cursor = ref<Date>(toDate(props.modelValue) ?? new Date());
const rootRef = ref<HTMLDivElement | null>(null);

watch(
  () => props.modelValue,
  (v) => {
    const d = toDate(v);
    if (d) cursor.value = d;
  },
  { immediate: true },
);

const selectedDate = computed(() => toDate(props.modelValue));
const minDate = computed(() => toDate(props.minDate));
const maxDate = computed(() => toDate(props.maxDate));
const weekLabels = computed(() =>
  props.weekStartsOn === 0 ? WEEK_LABELS_ZH_SUN_FIRST : WEEK_LABELS_ZH_MON_FIRST,
);
const monthGrid = computed(() => buildMonthGrid(cursor.value, props.weekStartsOn));
const yearGrid = computed(() => {
  const base = cursor.value.getFullYear();
  const start = base - (base % 12);
  return Array.from({ length: 12 }, (_, i) => start + i);
});

const cls = computed(() =>
  datePickerClass({
    variant: props.variant,
    size: props.size,
    open: open.value,
    disabled: props.disabled,
    error: props.error,
  }),
);

const displayValue = computed(() =>
  selectedDate.value ? formatDate(selectedDate.value, props.format) : '',
);

function toggle() {
  if (props.disabled) return;
  open.value = !open.value;
  if (open.value) view.value = props.view;
}

function close() {
  open.value = false;
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
  const clamped = clampToBounds(startOfDay(d), minDate.value, maxDate.value);
  cursor.value = clamped;
  emit('update:modelValue', formatISO(clamped));
  emit('change', clamped);
  close();
}

function pickMonth(m: number) {
  const next = new Date(cursor.value.getFullYear(), m, 1);
  cursor.value = next;
  view.value = 'day';
}

function pickYear(y: number) {
  const next = new Date(y, cursor.value.getMonth(), 1);
  cursor.value = next;
  view.value = 'month';
}

function clear(e: MouseEvent) {
  e.stopPropagation();
  emit('update:modelValue', null);
  emit('change', null);
}

function prev() {
  if (view.value === 'day') cursor.value = addMonths(cursor.value, -1);
  else if (view.value === 'month') cursor.value = addYears(cursor.value, -1);
  else cursor.value = addYears(cursor.value, -12);
}
function next() {
  if (view.value === 'day') cursor.value = addMonths(cursor.value, 1);
  else if (view.value === 'month') cursor.value = addYears(cursor.value, 1);
  else cursor.value = addYears(cursor.value, 12);
}
function showMonthView() { view.value = 'month'; }
function showYearView() { view.value = 'year'; }

function selectToday() {
  const today = startOfDay(new Date());
  if (isDayDisabled(today)) return;
  pickDay(today);
}
</script>

<template>
  <div ref="rootRef" :class="cls">
    <button
      type="button"
      class="cf-date__trigger"
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
        <template v-if="displayValue">{{ displayValue }}</template>
        <span v-else class="cf-date__placeholder">{{ placeholder }}</span>
      </span>
      <span
        v-if="clearable && selectedDate && !disabled"
        class="cf-date__clear"
        role="button"
        tabindex="-1"
        aria-label="清除"
        @click="clear"
      >×</span>
    </button>

    <div v-if="open" class="cf-date__panel" role="dialog">
      <header class="cf-date__header">
        <button type="button" class="cf-date__nav" aria-label="上一页" @click="prev">‹</button>
        <div class="cf-date__title">
          <button
            v-if="view === 'day'"
            type="button"
            class="cf-date__title-btn"
            @click="showMonthView"
          >{{ MONTH_LABELS_ZH[cursor.getMonth()] }}</button>
          <button
            type="button"
            class="cf-date__title-btn"
            @click="showYearView"
          >{{ cursor.getFullYear() }}</button>
        </div>
        <button type="button" class="cf-date__nav" aria-label="下一页" @click="next">›</button>
      </header>

      <div v-if="view === 'day'" class="cf-date__body">
        <div class="cf-date__weekdays">
          <span v-for="w in weekLabels" :key="w">{{ w }}</span>
        </div>
        <div class="cf-date__grid">
          <button
            v-for="cell in monthGrid"
            :key="cell.date.toISOString()"
            type="button"
            class="cf-date__day"
            :class="{
              'is-out': !cell.inMonth,
              'is-today': cell.isToday,
              'is-selected': isSameDay(cell.date, selectedDate),
              'is-disabled': isDayDisabled(cell.date),
            }"
            :disabled="isDayDisabled(cell.date)"
            @click="pickDay(cell.date)"
          >
            {{ cell.date.getDate() }}
          </button>
        </div>
      </div>

      <div v-else-if="view === 'month'" class="cf-date__months">
        <button
          v-for="(label, i) in MONTH_LABELS_ZH"
          :key="i"
          type="button"
          class="cf-date__cell"
          :class="{
            'is-selected':
              selectedDate &&
              cursor.getFullYear() === selectedDate.getFullYear() &&
              i === selectedDate.getMonth(),
          }"
          @click="pickMonth(i)"
        >{{ label }}</button>
      </div>

      <div v-else class="cf-date__years">
        <button
          v-for="y in yearGrid"
          :key="y"
          type="button"
          class="cf-date__cell"
          :class="{
            'is-selected':
              selectedDate && y === selectedDate.getFullYear(),
          }"
          @click="pickYear(y)"
        >{{ y }}</button>
      </div>

      <footer class="cf-date__footer">
        <button type="button" class="cf-date__action" @click="selectToday">今天</button>
        <button type="button" class="cf-date__action" @click="close">关闭</button>
      </footer>
    </div>
  </div>
</template>
