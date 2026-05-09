<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import CfTimePicker from '../timepicker/TimePicker.vue';
import {
  timeRangePickerClass,
  type TimeRangePickerProps,
  type TimeRangeValue,
} from './variants';

const props = withDefaults(defineProps<TimeRangePickerProps>(), {
  size: 'md',
  disabled: false,
  clearable: false,
  showSeconds: false,
  separator: '–',
});

const emit = defineEmits<{
  'update:modelValue': [v: TimeRangeValue];
  change: [v: TimeRangeValue];
}>();

const isControlled = computed(() => props.modelValue !== undefined);
const internal = ref<TimeRangeValue>(props.defaultValue ?? null);
const value = computed<TimeRangeValue>(() =>
  isControlled.value ? (props.modelValue as TimeRangeValue) : internal.value,
);

const start = computed(() => value.value?.[0] ?? null);
const end = computed(() => value.value?.[1] ?? null);

function update(s: string | null, e: string | null) {
  const next: TimeRangeValue = s == null && e == null ? null : [s, e];
  if (!isControlled.value) internal.value = next;
  emit('update:modelValue', next);
  emit('change', next);
}

function setStart(s: string | null) {
  update(s, end.value);
}

function setEnd(e: string | null) {
  update(start.value, e);
}

watch(
  () => props.modelValue,
  (v) => {
    if (isControlled.value && v !== undefined) internal.value = v;
  },
);

const cls = computed(() =>
  timeRangePickerClass({
    size: props.size,
    disabled: props.disabled,
    className: props.className,
  }),
);

const placeholders = computed(() => props.placeholder ?? ['开始时间', '结束时间']);
</script>

<template>
  <div :class="cls">
    <CfTimePicker
      :model-value="start"
      :placeholder="placeholders[0]"
      :size="size"
      :disabled="disabled"
      :clearable="clearable"
      :show-seconds="showSeconds"
      @update:model-value="setStart"
    />
    <span class="cf-timerangepicker__sep">{{ separator }}</span>
    <CfTimePicker
      :model-value="end"
      :placeholder="placeholders[1]"
      :size="size"
      :disabled="disabled"
      :clearable="clearable"
      :show-seconds="showSeconds"
      @update:model-value="setEnd"
    />
  </div>
</template>
