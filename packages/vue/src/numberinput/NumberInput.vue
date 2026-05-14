<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  type NumberInputChangeReason,
  type NumberInputInvalidMeta,
  type NumberInputProps,
  type NumberInputStepMeta,
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
  (e: 'input', raw: string, event: Event): void;
  (e: 'change', v: number | null, meta: { raw: string; reason: NumberInputChangeReason }): void;
  (e: 'step', v: number, meta: NumberInputStepMeta): void;
  (e: 'invalid', meta: NumberInputInvalidMeta): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'blur', event: FocusEvent): void;
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

function commit(raw: string, reason: NumberInputChangeReason = 'commit') {
  const trimmed = raw.trim();
  if (trimmed === '') {
    emit('update:modelValue', null);
    emit('change', null, { raw, reason });
    text.value = '';
    return;
  }
  const n = Number(trimmed);
  if (Number.isNaN(n)) {
    emit('invalid', { raw, reason: 'nan' });
    text.value = formatValue(props.modelValue ?? null);
    return;
  }
  const clamped = clampNumber(n, props.min, props.max);
  emit('update:modelValue', clamped);
  emit('change', clamped, { raw, reason });
  text.value = formatValue(clamped);
}

function setCommittedValue(next: number, raw: string, reason: NumberInputChangeReason) {
  const clamped = clampNumber(next, props.min, props.max);
  emit('update:modelValue', clamped);
  emit('change', clamped, { raw, reason });
  text.value = formatValue(clamped);
  return clamped;
}

function step(direction: 1 | -1) {
  if (props.disabled) return;
  const base = props.modelValue == null ? 0 : props.modelValue;
  const next = setCommittedValue(
    parseFloat((base + direction * props.step!).toFixed(10)),
    String(base),
    'step',
  );
  emit('step', next, { direction });
}

function onInput(e: Event) {
  text.value = (e.target as HTMLInputElement).value;
  emit('input', text.value, e);
}
function onBlur(e: FocusEvent) {
  commit(text.value, 'blur');
  emit('blur', e);
}
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    step(1);
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    step(-1);
  } else if (e.key === 'Enter') {
    commit(text.value, 'enter');
  } else if (e.key === 'Home' && typeof props.min === 'number') {
    e.preventDefault();
    setCommittedValue(props.min, String(props.min), 'home');
  } else if (e.key === 'End' && typeof props.max === 'number') {
    e.preventDefault();
    setCommittedValue(props.max, String(props.max), 'end');
  } else if (e.key === 'PageUp') {
    e.preventDefault();
    const base = props.modelValue == null ? 0 : props.modelValue;
    setCommittedValue(base + (props.step ?? 1) * 10, String(base), 'step');
  } else if (e.key === 'PageDown') {
    e.preventDefault();
    const base = props.modelValue == null ? 0 : props.modelValue;
    setCommittedValue(base - (props.step ?? 1) * 10, String(base), 'step');
  }
}

const canIncrement = computed(
  () =>
    !props.disabled &&
    (typeof props.max !== 'number' ||
      (props.modelValue ?? 0) < props.max - 1e-9)
);
const canDecrement = computed(
  () =>
    !props.disabled &&
    (typeof props.min !== 'number' ||
      (props.modelValue ?? 0) > props.min + 1e-9)
);
</script>

<template>
  <div :class="cls" :data-disabled="disabled || undefined">
    <span v-if="$slots.prefix || prefix" class="cf-number__affix cf-number__affix--prefix">
      <slot name="prefix">{{ prefix }}</slot>
    </span>
    <input
      ref="inputEl"
      :id="id"
      class="cf-number__native"
      type="text"
      role="spinbutton"
      inputmode="decimal"
      :value="text"
      :placeholder="placeholder"
      :disabled="disabled || undefined"
      :name="name"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuenow="modelValue ?? undefined"
      @input="onInput"
      @blur="onBlur"
      @focus="(event) => emit('focus', event)"
      @keydown="onKeyDown"
    />
    <span v-if="$slots.suffix || suffix" class="cf-number__affix cf-number__affix--suffix">
      <slot name="suffix">{{ suffix }}</slot>
    </span>
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
