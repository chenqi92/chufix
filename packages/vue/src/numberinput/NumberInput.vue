<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  type NumberInputProps,
  numberInputClass,
  clampNumber,
  inferPrecision,
} from './variants';

const props = withDefaults(defineProps<NumberInputProps>(), {
  modelValue: null,
  size: 'md',
  step: 1,
  hideSteppers: false,
});
const emit = defineEmits<{
  (e: 'update:modelValue', v: number | null): void;
}>();

const cls = computed(() => numberInputClass({ size: props.size! }));
const precision = computed(() => inferPrecision(props.step, props.precision));

const text = ref<string>(formatValue(props.modelValue ?? null));
watch(
  () => props.modelValue,
  (v) => {
    if (document.activeElement !== inputEl.value) {
      text.value = formatValue(v ?? null);
    }
  }
);

const inputEl = ref<HTMLInputElement | null>(null);

function formatValue(v: number | null): string {
  if (v == null || Number.isNaN(v)) return '';
  return v.toFixed(precision.value);
}

function commit(raw: string) {
  const trimmed = raw.trim();
  if (trimmed === '') {
    emit('update:modelValue', null);
    text.value = '';
    return;
  }
  const n = Number(trimmed);
  if (Number.isNaN(n)) {
    text.value = formatValue(props.modelValue ?? null);
    return;
  }
  const clamped = clampNumber(n, props.min, props.max);
  emit('update:modelValue', clamped);
  text.value = formatValue(clamped);
}

function step(direction: 1 | -1) {
  if (props.disabled) return;
  const base = props.modelValue == null ? 0 : props.modelValue;
  const next = clampNumber(
    parseFloat((base + direction * props.step!).toFixed(10)),
    props.min,
    props.max,
  );
  emit('update:modelValue', next);
  text.value = formatValue(next);
}

function onInput(e: Event) {
  text.value = (e.target as HTMLInputElement).value;
}
function onBlur() {
  commit(text.value);
}
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    step(1);
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    step(-1);
  } else if (e.key === 'Enter') {
    commit(text.value);
  }
}

const canIncrement = computed(
  () =>
    !props.disabled &&
    (typeof props.max !== 'number' ||
      (props.modelValue ?? 0) + (props.step ?? 1) <= props.max + 1e-9)
);
const canDecrement = computed(
  () =>
    !props.disabled &&
    (typeof props.min !== 'number' ||
      (props.modelValue ?? 0) - (props.step ?? 1) >= props.min - 1e-9)
);
</script>

<template>
  <div :class="cls" :data-disabled="disabled || undefined">
    <input
      ref="inputEl"
      class="cf-number__native"
      type="text"
      inputmode="decimal"
      :value="text"
      :placeholder="placeholder"
      :disabled="disabled || undefined"
      @input="onInput"
      @blur="onBlur"
      @keydown="onKeyDown"
    />
    <div v-if="!hideSteppers" class="cf-number__steppers">
      <button
        type="button"
        class="cf-number__step"
        tabindex="-1"
        :disabled="!canIncrement"
        aria-label="增加"
        @click="step(1)"
      >▲</button>
      <button
        type="button"
        class="cf-number__step"
        tabindex="-1"
        :disabled="!canDecrement"
        aria-label="减少"
        @click="step(-1)"
      >▼</button>
    </div>
  </div>
</template>
