<script setup lang="ts">
import { computed, ref } from 'vue';
import type {
  VennHoverPayload,
  VennIntersection,
  VennProps,
  VennSet,
} from './variants';

const props = withDefaults(defineProps<VennProps>(), {
  size: 320,
  variant: 'md',
});

const emit = defineEmits<{
  (e: 'hover', p: VennHoverPayload | null): void;
  (e: 'select', p: VennHoverPayload): void;
}>();

const DEFAULT_PALETTE = [
  'var(--viz-1, oklch(64% 0.16 263))',
  'var(--viz-2, oklch(70% 0.13 175))',
  'var(--viz-3, oklch(74% 0.16 80))',
];

interface Circle {
  cx: number;
  cy: number;
  r: number;
  color: string;
  set: VennSet;
  index: number;
}

const circles = computed<Circle[]>(() => {
  const n = props.sets.length;
  const center = props.size / 2;
  const maxR = props.size * 0.34;
  const minR = props.size * 0.18;
  const counts = props.sets.map((s) => Math.max(1, s.count));
  const maxC = Math.max(...counts);
  const minC = Math.min(...counts);
  const radii = counts.map((c) => {
    if (maxC === minC) return maxR * 0.85;
    const t = (c - minC) / (maxC - minC);
    return minR + t * (maxR - minR);
  });
  const spread = props.size * 0.18;
  if (n === 2) {
    return [
      { cx: center - spread, cy: center, r: radii[0], color: props.sets[0].color ?? DEFAULT_PALETTE[0], set: props.sets[0], index: 0 },
      { cx: center + spread, cy: center, r: radii[1], color: props.sets[1].color ?? DEFAULT_PALETTE[1], set: props.sets[1], index: 1 },
    ];
  }
  /* 3 sets: triangle layout */
  const offsetY = spread * 0.5;
  return [
    { cx: center - spread, cy: center + offsetY, r: radii[0], color: props.sets[0].color ?? DEFAULT_PALETTE[0], set: props.sets[0], index: 0 },
    { cx: center + spread, cy: center + offsetY, r: radii[1], color: props.sets[1].color ?? DEFAULT_PALETTE[1], set: props.sets[1], index: 1 },
    { cx: center, cy: center - spread * 0.7, r: radii[2], color: props.sets[2].color ?? DEFAULT_PALETTE[2], set: props.sets[2], index: 2 },
  ];
});

/* Centroid of an arbitrary intersection — averaging circle centers gives a
 * reasonable visual anchor for label placement inside the overlap region. */
function intersectionCenter(indices: number[]): { x: number; y: number } {
  const xs = indices.map((i) => circles.value[i].cx);
  const ys = indices.map((i) => circles.value[i].cy);
  return {
    x: xs.reduce((a, b) => a + b, 0) / xs.length,
    y: ys.reduce((a, b) => a + b, 0) / ys.length,
  };
}

/* "Only in set i" anchor: push outward from the diagram center. */
function soloCenter(i: number): { x: number; y: number } {
  const c = circles.value[i];
  const center = props.size / 2;
  const dx = c.cx - center;
  const dy = c.cy - center;
  const m = Math.hypot(dx, dy) || 1;
  const push = c.r * 0.55;
  return { x: c.cx + (dx / m) * push, y: c.cy + (dy / m) * push };
}

const hovered = ref<VennHoverPayload | null>(null);

function onSetEnter(c: Circle) {
  const payload: VennHoverPayload = { type: 'set', setIndex: c.index, set: c.set };
  hovered.value = payload;
  emit('hover', payload);
}
function onSetClick(c: Circle) {
  emit('select', { type: 'set', setIndex: c.index, set: c.set });
}
function onIntersectionEnter(inter: VennIntersection) {
  const payload: VennHoverPayload = { type: 'intersection', intersection: inter };
  hovered.value = payload;
  emit('hover', payload);
}
function onIntersectionClick(inter: VennIntersection) {
  emit('select', { type: 'intersection', intersection: inter });
}
function onLeave() {
  hovered.value = null;
  emit('hover', null);
}

