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
</script>

<template>
  <div ref="root" class="cf-flame">
    <button
      v-if="zoomPath.length > 0"
      type="button"
      class="cf-flame__reset"
      @click="reset"
    >← 重置缩放</button>
    <div
      class="cf-flame__viewport"
      :style="{ height: `${totalHeight}px` }"
      @mouseleave="onLeave"
    >
      <button
        v-for="(f, i) in frames"
        :key="i"
        type="button"
        class="cf-flame__rect"
        :class="{ 'is-hovered': hovered === f }"
        :style="{
          left: `${f.x * 100}%`,
          width: `max(${minWidth}px, ${f.width * 100}%)`,
          top: `${f.depth * rowHeight}px`,
          height: `${rowHeight - 1}px`,
          background: colorFor(f.node),
        }"
        @click="onFrameClick(f)"
        @mousemove="(e) => onHover(f, e)"
      >
        <span class="cf-flame__label">{{ f.node.name }}</span>
      </button>
    </div>
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
