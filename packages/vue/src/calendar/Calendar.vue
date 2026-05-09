<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  addMonths,
  buildMonthGrid,
  calendarClass,
  isOutOfRange,
  isSameDay,
  startOfMonth,
  weekdayLabels,
  type CalendarProps,
} from './variants';

const props = withDefaults(defineProps<CalendarProps>(), {
  size: 'md',
  weekStartsOn: 1,
  showWeekNumbers: false,
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: Date | null];
  'update:month': [month: Date];
  change: [value: Date | null];
}>();

const isControlled = computed(() => props.modelValue !== undefined);
const internal = ref<Date | null>(props.defaultValue ?? null);
const current = computed(() => (isControlled.value ? props.modelValue ?? null : internal.value));

const monthControlled = computed(() => props.month !== undefined);
const internalMonth = ref(startOfMonth(props.defaultMonth ?? props.modelValue ?? new Date()));
const viewMonth = computed(() =>
  monthControlled.value ? startOfMonth(props.month as Date) : internalMonth.value,
);

watch(
  () => props.modelValue,
  (v) => {
    if (v && !monthControlled.value) internalMonth.value = startOfMonth(v);
  },
);

const grid = computed(() => buildMonthGrid(viewMonth.value, props.weekStartsOn));
const labels = computed(() => weekdayLabels(props.weekStartsOn));

const cls = computed(() =>
  calendarClass({
    size: props.size,
    showWeekNumbers: props.showWeekNumbers,
    disabled: props.disabled,
    className: props.className,
  }),
);

const monthLabel = computed(
  () => `${viewMonth.value.getFullYear()} 年 ${viewMonth.value.getMonth() + 1} 月`,
);

function shift(n: number) {
  const next = addMonths(viewMonth.value, n);
  if (!monthControlled.value) internalMonth.value = next;
  emit('update:month', next);
}

function pick(d: Date) {
  if (props.disabled) return;
  if (isOutOfRange(d, props.min, props.max)) return;
  if (!isControlled.value) internal.value = d;
  emit('update:modelValue', d);
  emit('change', d);
}
</script>

<template>
  <div :class="cls">
    <div class="cf-cal__header">
      <button
        type="button"
        class="cf-cal__nav"
        :disabled="disabled"
        aria-label="上个月"
        @click="shift(-1)"
      >‹</button>
      <span class="cf-cal__title">{{ monthLabel }}</span>
      <button
        type="button"
        class="cf-cal__nav"
        :disabled="disabled"
        aria-label="下个月"
        @click="shift(1)"
      >›</button>
    </div>
    <div class="cf-cal__grid">
      <span v-if="showWeekNumbers" class="cf-cal__head cf-cal__head--week" aria-hidden>#</span>
      <span
        v-for="label in labels"
        :key="label"
        class="cf-cal__head"
      >{{ label }}</span>
      <template v-for="(cell, i) in grid" :key="cell.iso">
        <span
          v-if="showWeekNumbers && i % 7 === 0"
          class="cf-cal__week"
        >{{ cell.weekNumber }}</span>
        <button
          type="button"
          :class="[
            'cf-cal__day',
            !cell.inMonth && 'is-outside',
            cell.isToday && 'is-today',
            cell.isWeekend && 'is-weekend',
            isSameDay(cell.date, current) && 'is-selected',
            isOutOfRange(cell.date, min, max) && 'is-disabled',
          ]"
          :disabled="disabled || isOutOfRange(cell.date, min, max)"
          :aria-pressed="isSameDay(cell.date, current)"
          @click="pick(cell.date)"
        >{{ cell.date.getDate() }}</button>
      </template>
    </div>
  </div>
</template>
