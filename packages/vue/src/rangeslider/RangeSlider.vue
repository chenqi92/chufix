<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  clamp,
  snap,
  type RangeSliderProps,
  type RangeValue,
} from './variants';

const props = withDefaults(defineProps<RangeSliderProps>(), {
  modelValue: () => [0, 100] as RangeValue,
  min: 0,
  max: 100,
  step: 1,
  size: 'md',
  tone: 'default',
  disabled: false,
  showTooltip: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: RangeValue): void;
  (e: 'change', value: RangeValue): void;
}>();

const trackRef = ref<HTMLDivElement | null>(null);
const dragging = ref<'min' | 'max' | null>(null);

const span = computed(() => Math.max(1, props.max - props.min));
const lo = computed(() => Math.min(props.modelValue[0], props.modelValue[1]));
const hi = computed(() => Math.max(props.modelValue[0], props.modelValue[1]));
const loPct = computed(() => ((lo.value - props.min) / span.value) * 100);
const hiPct = computed(() => ((hi.value - props.min) / span.value) * 100);

const cls = computed(() => [
  'cf-rangeslider',
  `cf-rangeslider--${props.size}`,
  `cf-rangeslider--${props.tone}`,
  props.disabled && 'is-disabled',
]);

function valueAt(clientX: number): number {
  const el = trackRef.value;
  if (!el) return props.min;
  const rect = el.getBoundingClientRect();
  const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
  return clamp(snap(props.min + ratio * span.value, props.step), props.min, props.max);
}

function startDrag(which: 'min' | 'max', e: PointerEvent) {
  if (props.disabled) return;
  dragging.value = which;
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return;
  e.preventDefault();
  const v = valueAt(e.clientX);
  if (dragging.value === 'min') {
    const nLo = Math.min(v, hi.value);
    if (nLo !== lo.value) emit('update:modelValue', [nLo, hi.value]);
  } else {
    const nHi = Math.max(v, lo.value);
    if (nHi !== hi.value) emit('update:modelValue', [lo.value, nHi]);
  }
}

function endDrag(e: PointerEvent) {
  if (!dragging.value) return;
  (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  dragging.value = null;
  emit('change', [lo.value, hi.value]);
}

function onTrackClick(e: MouseEvent) {
  if (props.disabled) return;
  const v = valueAt(e.clientX);
  // attach to the closer knob
  const distLo = Math.abs(v - lo.value);
  const distHi = Math.abs(v - hi.value);
  if (distLo <= distHi) {
    emit('update:modelValue', [Math.min(v, hi.value), hi.value]);
  } else {
    emit('update:modelValue', [lo.value, Math.max(v, lo.value)]);
  }
  emit('change', props.modelValue);
}

function onKeyDown(which: 'min' | 'max', e: KeyboardEvent) {
  if (props.disabled) return;
  let delta = 0;
  if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -props.step;
  else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = props.step;
  else if (e.key === 'PageDown') delta = -props.step * 10;
  else if (e.key === 'PageUp') delta = props.step * 10;
  else if (e.key === 'Home') {
    if (which === 'min') return emit('update:modelValue', [props.min, hi.value]);
    return emit('update:modelValue', [lo.value, lo.value]);
  } else if (e.key === 'End') {
    if (which === 'max') return emit('update:modelValue', [lo.value, props.max]);
    return emit('update:modelValue', [hi.value, hi.value]);
  }
  if (delta === 0) return;
  e.preventDefault();
  if (which === 'min') {
    const nLo = clamp(lo.value + delta, props.min, hi.value);
    emit('update:modelValue', [nLo, hi.value]);
  } else {
    const nHi = clamp(hi.value + delta, lo.value, props.max);
    emit('update:modelValue', [lo.value, nHi]);
  }
}
</script>

<template>
  <div :class="cls">
    <div
      ref="trackRef"
      class="cf-rangeslider__track"
      @click="onTrackClick"
    >
      <div
        class="cf-rangeslider__fill"
        :style="{ left: `${loPct}%`, width: `${hiPct - loPct}%` }"
      />
      <button
        type="button"
        class="cf-rangeslider__knob"
        :style="{ left: `${loPct}%` }"
        :aria-valuemin="min"
        :aria-valuemax="hi"
        :aria-valuenow="lo"
        :tabindex="disabled ? -1 : 0"
        role="slider"
        @pointerdown="(e) => startDrag('min', e)"
        @pointermove="onPointerMove"
        @pointerup="endDrag"
        @pointercancel="endDrag"
        @keydown="(e) => onKeyDown('min', e)"
      >
        <span v-if="showTooltip" class="cf-rangeslider__tooltip">{{ lo }}</span>
      </button>
      <button
        type="button"
        class="cf-rangeslider__knob"
        :style="{ left: `${hiPct}%` }"
        :aria-valuemin="lo"
        :aria-valuemax="max"
        :aria-valuenow="hi"
        :tabindex="disabled ? -1 : 0"
        role="slider"
        @pointerdown="(e) => startDrag('max', e)"
        @pointermove="onPointerMove"
        @pointerup="endDrag"
        @pointercancel="endDrag"
        @keydown="(e) => onKeyDown('max', e)"
      >
        <span v-if="showTooltip" class="cf-rangeslider__tooltip">{{ hi }}</span>
      </button>
    </div>
  </div>
</template>
