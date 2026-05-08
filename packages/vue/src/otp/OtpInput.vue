<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { isValidChar, sanitize, type OtpInputProps } from './variants';

const props = withDefaults(defineProps<OtpInputProps>(), {
  modelValue: '',
  length: 6,
  size: 'md',
  type: 'numeric',
  disabled: false,
  autoFocus: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'complete', value: string): void;
}>();

const cells = ref<string[]>([]);
const inputs = ref<(HTMLInputElement | null)[]>([]);

function syncFromModel() {
  const raw = sanitize(props.modelValue, props.type).slice(0, props.length);
  cells.value = Array.from({ length: props.length }, (_, i) => raw[i] ?? '');
}
syncFromModel();

watch(() => props.modelValue, (v) => {
  if (v === cells.value.join('')) return;
  syncFromModel();
});
watch(() => props.length, () => syncFromModel());

onMounted(() => {
  if (props.autoFocus) inputs.value[0]?.focus();
});

function commit() {
  const v = cells.value.join('');
  emit('update:modelValue', v);
  if (v.length === props.length && !cells.value.includes('')) {
    emit('complete', v);
  }
}

function focusAt(i: number) {
  const idx = Math.max(0, Math.min(props.length - 1, i));
  const el = inputs.value[idx];
  if (el) {
    el.focus();
    el.select?.();
  }
}

function onInput(i: number, e: Event) {
  const target = e.target as HTMLInputElement;
  const raw = target.value;

  if (raw.length > 1) {
    // paste-like multi-char insertion
    const filtered = sanitize(raw, props.type);
    for (let k = 0; k < filtered.length && i + k < props.length; k++) {
      cells.value[i + k] = filtered[k];
    }
    target.value = cells.value[i] ?? '';
    commit();
    nextTick(() => focusAt(Math.min(i + filtered.length, props.length - 1)));
    return;
  }

  const ch = raw.slice(-1);
  if (ch === '' ) {
    cells.value[i] = '';
    target.value = '';
    commit();
    return;
  }
  if (!isValidChar(ch, props.type)) {
    target.value = cells.value[i] ?? '';
    return;
  }
  cells.value[i] = ch;
  target.value = ch;
  commit();
  if (i < props.length - 1) nextTick(() => focusAt(i + 1));
}

function onKeyDown(i: number, e: KeyboardEvent) {
  if (e.key === 'Backspace') {
    if (!cells.value[i] && i > 0) {
      e.preventDefault();
      cells.value[i - 1] = '';
      commit();
      focusAt(i - 1);
    } else if (cells.value[i]) {
      cells.value[i] = '';
      commit();
    }
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    focusAt(i - 1);
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    focusAt(i + 1);
  } else if (e.key === 'Home') {
    e.preventDefault();
    focusAt(0);
  } else if (e.key === 'End') {
    e.preventDefault();
    focusAt(props.length - 1);
  }
}

function onPaste(i: number, e: ClipboardEvent) {
  e.preventDefault();
  const data = e.clipboardData?.getData('text') ?? '';
  const filtered = sanitize(data, props.type);
  if (!filtered) return;
  for (let k = 0; k < filtered.length && i + k < props.length; k++) {
    cells.value[i + k] = filtered[k];
  }
  commit();
  nextTick(() => focusAt(Math.min(i + filtered.length, props.length - 1)));
}

const inputMode = computed(() =>
  props.type === 'numeric' ? 'numeric' : 'text',
);
const cellPattern = computed(() =>
  props.type === 'numeric' ? '[0-9]' : '[0-9a-zA-Z]',
);

function setRef(el: Element | null, i: number) {
  inputs.value[i] = el as HTMLInputElement | null;
}
</script>

<template>
  <div :class="['cf-otp', `cf-otp--${size}`]" role="group">
    <template v-for="i in length" :key="i - 1">
      <input
        :ref="(el) => setRef(el as Element | null, i - 1)"
        type="text"
        class="cf-otp__cell"
        :inputmode="inputMode"
        :pattern="cellPattern"
        :disabled="disabled"
        :value="cells[i - 1] ?? ''"
        :aria-label="`第 ${i} 位`"
        autocomplete="one-time-code"
        @input="onInput(i - 1, $event)"
        @keydown="onKeyDown(i - 1, $event)"
        @paste="onPaste(i - 1, $event)"
      />
      <span
        v-if="separatorAt !== undefined && i === separatorAt"
        class="cf-otp__separator"
        aria-hidden="true"
      >–</span>
    </template>
  </div>
</template>
