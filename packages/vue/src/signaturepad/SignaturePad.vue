<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { SignaturePoint } from './variants';

const props = withDefaults(
  defineProps<{
    width?: number | string;
    height?: number | string;
    strokeWidth?: number;
    strokeColor?: string;
    background?: string;
    disabled?: boolean;
  }>(),
  {
    width: '100%',
    height: 180,
    strokeWidth: 2,
    background: 'transparent',
  },
);

const emit = defineEmits<{
  (e: 'change', empty: boolean): void;
  (e: 'start'): void;
  (e: 'end'): void;
}>();

const canvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let dpr = 1;
let drawing = false;
let pointerId = -1;
let stroke: SignaturePoint[] = [];
let lastEmpty = true;

function getStrokeColor(): string {
  if (props.strokeColor) return props.strokeColor;
  if (canvas.value) {
    return getComputedStyle(canvas.value).getPropertyValue('color') || '#fff';
  }
  return '#fff';
}

function resize() {
  const el = canvas.value;
  if (!el) return;
  dpr = window.devicePixelRatio || 1;
  const rect = el.getBoundingClientRect();
  el.width = Math.max(1, Math.round(rect.width * dpr));
  el.height = Math.max(1, Math.round(rect.height * dpr));
  if (ctx) ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx = el.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

function pointFromEvent(ev: PointerEvent): SignaturePoint {
  const rect = canvas.value!.getBoundingClientRect();
  return { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
}

function onDown(ev: PointerEvent) {
  if (props.disabled || !canvas.value || !ctx) return;
  if (ev.button !== undefined && ev.button !== 0) return;
  drawing = true;
  pointerId = ev.pointerId;
  try {
    canvas.value.setPointerCapture(ev.pointerId);
  } catch {}
  stroke = [pointFromEvent(ev)];
  ctx.strokeStyle = getStrokeColor();
  ctx.lineWidth = props.strokeWidth;
  ctx.beginPath();
  ctx.moveTo(stroke[0].x, stroke[0].y);
  emit('start');
}

function onMove(ev: PointerEvent) {
  if (!drawing || ev.pointerId !== pointerId || !ctx) return;
  const p = pointFromEvent(ev);
  const last = stroke[stroke.length - 1];
  const mid = { x: (last.x + p.x) / 2, y: (last.y + p.y) / 2 };
  ctx.quadraticCurveTo(last.x, last.y, mid.x, mid.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(mid.x, mid.y);
  stroke.push(p);
}

function onUp(ev: PointerEvent) {
  if (!drawing || ev.pointerId !== pointerId || !ctx) return;
  drawing = false;
  if (stroke.length > 0) {
    const last = stroke[stroke.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
  } else if (stroke.length === 1) {
    const p = stroke[0];
    ctx.beginPath();
    ctx.arc(p.x, p.y, props.strokeWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = getStrokeColor();
    ctx.fill();
  }
  stroke = [];
  try {
    canvas.value?.releasePointerCapture(ev.pointerId);
  } catch {}
  lastEmpty = false;
  emit('end');
  emit('change', false);
}

function clear() {
  if (!ctx || !canvas.value) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  ctx.restore();
  lastEmpty = true;
  emit('change', true);
}

function toDataURL(type = 'image/png', quality?: number): string {
  if (!canvas.value) return '';
  return canvas.value.toDataURL(type, quality);
}

function toBlob(type = 'image/png', quality?: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    if (!canvas.value) return resolve(null);
    canvas.value.toBlob(resolve, type, quality);
  });
}

function isEmpty(): boolean {
  return lastEmpty;
}

defineExpose({ clear, toDataURL, toBlob, isEmpty });

onMounted(() => {
  resize();
  window.addEventListener('resize', resize);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
});

watch(() => [props.width, props.height], resize, { flush: 'post' });

const style = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  background: props.background,
}));

const rootClass = computed(() => [
  'cf-signpad',
  props.disabled && 'is-disabled',
]);
</script>

<template>
  <div :class="rootClass" :style="style">
    <canvas
      ref="canvas"
      class="cf-signpad__canvas"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="onUp"
    />
  </div>
</template>
