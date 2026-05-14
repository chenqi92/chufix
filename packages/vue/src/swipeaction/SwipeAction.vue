<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useDrag } from '../composables/useDrag';
import type { SwipeActionItem, SwipeActionProps } from './variants';

const props = withDefaults(defineProps<SwipeActionProps>(), {
  left: () => [],
  right: () => [],
  threshold: 24,
  closeOnOutsideTap: true,
  disabled: false,
});

const emit = defineEmits<{
  (e: 'action', key: string, item: SwipeActionItem): void;
  (e: 'open', side: 'left' | 'right'): void;
  (e: 'close'): void;
}>();

const rootRef = ref<HTMLDivElement | null>(null);
const contentRef = ref<HTMLDivElement | null>(null);
const leftRailRef = ref<HTMLDivElement | null>(null);
const rightRailRef = ref<HTMLDivElement | null>(null);

const offset = ref(0);            // current x offset of content
const opened = ref<'none' | 'left' | 'right'>('none');
const dragging = ref(false);

const leftWidth = ref(0);
const rightWidth = ref(0);

function measure() {
  leftWidth.value = leftRailRef.value?.offsetWidth ?? 0;
  rightWidth.value = rightRailRef.value?.offsetWidth ?? 0;
}

onMounted(() => {
  measure();
});

const dragMin = computed(() => -rightWidth.value);   // negative = right rail visible
const dragMax = computed(() => leftWidth.value);

useDrag(contentRef, {
  axis: 'x',
  onStart() {
    if (props.disabled) return;
    measure();
    dragging.value = true;
  },
  onMove(s) {
    if (props.disabled) return;
    const base = opened.value === 'left' ? leftWidth.value : opened.value === 'right' ? -rightWidth.value : 0;
    const next = base + s.dx;
    offset.value = Math.max(dragMin.value, Math.min(dragMax.value, next));
  },
  onEnd(s) {
    if (props.disabled) return;
    dragging.value = false;
    const fastRight = s.vx > 0.3;
    const fastLeft = s.vx < -0.3;
    const halfL = leftWidth.value / 2;
    const halfR = rightWidth.value / 2;
    if (offset.value > halfL || (fastRight && leftWidth.value > 0)) {
      offset.value = leftWidth.value;
      if (opened.value !== 'left') {
        opened.value = 'left';
        emit('open', 'left');
      }
    } else if (offset.value < -halfR || (fastLeft && rightWidth.value > 0)) {
      offset.value = -rightWidth.value;
      if (opened.value !== 'right') {
        opened.value = 'right';
        emit('open', 'right');
      }
    } else {
      if (opened.value !== 'none') emit('close');
      offset.value = 0;
      opened.value = 'none';
    }
  },
});

function onDocPointer(e: PointerEvent) {
  if (!props.closeOnOutsideTap) return;
  if (opened.value === 'none' || dragging.value) return;
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    offset.value = 0;
    opened.value = 'none';
    emit('close');
  }
}

onMounted(() => {
  if (typeof document !== 'undefined') document.addEventListener('pointerdown', onDocPointer, true);
});
onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.removeEventListener('pointerdown', onDocPointer, true);
});

function onAction(item: SwipeActionItem) {
  item.onClick?.();
  emit('action', item.key, item);
  offset.value = 0;
  opened.value = 'none';
}

const contentStyle = computed(() => ({
  transform: `translateX(${offset.value}px)`,
  transition: dragging.value ? 'none' : undefined,
}));

function toneClass(tone?: string) {
  return tone && tone !== 'default' ? `cf-swipeaction__btn--${tone}` : '';
}
</script>

<template>
  <div ref="rootRef" class="cf-swipeaction" :data-disabled="disabled || undefined">
    <div v-if="left.length" ref="leftRailRef" class="cf-swipeaction__rail cf-swipeaction__rail--left" aria-hidden="true">
      <button
        v-for="item in left"
        :key="item.key"
        type="button"
        class="cf-swipeaction__btn"
        :class="toneClass(item.tone)"
        @click="onAction(item)"
      >
        {{ item.label }}
      </button>
    </div>
    <div ref="contentRef" class="cf-swipeaction__content" :style="contentStyle">
      <slot />
    </div>
    <div v-if="right.length" ref="rightRailRef" class="cf-swipeaction__rail cf-swipeaction__rail--right" aria-hidden="true">
      <button
        v-for="item in right"
        :key="item.key"
        type="button"
        class="cf-swipeaction__btn"
        :class="toneClass(item.tone)"
        @click="onAction(item)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>