function fmt(n: number) {
  return props.format ? props.format(n) : n.toLocaleString();
}

/* Sum intersections that include set i as the "uniques in set i" count. */
function soloLabel(i: number): string {
  if (!props.intersections) return fmt(props.sets[i].count);
  /* approximate: subtract any intersection that mentions this set */
  const overlap = props.intersections
    .filter((it) => it.sets.includes(i))
    .reduce((s, it) => s + it.count, 0);
  return fmt(Math.max(0, props.sets[i].count - overlap));
}
</script>

<template>
  <figure :class="['cf-venn', `cf-venn--${variant}`]">
    <svg
      :viewBox="`0 0 ${size} ${size}`"
      :width="size"
      :height="size"
      :aria-label="ariaLabel ?? '韦恩图'"
      role="img"
    >
      <g class="cf-venn__circles">
        <circle
          v-for="c in circles"
          :key="c.index"
          :cx="c.cx"
          :cy="c.cy"
          :r="c.r"
          :fill="c.color"
          :stroke="c.color"
          fill-opacity="0.32"
          stroke-width="1.5"
          stroke-opacity="0.85"
          class="cf-venn__circle"
          tabindex="0"
          :aria-label="`${c.set.label}: ${c.set.count}`"
          @mouseenter="onSetEnter(c)"
          @mouseleave="onLeave"
          @click="onSetClick(c)"
        />
      </g>

      <!-- Set labels around the perimeter -->
      <g class="cf-venn__set-labels">
        <text
          v-for="c in circles"
          :key="`l-${c.index}`"
          :x="soloCenter(c.index).x"
          :y="soloCenter(c.index).y - 14"
          class="cf-venn__set-label"
          text-anchor="middle"
        >{{ c.set.label }}</text>
        <text
          v-for="c in circles"
          :key="`s-${c.index}`"
          :x="soloCenter(c.index).x"
          :y="soloCenter(c.index).y + 6"
          class="cf-venn__set-count"
          text-anchor="middle"
        >{{ soloLabel(c.index) }}</text>
      </g>

      <!-- Intersection counts in the middle -->
      <g v-if="intersections && intersections.length" class="cf-venn__intersections">
        <g v-for="(inter, i) in intersections" :key="i">
          <text
            :x="intersectionCenter(inter.sets).x"
            :y="intersectionCenter(inter.sets).y - 4"
            class="cf-venn__inter-label"
            text-anchor="middle"
          >{{ inter.label ?? `∩ ${inter.sets.length}` }}</text>
          <text
            :x="intersectionCenter(inter.sets).x"
            :y="intersectionCenter(inter.sets).y + 10"
            class="cf-venn__inter-count"
            text-anchor="middle"
            tabindex="0"
            :aria-label="`交集 ${inter.sets.join(',')}: ${fmt(inter.count)}`"
            @mouseenter="onIntersectionEnter(inter)"
            @mouseleave="onLeave"
            @click="onIntersectionClick(inter)"
          >{{ fmt(inter.count) }}</text>
        </g>
      </g>
    </svg>
    <figcaption v-if="hovered" class="cf-venn__tip">
      <template v-if="hovered.type === 'set' && hovered.set">
        <span class="cf-venn__tip-label">{{ hovered.set.label }}</span>
        <span class="cf-venn__tip-row">{{ fmt(hovered.set.count) }}</span>
      </template>
      <template v-else-if="hovered.type === 'intersection' && hovered.intersection">
        <span class="cf-venn__tip-label">{{ hovered.intersection.label ?? '交集' }}</span>
        <span class="cf-venn__tip-row">{{ fmt(hovered.intersection.count) }}</span>
      </template>
    </figcaption>
  </figure>
</template>
