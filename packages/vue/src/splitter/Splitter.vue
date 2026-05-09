<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { splitterClass, type SplitterProps } from './variants';

const props = withDefaults(defineProps<SplitterProps>(), {
  modelValue: undefined,
  defaultSize: 30,
  unit: '%',
  orientation: 'horizontal',
  min: 10,
  max: 90,
  disabled: false,
  collapsible: false,
  resizeFrom: 'start',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
  (e: 'resize', value: number): void;
}>();

const internal = ref(props.defaultSize);
const dragging = ref(false);
const rootRef = ref<HTMLDivElement | null>(null);

const size = computed(() =>
  props.modelValue !== undefined ? props.modelValue : internal.value,
);

watch(
  () => props.defaultSize,
  (v) => {
    if (props.modelValue === undefined) internal.value = v;
  },
);

function commit(v: number) {
  const clamped = Math.max(props.min, Math.min(props.max, v));
  if (props.modelValue === undefined) internal.value = clamped;
  emit('update:modelValue', clamped);
  emit('resize', clamped);
}

function onPointerDown(e: PointerEvent) {
  if (props.disabled || !rootRef.value) return;
  e.preventDefault();
  dragging.value = true;
  const target = e.currentTarget as HTMLElement;
  target.setPointerCapture(e.pointerId);

  const rect = rootRef.value.getBoundingClientRect();
  const isH = props.orientation === 'horizontal';

  function onMove(ev: PointerEvent) {
    if (!rootRef.value) return;
    const total = isH ? rect.width : rect.height;
    let raw = isH ? ev.clientX - rect.left : ev.clientY - rect.top;
    if (props.resizeFrom === 'end') raw = total - raw;
    const next = props.unit === '%' ? (raw / total) * 100 : raw;
    commit(next);
  }

  function onUp(ev: PointerEvent) {
    dragging.value = false;
    target.releasePointerCapture(ev.pointerId);
    target.removeEventListener('pointermove', onMove);
    target.removeEventListener('pointerup', onUp);
    target.removeEventListener('pointercancel', onUp);
  }

  target.addEventListener('pointermove', onMove);
  target.addEventListener('pointerup', onUp);
  target.addEventListener('pointercancel', onUp);
}

function onKeydown(e: KeyboardEvent) {
  if (props.disabled) return;
  const step = e.shiftKey ? 10 : 2;
  const isH = props.orientation === 'horizontal';
  const inc = (isH && e.key === 'ArrowRight') || (!isH && e.key === 'ArrowDown') ? step : 0;
  const dec = (isH && e.key === 'ArrowLeft') || (!isH && e.key === 'ArrowUp') ? step : 0;
  if (inc || dec) {
    e.preventDefault();
    const direction = props.resizeFrom === 'end' ? -1 : 1;
    commit(size.value + (inc - dec) * direction);
  } else if (e.key === 'Home') {
    e.preventDefault();
    commit(props.min);
  } else if (e.key === 'End') {
    e.preventDefault();
    commit(props.max);
  } else if (props.collapsible && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    commit(size.value <= props.min + 1 ? props.defaultSize : props.min);
  }
}

const cls = computed(() =>
  splitterClass({
    orientation: props.orientation,
    disabled: props.disabled,
    dragging: dragging.value,
  }),
);

const startStyle = computed(() => {
  const dim = props.orientation === 'horizontal' ? 'width' : 'height';
  const value = props.unit === '%' ? `${size.value}%` : `${size.value}px`;
  if (props.resizeFrom === 'end') {
    return { [dim]: 'auto', flex: '1 1 0' };
  }
  return { [dim]: value, flex: 'none' };
});

const endStyle = computed(() => {
  const dim = props.orientation === 'horizontal' ? 'width' : 'height';
  const value = props.unit === '%' ? `${size.value}%` : `${size.value}px`;
  if (props.resizeFrom === 'end') {
    return { [dim]: value, flex: 'none' };
  }
  return { [dim]: 'auto', flex: '1 1 0' };
});
</script>

<template>
  <div ref="rootRef" :class="cls">
    <div class="cf-splitter__pane cf-splitter__pane--start" :style="startStyle">
      <slot name="start" />
    </div>
    <div
      class="cf-splitter__handle"
      role="separator"
      :aria-orientation="orientation"
      :aria-valuenow="Math.round(size)"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :tabindex="disabled ? -1 : 0"
      @pointerdown="onPointerDown"
      @keydown="onKeydown"
    >
      <span class="cf-splitter__grip" aria-hidden="true" />
    </div>
    <div class="cf-splitter__pane cf-splitter__pane--end" :style="endStyle">
      <slot name="end" />
    </div>
  </div>
</template>
