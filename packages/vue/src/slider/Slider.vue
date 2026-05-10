<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from 'vue';
import {
  type SliderProps,
  type SliderChangeMeta,
  sliderClass,
  clampStep,
} from './variants';

const props = withDefaults(defineProps<SliderProps>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  size: 'md',
  tone: 'primary',
  disabled: false,
  showValue: false,
  ticks: false,
});
const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void;
  (e: 'change', v: number, meta: SliderChangeMeta): void;
  (e: 'changeEnd', v: number, meta: SliderChangeMeta): void;
}>();

const trackRef = ref<HTMLDivElement | null>(null);
const cls = computed(() => sliderClass({ size: props.size!, tone: props.tone! }));

const value = computed(() =>
  clampStep(props.modelValue!, props.min!, props.max!, props.step!)
);
const percent = computed(() => {
  if (props.max! === props.min!) return 0;
  return ((value.value - props.min!) / (props.max! - props.min!)) * 100;
});

const tickPositions = computed(() => {
  if (!props.ticks) return [];
  const steps: number[] = [];
  const span = props.max! - props.min!;
  if (props.step! <= 0 || span / props.step! > 50) return steps;
  for (let v = props.min!; v <= props.max!; v += props.step!) {
    steps.push(((v - props.min!) / span) * 100);
  }
  return steps;
});

let dragging = false;
let interactionValue = value.value;

function valueFromClientX(clientX: number): number {
  if (!trackRef.value) return value.value;
  const rect = trackRef.value.getBoundingClientRect();
  const ratio = (clientX - rect.left) / rect.width;
  const raw = props.min! + ratio * (props.max! - props.min!);
  return clampStep(raw, props.min!, props.max!, props.step!);
}

function commit(v: number, meta: SliderChangeMeta): boolean {
  interactionValue = v;
  if (v === value.value) return false;
  emit('update:modelValue', v);
  emit('change', v, meta);
  return true;
}

function onPointerDown(e: PointerEvent) {
  if (props.disabled) return;
  dragging = true;
  (e.target as Element).setPointerCapture?.(e.pointerId);
  const next = valueFromClientX(e.clientX);
  commit(next, { event: e, value: next, source: 'pointer' });
}
function onPointerMove(e: PointerEvent) {
  if (!dragging) return;
  const next = valueFromClientX(e.clientX);
  commit(next, { event: e, value: next, source: 'pointer' });
}
function onPointerUp(e: PointerEvent) {
  if (!dragging) return;
  dragging = false;
  (e.target as Element).releasePointerCapture?.(e.pointerId);
  emit('changeEnd', interactionValue, {
    event: e,
    value: interactionValue,
    source: 'pointer',
  });
}

function onKeyDown(e: KeyboardEvent) {
  if (props.disabled) return;
  let dir = 0;
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') dir = 1;
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') dir = -1;
  else if (e.key === 'Home') {
    e.preventDefault();
    const next = props.min!;
    if (commit(next, { event: e, value: next, source: 'keyboard' })) {
      emit('changeEnd', next, { event: e, value: next, source: 'keyboard' });
    }
    return;
  }
  else if (e.key === 'End') {
    e.preventDefault();
    const next = props.max!;
    if (commit(next, { event: e, value: next, source: 'keyboard' })) {
      emit('changeEnd', next, { event: e, value: next, source: 'keyboard' });
    }
    return;
  }
  else if (e.key === 'PageUp') dir = 10;
  else if (e.key === 'PageDown') dir = -10;
  if (dir !== 0) {
    e.preventDefault();
    const next = clampStep(value.value + dir * props.step!, props.min!, props.max!, props.step!);
    if (commit(next, { event: e, value: next, source: 'keyboard' })) {
      emit('changeEnd', next, { event: e, value: next, source: 'keyboard' });
    }
  }
}

onBeforeUnmount(() => (dragging = false));
</script>

<template>
  <div :class="cls" :data-disabled="disabled || undefined">
    <div
      ref="trackRef"
      class="cf-slider__track"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
    >
      <div class="cf-slider__rail"></div>
      <div class="cf-slider__fill" :style="{ width: percent + '%' }"></div>
      <div
        v-for="(p, i) in tickPositions"
        :key="i"
        class="cf-slider__tick"
        :style="{ left: p + '%' }"
      ></div>
      <div
        class="cf-slider__thumb"
        :style="{ left: percent + '%' }"
        role="slider"
        :tabindex="disabled ? -1 : 0"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="value"
        :aria-disabled="disabled || undefined"
        @keydown="onKeyDown"
      >
        <span v-if="showValue" class="cf-slider__bubble">{{ value }}</span>
      </div>
    </div>
  </div>
</template>
