<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  type FlameFrame,
  type FlameNode,
  flattenFlame,
  maxDepth,
  nodeAtPath,
  colorFor,
} from './variants';

const props = withDefaults(
  defineProps<{
    data: FlameNode;
    rowHeight?: number;
    minWidth?: number;
    unit?: string;
  }>(),
  {
    rowHeight: 18,
    minWidth: 2,
    unit: 'ms',
  },
);

const emit = defineEmits<{
  (e: 'frame-click', node: FlameNode, path: number[]): void;
  (e: 'frame-hover', node: FlameNode | null): void;
}>();

const zoomPath = ref<number[]>([]);
const hovered = ref<FlameFrame | null>(null);
const cursorX = ref(0);
const cursorY = ref(0);
const root = ref<HTMLDivElement | null>(null);

const zoomedRoot = computed(() => nodeAtPath(props.data, zoomPath.value) ?? props.data);
const frames = computed(() => flattenFlame(zoomedRoot.value, 0, 1));
const depth = computed(() => maxDepth(zoomedRoot.value) + 1);
const totalHeight = computed(() => depth.value * props.rowHeight);

function onFrameClick(f: FlameFrame) {
  zoomPath.value = [...zoomPath.value, ...f.path];
  emit('frame-click', f.node, [...zoomPath.value]);
}
function reset() {
  zoomPath.value = [];
}
function onHover(f: FlameFrame, ev: MouseEvent) {
  hovered.value = f;
  if (root.value) {
    const rect = root.value.getBoundingClientRect();
    cursorX.value = ev.clientX - rect.left;
    cursorY.value = ev.clientY - rect.top;
  }
  emit('frame-hover', f.node);
}
function onLeave() {
  hovered.value = null;
  emit('frame-hover', null);
}

function labelFits(widthPct: number, name: string, totalWidth: number): boolean {
  const px = widthPct * totalWidth;
  return px > Math.max(40, name.length * 6);
}
</script>

<template>
  <div ref="root" class="cf-flame">
    <button
      v-if="zoomPath.length > 0"
      type="button"
      class="cf-flame__reset"
      @click="reset"
    >← 重置缩放</button>
    <svg
      class="cf-flame__svg"
      :viewBox="`0 0 1000 ${totalHeight}`"
      preserveAspectRatio="none"
      :style="{ height: `${totalHeight}px` }"
      @mouseleave="onLeave"
    >
      <g
        v-for="(f, i) in frames"
        :key="i"
        :transform="`translate(${f.x * 1000}, ${f.depth * rowHeight})`"
        @click="onFrameClick(f)"
        @mousemove="(e) => onHover(f, e)"
      >
        <rect
          :width="Math.max(minWidth, f.width * 1000)"
          :height="rowHeight - 1"
          :fill="colorFor(f.node)"
          :stroke="hovered === f ? 'var(--fg-1)' : 'transparent'"
          stroke-width="1"
          rx="1"
          class="cf-flame__rect"
        />
        <text
          v-if="labelFits(f.width, f.node.name, 1000)"
          :x="6"
          :y="rowHeight - 6"
          fill="var(--bg-0)"
          font-size="11"
          font-family="var(--font-mono)"
        >{{ f.node.name }}</text>
      </g>
    </svg>
    <div
      v-if="hovered"
      class="cf-flame__tooltip"
      :style="{ left: `${cursorX + 12}px`, top: `${cursorY + 12}px` }"
    >
      <strong>{{ hovered.node.name }}</strong>
      <span>{{ hovered.node.value }} {{ unit }} · {{ (hovered.width * 100).toFixed(1) }}%</span>
    </div>
  </div>
</template>
