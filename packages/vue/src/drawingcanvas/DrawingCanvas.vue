<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
  type DrawingPoint,
  type DrawingStroke,
  type DrawingTool,
  DEFAULT_PALETTE,
  DEFAULT_SIZES,
  strokePath,
} from './variants';

const props = withDefaults(
  defineProps<{
    width?: number | string;
    height?: number | string;
    initialStrokes?: DrawingStroke[];
    colors?: string[];
    sizes?: number[];
    background?: string;
    toolbar?: boolean;
    disabled?: boolean;
  }>(),
  {
    width: '100%',
    height: 320,
    background: 'transparent',
    toolbar: true,
  },
);

const emit = defineEmits<{
  (e: 'change', strokes: DrawingStroke[]): void;
}>();

const canvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let dpr = 1;

const palette = computed(() => props.colors ?? DEFAULT_PALETTE);
const brushSizes = computed(() => props.sizes ?? DEFAULT_SIZES);

const color = ref(palette.value[1] ?? '#fff');
const size = ref(brushSizes.value[1] ?? 4);
const tool = ref<DrawingTool>('brush');

const strokes = ref<DrawingStroke[]>([...(props.initialStrokes ?? [])]);
const future = ref<DrawingStroke[]>([]);

let drawing = false;
let pointerId = -1;
let current: DrawingStroke | null = null;

function resize() {
  const el = canvas.value;
  if (!el) return;
  dpr = window.devicePixelRatio || 1;
  const rect = el.getBoundingClientRect();
  el.width = Math.max(1, Math.round(rect.width * dpr));
  el.height = Math.max(1, Math.round(rect.height * dpr));
  ctx = el.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  redraw();
}

function redraw() {
  const el = canvas.value;
  if (!el || !ctx) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, el.width, el.height);
  ctx.restore();
  for (const s of strokes.value) strokePath(s, ctx);
  if (current) strokePath(current, ctx);
}

function pointFromEvent(ev: PointerEvent): DrawingPoint {
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
  current = {
    tool: tool.value,
    color: color.value,
    width: size.value,
    points: [pointFromEvent(ev)],
  };
  redraw();
}

function onMove(ev: PointerEvent) {
  if (!drawing || ev.pointerId !== pointerId || !current) return;
  current.points.push(pointFromEvent(ev));
  redraw();
}

function onUp(ev: PointerEvent) {
  if (!drawing || ev.pointerId !== pointerId || !current) return;
  drawing = false;
  strokes.value = [...strokes.value, current];
  future.value = [];
  current = null;
  try {
    canvas.value?.releasePointerCapture(ev.pointerId);
  } catch {}
  redraw();
  emit('change', strokes.value);
}

function clear() {
  if (strokes.value.length === 0) return;
  future.value = [];
  strokes.value = [];
  redraw();
  emit('change', strokes.value);
}

function undo() {
  if (strokes.value.length === 0) return;
  const last = strokes.value[strokes.value.length - 1];
  strokes.value = strokes.value.slice(0, -1);
  future.value = [...future.value, last];
  redraw();
  emit('change', strokes.value);
}

function redo() {
  if (future.value.length === 0) return;
  const next = future.value[future.value.length - 1];
  future.value = future.value.slice(0, -1);
  strokes.value = [...strokes.value, next];
  redraw();
  emit('change', strokes.value);
}

function getStrokes(): DrawingStroke[] {
  return strokes.value;
}
function setStrokes(next: DrawingStroke[]) {
  strokes.value = [...next];
  future.value = [];
  redraw();
  emit('change', strokes.value);
}
function toDataURL(type = 'image/png', quality?: number): string {
  return canvas.value?.toDataURL(type, quality) ?? '';
}
function toBlob(type = 'image/png', quality?: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    const el = canvas.value;
    if (!el) return resolve(null);
    el.toBlob(resolve, type, quality);
  });
}

defineExpose({ clear, undo, redo, getStrokes, setStrokes, toDataURL, toBlob });

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
  background: props.background,
}));
const canvasStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}));
</script>

<template>
  <div class="cf-draw" :class="{ 'is-disabled': disabled }" :style="style">
    <div v-if="toolbar" class="cf-draw__bar">
      <div class="cf-draw__tools">
        <button
          type="button"
          class="cf-draw__tool"
          :class="{ 'is-active': tool === 'brush' }"
          :disabled="disabled"
          aria-label="brush"
          @click="tool = 'brush'"
        >
          <svg viewBox="0 0 16 16" width="14" height="14">
            <path d="M2 13l3-2.5L10 5l1.5 1.5L6 12 3.5 14z" fill="currentColor" />
          </svg>
        </button>
        <button
          type="button"
          class="cf-draw__tool"
          :class="{ 'is-active': tool === 'eraser' }"
          :disabled="disabled"
          aria-label="eraser"
          @click="tool = 'eraser'"
        >
          <svg viewBox="0 0 16 16" width="14" height="14">
            <path
              d="M3 12l5.5-5.5 4 4L7 16H3v-4z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
      <div class="cf-draw__colors">
        <button
          v-for="c in palette"
          :key="c"
          type="button"
          class="cf-draw__color"
          :class="{ 'is-active': color === c }"
          :style="{ background: c }"
          :disabled="disabled"
          :aria-label="`color ${c}`"
          @click="color = c"
        />
      </div>
      <div class="cf-draw__sizes">
        <button
          v-for="s in brushSizes"
          :key="s"
          type="button"
          class="cf-draw__size"
          :class="{ 'is-active': size === s }"
          :disabled="disabled"
          :aria-label="`size ${s}`"
          @click="size = s"
        >
          <span :style="{ width: `${s}px`, height: `${s}px` }" />
        </button>
      </div>
      <div class="cf-draw__spacer" />
      <button
        type="button"
        class="cf-draw__action"
        :disabled="disabled || strokes.length === 0"
        @click="undo"
      >撤销</button>
      <button
        type="button"
        class="cf-draw__action"
        :disabled="disabled || future.length === 0"
        @click="redo"
      >重做</button>
      <button
        type="button"
        class="cf-draw__action"
        :disabled="disabled || strokes.length === 0"
        @click="clear"
      >清空</button>
    </div>
    <canvas
      ref="canvas"
      class="cf-draw__canvas"
      :style="canvasStyle"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="onUp"
    />
  </div>
</template>
