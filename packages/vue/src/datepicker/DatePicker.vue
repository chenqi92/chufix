<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import {
  addDays,
  addMonths,
  addYears,
  buildMonthGrid,
  clampToBounds,
  endOfMonth,
  formatDate,
  formatISO,
  getISOWeek,
  isAfter,
  isBefore,
  isSameDay,
  MONTH_LABELS_ZH,
  startOfDay,
  startOfMonth,
  toDate,
  WEEK_LABELS_ZH_MON_FIRST,
  WEEK_LABELS_ZH_SUN_FIRST,
} from './date';
import {
  datePickerClass,
  type DatePickerPreset,
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
  showWeekNumber: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void;
  (e: 'change', value: Date | null): void;
}>();

const open = ref(false);
const view = ref<DatePickerView>(props.view);
const cursor = ref<Date>(toDate(props.modelValue) ?? new Date());
const focusDate = ref<Date>(toDate(props.modelValue) ?? new Date());
const rootRef = ref<HTMLDivElement | null>(null);

watch(
  () => props.modelValue,
  (v) => {
    const d = toDate(v);
    if (d) {
      cursor.value = d;
      focusDate.value = d;
    }
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

/* week-numbered rows: chunk monthGrid into 6 rows of 7 days. */
const weekRows = computed(() => {
  const rows: Array<{ weekNumber: number; days: typeof monthGrid.value }> = [];
  const cells = monthGrid.value;
  for (let i = 0; i < 6; i++) {
    const slice = cells.slice(i * 7, i * 7 + 7);
    rows.push({ weekNumber: getISOWeek(slice[0].date), days: slice });
  }
  return rows;
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
  if (open.value) {
    view.value = props.view;
    focusDate.value = selectedDate.value ?? new Date();
  }
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
  focusDate.value = clamped;
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

function applyPreset(p: DatePickerPreset) {
  const raw = typeof p.value === 'function' ? p.value() : p.value;
  const d = toDate(raw as never);
  if (!d || isDayDisabled(d)) return;
  pickDay(d);
}

/* keyboard nav inside panel */
function moveFocus(delta: number) {
  const next = addDays(focusDate.value, delta);
  focusDate.value = next;
  cursor.value = next;
}

function onPanelKeydown(e: KeyboardEvent) {
  if (view.value !== 'day') return;
  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      moveFocus(-1);
      break;
    case 'ArrowRight':
      e.preventDefault();
      moveFocus(1);
      break;
    case 'ArrowUp':
      e.preventDefault();
      moveFocus(-7);
      break;
    case 'ArrowDown':
      e.preventDefault();
      moveFocus(7);
      break;
    case 'PageUp':
      e.preventDefault();
      cursor.value = addMonths(cursor.value, -1);
      focusDate.value = cursor.value;
      break;
    case 'PageDown':
      e.preventDefault();
      cursor.value = addMonths(cursor.value, 1);
      focusDate.value = cursor.value;
      break;
    case 'Home':
      e.preventDefault();
      focusDate.value = startOfMonth(cursor.value);
      break;
    case 'End':
      e.preventDefault();
      focusDate.value = endOfMonth(cursor.value);
      break;
    case 'Enter':
      e.preventDefault();
      pickDay(focusDate.value);
      break;
    case 'Escape':
      e.preventDefault();
      close();
      break;
  }
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

    <div
      v-if="open"
      :class="['cf-date__panel', presets && presets.length ? 'cf-date__panel--with-presets' : '']"
      role="dialog"
      tabindex="-1"
      @keydown="onPanelKeydown"
    >
      <aside v-if="presets && presets.length" class="cf-date__presets">
        <button
          v-for="(p, i) in presets"
          :key="i"
          type="button"
          class="cf-date__preset-btn"
          @click="applyPreset(p)"
        >{{ p.label }}</button>
      </aside>

      <div class="cf-date__main">
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
          <div :class="['cf-date__weekdays', showWeekNumber && 'with-week-num']">
            <span v-if="showWeekNumber" class="cf-date__week-col-head">w</span>
            <span v-for="w in weekLabels" :key="w">{{ w }}</span>
          </div>
          <template v-if="showWeekNumber">
            <div v-for="row in weekRows" :key="row.weekNumber" class="cf-date__week-row">
              <span class="cf-date__week-num">{{ row.weekNumber }}</span>
              <button
                v-for="cell in row.days"
                :key="cell.date.toISOString()"
                type="button"
                class="cf-date__day"
                :class="{
                  'is-out': !cell.inMonth,
                  'is-today': cell.isToday,
                  'is-selected': isSameDay(cell.date, selectedDate),
                  'is-focused': isSameDay(cell.date, focusDate),
                  'is-disabled': isDayDisabled(cell.date),
                }"
                :disabled="isDayDisabled(cell.date)"
                @click="pickDay(cell.date)"
              >
                {{ cell.date.getDate() }}
              </button>
            </div>
          </template>
          <div v-else class="cf-date__grid">
            <button
              v-for="cell in monthGrid"
              :key="cell.date.toISOString()"
              type="button"
              class="cf-date__day"
              :class="{
                'is-out': !cell.inMonth,
                'is-today': cell.isToday,
                'is-selected': isSameDay(cell.date, selectedDate),
                'is-focused': isSameDay(cell.date, focusDate),
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
  </div>
</template>
