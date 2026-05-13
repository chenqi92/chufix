<script setup lang="ts">
import { computed, ref } from 'vue';
import type {
  TornadoHoverPayload,
  TornadoItem,
  TornadoProps,
} from './variants';

const props = withDefaults(defineProps<TornadoProps>(), {
  leftLabel: '左',
  rightLabel: '右',
  rowHeight: 24,
  sortByMagnitude: true,
  showValues: true,
  size: 'md',
});

const emit = defineEmits<{
  (e: 'hover', p: TornadoHoverPayload | null): void;
  (e: 'select', p: TornadoHoverPayload): void;
}>();

const PAD_L = 100;
const PAD_R = 100;
const PAD_T = 36;
const PAD_B = 12;
const LABEL_W = 100;

const innerW = ref(560);
function setWidth(el: SVGSVGElement | null) {
  if (el) innerW.value = Math.max(360, el.clientWidth);
}

const ordered = computed<TornadoItem[]>(() => {
  if (!props.sortByMagnitude) return props.items;
  return [...props.items].sort((a, b) => Math.abs(b.left) + Math.abs(b.right) - (Math.abs(a.left) + Math.abs(a.right)));
});

const max = computed(() => {
  let m = 0;
  for (const it of ordered.value) {
    m = Math.max(m, Math.abs(it.left), Math.abs(it.right));
  }
  return m || 1;
});

const halfWidth = computed(() => (innerW.value - PAD_L - PAD_R) / 2);
const centerX = computed(() => PAD_L + halfWidth.value);
const height = computed(() => PAD_T + PAD_B + ordered.value.length * props.rowHeight);

function scale(v: number): number {
  return halfWidth.value * (Math.abs(v) / max.value);
}

function rowY(i: number): number {
  return PAD_T + i * props.rowHeight + props.rowHeight / 2;
}

const hovered = ref<{ index: number; side: 'left' | 'right' } | null>(null);

function onEnter(i: number, side: 'left' | 'right') {
  hovered.value = { index: i, side };
  emit('hover', { index: i, item: ordered.value[i], side });
}
function onLeave() {
  hovered.value = null;
  emit('hover', null);
}
function onClick(i: number, side: 'left' | 'right') {
  emit('select', { index: i, item: ordered.value[i], side });
}

function fmt(v: number): string {
  return props.format ? props.format(v) : Math.abs(v).toLocaleString();
}

const leftFill = computed(() => props.leftColor ?? 'var(--accent-1)');
const rightFill = computed(() => props.rightColor ?? 'var(--status-warning)');
</script>

<template>
  <figure :class="['cf-tornado', `cf-tornado--${size}`]">
    <svg
      :viewBox="`0 0 ${innerW} ${height}`"
      preserveAspectRatio="none"
      :height="height"
      :ref="(el) => setWidth(el as SVGSVGElement | null)"
      :aria-label="ariaLabel ?? `${leftLabel} 与 ${rightLabel} 对比`"
      role="img"
    >
      <!-- column headers -->
      <text :x="PAD_L + halfWidth / 2" :y="20" class="cf-tornado__header" text-anchor="middle">{{ leftLabel }}</text>
      <text :x="centerX + halfWidth / 2" :y="20" class="cf-tornado__header" text-anchor="middle">{{ rightLabel }}</text>

      <!-- center axis -->
      <line :x1="centerX" :x2="centerX" :y1="PAD_T - 4" :y2="height - PAD_B + 4" class="cf-tornado__axis" />

      <!-- bars -->
      <g v-for="(it, i) in ordered" :key="i" class="cf-tornado__row">
        <!-- center label -->
        <text :x="centerX" :y="rowY(i) + 4" class="cf-tornado__row-label" text-anchor="middle">{{ it.label }}</text>

        <!-- left bar -->
        <rect
          :x="centerX - LABEL_W / 2 - scale(it.left)"
          :y="rowY(i) - rowHeight / 2 + 4"
          :width="scale(it.left)"
          :height="rowHeight - 8"
          :fill="it.leftColor ?? leftFill"
          :opacity="hovered === null || (hovered.index === i && hovered.side === 'left') ? 1 : 0.45"
          class="cf-tornado__bar cf-tornado__bar--left"
          tabindex="0"
          :aria-label="`${it.label} · ${leftLabel}: ${fmt(it.left)}`"
          @mouseenter="onEnter(i, 'left')"
          @mouseleave="onLeave"
          @click="onClick(i, 'left')"
        />
        <text
          v-if="showValues"
          :x="centerX - LABEL_W / 2 - scale(it.left) - 4"
          :y="rowY(i) + 4"
          class="cf-tornado__value cf-tornado__value--left"
          text-anchor="end"
        >{{ fmt(it.left) }}</text>

        <!-- right bar -->
        <rect
          :x="centerX + LABEL_W / 2"
          :y="rowY(i) - rowHeight / 2 + 4"
          :width="scale(it.right)"
          :height="rowHeight - 8"
          :fill="it.rightColor ?? rightFill"
          :opacity="hovered === null || (hovered.index === i && hovered.side === 'right') ? 1 : 0.45"
          class="cf-tornado__bar cf-tornado__bar--right"
          tabindex="0"
          :aria-label="`${it.label} · ${rightLabel}: ${fmt(it.right)}`"
          @mouseenter="onEnter(i, 'right')"
          @mouseleave="onLeave"
          @click="onClick(i, 'right')"
        />
        <text
          v-if="showValues"
          :x="centerX + LABEL_W / 2 + scale(it.right) + 4"
          :y="rowY(i) + 4"
          class="cf-tornado__value cf-tornado__value--right"
          text-anchor="start"
        >{{ fmt(it.right) }}</text>
      </g>
    </svg>
  </figure>
</template>
