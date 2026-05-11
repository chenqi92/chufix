<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { DetachedPanelProps } from './variants';

const props = withDefaults(defineProps<DetachedPanelProps>(), {
  open: false,
  width: 360,
  height: 240,
  resizable: false,
  closable: true,
  to: 'body',
});

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'move', x: number, y: number): void;
}>();

function defaultX() {
  return typeof window === 'undefined' ? 20 : Math.max(window.innerWidth - 400, 20);
}

const x = ref<number>(props.x ?? defaultX());
const y = ref<number>(props.y ?? 80);
const dragging = ref(false);
const canRender = ref(false);
let dragOffsetX = 0;
let dragOffsetY = 0;

onMounted(() => {
  canRender.value = true;
  if (typeof props.x !== 'number') x.value = defaultX();
});

watch(
  () => [props.x, props.y],
  ([nx, ny]) => {
    if (typeof nx === 'number') x.value = nx;
    if (typeof ny === 'number') y.value = ny;
  },
);

const dimStyle = computed(() => {
  const s: Record<string, string | number> = {
    left: `${x.value}px`,
    top: `${y.value}px`,
    width:
      typeof props.width === 'number' ? `${props.width}px` : props.width,
    height:
      typeof props.height === 'number' ? `${props.height}px` : props.height,
  };
  if (props.zIndex != null) s.zIndex = props.zIndex;
  if (props.resizable) s.resize = 'both';
  return s;
});

function onHeaderPointerDown(e: PointerEvent) {
  dragging.value = true;
  dragOffsetX = e.clientX - x.value;
  dragOffsetY = e.clientY - y.value;
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}

function onHeaderPointerMove(e: PointerEvent) {
  if (!dragging.value) return;
  const nx = Math.max(0, e.clientX - dragOffsetX);
  const ny = Math.max(0, e.clientY - dragOffsetY);
  x.value = nx;
  y.value = ny;
  emit('move', nx, ny);
}

function onHeaderPointerUp(e: PointerEvent) {
  if (!dragging.value) return;
  dragging.value = false;
  (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
}

function close() {
  emit('update:open', false);
}

onBeforeUnmount(() => {
  dragging.value = false;
});
</script>

<template>
  <Teleport v-if="canRender && open" :to="to">
    <Transition name="cf-detached" appear>
      <section
        v-if="open"
        class="cf-detached"
        :style="dimStyle"
        role="dialog"
        :aria-label="title || 'panel'"
      >
        <header
          class="cf-detached__header"
          @pointerdown="onHeaderPointerDown"
          @pointermove="onHeaderPointerMove"
          @pointerup="onHeaderPointerUp"
          @pointercancel="onHeaderPointerUp"
        >
          <span class="cf-detached__title">
            <slot name="title">{{ title }}</slot>
          </span>
          <span class="cf-detached__actions">
            <slot name="actions" />
            <button
              v-if="closable"
              type="button"
              class="cf-detached__close"
              aria-label="关闭"
              @click="close"
            >×</button>
          </span>
        </header>
        <div class="cf-detached__body">
          <slot />
        </div>
      </section>
    </Transition>
  </Teleport>
</template>
