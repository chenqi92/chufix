<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { clampZoom, imagePreviewClass, type ImagePreviewProps } from './variants';

const props = withDefaults(defineProps<ImagePreviewProps>(), {
  defaultOpen: false,
});

const emit = defineEmits<{
  'update:modelValue': [open: boolean];
  'update:open': [open: boolean];
  close: [];
}>();

const isControlled = computed(
  () => props.modelValue !== undefined || props.open !== undefined,
);
const internalOpen = ref(props.defaultOpen);
const realOpen = computed(() => {
  if (props.modelValue !== undefined) return props.modelValue;
  if (props.open !== undefined) return props.open;
  return internalOpen.value;
});

const zoom = ref(1);
const dx = ref(0);
const dy = ref(0);
const canRender = ref(false);
let dragging = false;
let startX = 0;
let startY = 0;
let startDx = 0;
let startDy = 0;

function setOpen(v: boolean) {
  if (!isControlled.value) internalOpen.value = v;
  emit('update:modelValue', v);
  emit('update:open', v);
  if (!v) emit('close');
}

function reset() {
  zoom.value = 1;
  dx.value = 0;
  dy.value = 0;
}

function onWheel(evt: WheelEvent) {
  evt.preventDefault();
  const delta = evt.deltaY > 0 ? 0.9 : 1.1;
  zoom.value = clampZoom(zoom.value * delta);
}

function onMouseDown(evt: MouseEvent) {
  dragging = true;
  startX = evt.clientX;
  startY = evt.clientY;
  startDx = dx.value;
  startDy = dy.value;
}

function onMouseMove(evt: MouseEvent) {
  if (!dragging) return;
  dx.value = startDx + (evt.clientX - startX);
  dy.value = startDy + (evt.clientY - startY);
}

function onMouseUp() {
  dragging = false;
}

function onKeydown(evt: KeyboardEvent) {
  if (!realOpen.value) return;
  if (evt.key === 'Escape') setOpen(false);
  else if (evt.key === '+' || evt.key === '=') zoom.value = clampZoom(zoom.value * 1.2);
  else if (evt.key === '-') zoom.value = clampZoom(zoom.value / 1.2);
  else if (evt.key === '0') reset();
}

onMounted(() => {
  canRender.value = true;
});

watch([realOpen, canRender], ([v, ready]) => {
  if (typeof window === 'undefined') return;
  if (v && ready) {
    reset();
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  } else {
    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
});

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return;
  document.removeEventListener('keydown', onKeydown);
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
});

const cls = computed(() => imagePreviewClass({ className: props.className }));
const imgStyle = computed(() => ({
  transform: `translate(${dx.value}px, ${dy.value}px) scale(${zoom.value})`,
}));
</script>

<template>
  <Teleport v-if="canRender" to="body">
    <div v-if="realOpen" :class="cls" role="dialog" aria-modal="true">
      <div class="cf-imgpreview__backdrop" @click="setOpen(false)" />
      <div class="cf-imgpreview__stage" @wheel="onWheel">
        <img
          v-if="src"
          :src="src"
          :alt="alt ?? ''"
          class="cf-imgpreview__img"
          :style="imgStyle"
          draggable="false"
          @mousedown.prevent="onMouseDown"
        />
        <div class="cf-imgpreview__toolbar" @click.stop>
          <button type="button" aria-label="缩小" @click="zoom = clampZoom(zoom / 1.2)">−</button>
          <button type="button" aria-label="重置" @click="reset">100%</button>
          <button type="button" aria-label="放大" @click="zoom = clampZoom(zoom * 1.2)">+</button>
          <button type="button" aria-label="关闭" @click="setOpen(false)">✕</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
