<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useDrag } from '../composables/useDrag';
import {
  lockBodyScroll,
  trapFocus,
  unlockBodyScroll,
  type FocusTrap,
} from '../modal/dom';
import {
  nearestSnapIndex,
  resolveSnap,
  type BottomSheetProps,
} from './variants';

const props = withDefaults(defineProps<BottomSheetProps>(), {
  open: false,
  snapPoints: () => ['40%', '90%'],
  initialSnap: 0,
  showGrabber: true,
  maskClosable: true,
  closeOnEsc: true,
  mask: true,
  dismissible: true,
  to: 'body',
});

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void;
  (e: 'close'): void;
  (e: 'snap-change', index: number): void;
}>();

const canRender = ref(false);
const panelRef = ref<HTMLDivElement | null>(null);
const grabberRef = ref<HTMLDivElement | null>(null);
const contentRef = ref<HTMLDivElement | null>(null);
const snapIndex = ref(props.initialSnap);
const dragHeight = ref<number | null>(null);   // override height during drag
const windowH = ref(0);

let trap: FocusTrap | null = null;

function close() {
  emit('update:open', false);
  emit('close');
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.closeOnEsc) {
    e.stopPropagation();
    close();
  }
}

onMounted(() => {
  canRender.value = true;
  if (typeof window !== 'undefined') windowH.value = window.innerHeight;
});

watch(
  [() => props.open, canRender],
  async ([open, ready]) => {
    if (open && ready) {
      windowH.value = window.innerHeight;
      snapIndex.value = props.initialSnap;
      dragHeight.value = null;
      if (props.mask) lockBodyScroll();
      await nextTick();
      if (panelRef.value) trap = trapFocus(panelRef.value);
      window.addEventListener('keydown', onKeyDown, true);
    } else if (!open) {
      trap?.release();
      trap = null;
      if (props.mask) unlockBodyScroll();
      if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeyDown, true);
    }
  },
);

onBeforeUnmount(() => {
  if (props.open) {
    trap?.release();
    if (props.mask) unlockBodyScroll();
    if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeyDown, true);
  }
});

/* snap math */
const snapHeights = computed(() => {
  const wh = windowH.value || 800;
  const ch = contentRef.value?.scrollHeight ?? 400;
  return props.snapPoints.map((s) => resolveSnap(s, wh, ch));
});

const targetHeight = computed(() => {
  const heights = snapHeights.value;
  if (heights.length === 0) return 200;
  return heights[Math.max(0, Math.min(snapIndex.value, heights.length - 1))];
});

const currentHeight = computed(() => dragHeight.value ?? targetHeight.value);

const panelStyle = computed(() => ({
  height: `${currentHeight.value}px`,
  transition: dragHeight.value !== null ? 'none' : undefined,
}));

/* drag grabber for snap navigation + dismiss */
useDrag(grabberRef, {
  axis: 'y',
  onMove(s) {
    const base = targetHeight.value;
    dragHeight.value = Math.max(0, base - s.dy);
  },
  onEnd(s) {
    const heights = snapHeights.value;
    if (heights.length === 0) {
      dragHeight.value = null;
      return;
    }
    const released = currentHeight.value;
    const smallest = heights[0];
    const fastDown = s.vy > 0.5;
    // close: dragged below 1/3 of smallest snap, or fast downward fling
    if (props.dismissible && (released < smallest * 0.5 || fastDown)) {
      dragHeight.value = null;
      close();
      return;
    }
    const idx = nearestSnapIndex(heights, released);
    dragHeight.value = null;
    if (idx !== snapIndex.value) {
      snapIndex.value = idx;
      emit('snap-change', idx);
    }
  },
});

function onOverlayClick(e: MouseEvent) {
  if (!props.maskClosable) return;
  if (e.target === e.currentTarget) close();
}

defineExpose({ close, snapTo(i: number) { snapIndex.value = i; } });
</script>

<template>
  <Teleport v-if="canRender" :to="to">
    <Transition name="cf-sheet" appear>
      <div
        v-if="open"
        class="cf-sheet__overlay"
        :class="!mask && 'cf-sheet__overlay--no-mask'"
        :style="{ zIndex: zIndex ?? 'var(--z-bottomsheet)' }"
        role="presentation"
        @click="onOverlayClick"
      >
        <div
          ref="panelRef"
          class="cf-sheet__panel"
          :style="panelStyle"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
        >
          <div
            v-if="showGrabber"
            ref="grabberRef"
            class="cf-sheet__grabber"
            aria-hidden="true"
          >
            <span class="cf-sheet__grabber-bar" />
          </div>
          <div v-if="title" class="cf-sheet__header">
            <h2 class="cf-sheet__title">{{ title }}</h2>
          </div>
          <div ref="contentRef" class="cf-sheet__content">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
