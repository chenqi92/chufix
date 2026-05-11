<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  formatTime,
  parseTime,
  range,
  timePickerClass,
  type TimePickerProps,
} from './variants';

const props = withDefaults(defineProps<TimePickerProps>(), {
  placeholder: '请选择时间',
  size: 'md',
  disabled: false,
  clearable: false,
  showSeconds: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | null];
  change: [value: string | null];
}>();

const isControlled = computed(() => props.modelValue !== undefined);
const internal = ref<string | null>(props.defaultValue ?? null);
const value = computed<string | null>(() =>
  isControlled.value ? (props.modelValue as string | null) : internal.value,
);

const open = ref(false);
const wrapper = ref<HTMLDivElement | null>(null);

const parts = computed(() => parseTime(value.value) ?? { h: 0, m: 0, sec: 0 });

const displayText = computed(() => {
  if (!value.value) return '';
  const p = parseTime(value.value);
  return p ? formatTime(p, props.showSeconds) : value.value;
});

function pick(part: 'h' | 'm' | 'sec', n: number) {
  const next = { ...parts.value, [part]: n };
  const text = formatTime(next, props.showSeconds);
  if (!isControlled.value) internal.value = text;
  emit('update:modelValue', text);
  emit('change', text);
}

function clear() {
  if (!isControlled.value) internal.value = null;
  emit('update:modelValue', null);
  emit('change', null);
}

function toggle() {
  if (props.disabled) return;
  open.value = !open.value;
}

function onFocusOut(evt: FocusEvent) {
  if (!wrapper.value) return;
  const next = evt.relatedTarget as Node | null;
  if (next && wrapper.value.contains(next)) return;
  open.value = false;
}

watch(
  () => props.modelValue,
  (v) => {
    if (isControlled.value && v !== undefined) internal.value = v;
  },
);

const cls = computed(() =>
  timePickerClass({
    size: props.size,
    disabled: props.disabled,
    open: open.value,
    className: props.className,
  }),
);

const hours = range(24);
const minutes = range(60);
const seconds = range(60);
</script>

<template>
  <div ref="wrapper" :class="cls" tabindex="-1" @focusout="onFocusOut">
    <div class="cf-timepicker__trigger">
      <button
        type="button"
        class="cf-timepicker__field"
        :disabled="disabled"
        @click="toggle"
      >
        <span v-if="displayText" class="cf-timepicker__value">{{ displayText }}</span>
        <span v-else class="cf-timepicker__placeholder">{{ placeholder }}</span>
      </button>
      <button
        v-if="clearable && value && !disabled"
        type="button"
        class="cf-timepicker__clear"
        aria-label="清除"
        @click="clear"
      >×</button>
      <button
        type="button"
        class="cf-timepicker__caret"
        :disabled="disabled"
        aria-label="展开时间选择"
        @click="toggle"
      >▾</button>
    </div>

    <div v-if="open" class="cf-timepicker__panel" role="dialog">
      <div class="cf-timepicker__columns">
        <div class="cf-timepicker__col">
          <button
            v-for="h in hours"
            :key="`h-${h}`"
            type="button"
            :class="['cf-timepicker__cell', parts.h === h && 'is-selected']"
            @click="pick('h', h)"
          >{{ String(h).padStart(2, '0') }}</button>
        </div>
        <div class="cf-timepicker__col">
          <button
            v-for="m in minutes"
            :key="`m-${m}`"
            type="button"
            :class="['cf-timepicker__cell', parts.m === m && 'is-selected']"
            @click="pick('m', m)"
          >{{ String(m).padStart(2, '0') }}</button>
        </div>
        <div v-if="showSeconds" class="cf-timepicker__col">
          <button
            v-for="s in seconds"
            :key="`s-${s}`"
            type="button"
            :class="['cf-timepicker__cell', parts.sec === s && 'is-selected']"
            @click="pick('sec', s)"
          >{{ String(s).padStart(2, '0') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
