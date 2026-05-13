<script setup lang="ts">
import { computed, ref } from 'vue';
import type {
  WordCloudHoverPayload,
  WordCloudItem,
  WordCloudProps,
} from './variants';

const props = withDefaults(defineProps<WordCloudProps>(), {
  width: 480,
  height: 280,
  minFont: 12,
  maxFont: 48,
  rotateRatio: 0.3,
  spiralStep: 4,
  seed: 1,
  size: 'md',
  palette: () => [
    'var(--viz-1, oklch(64% 0.16 263))',
    'var(--viz-2, oklch(70% 0.13 175))',
    'var(--viz-3, oklch(74% 0.16 80))',
    'var(--viz-4, oklch(64% 0.18 30))',
    'var(--viz-5, oklch(68% 0.18 320))',
    'var(--viz-6, oklch(72% 0.14 220))',
    'var(--viz-7, oklch(70% 0.13 140))',
    'var(--viz-8, oklch(68% 0.18 0))',
  ],
});

const emit = defineEmits<{
  (e: 'hover', p: WordCloudHoverPayload | null): void;
  (e: 'select', p: WordCloudHoverPayload): void;
}>();

interface Placed {
  index: number;
  item: WordCloudItem;
  x: number;
  y: number;
  rotate: number;
  font: number;
  color: string;
  /** Estimated bounding box half-width / half-height. */
  hw: number;
  hh: number;
}

function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return (s >>> 8) / 0x1000000;
  };
}

/* Approximate word bounding box. Latin glyphs roughly 0.55em wide. */
function estimateBox(text: string, font: number, rotate: number) {
  const w = Math.max(font, text.length * font * 0.55) + 6;
  const h = font + 6;
  if (rotate === 90 || rotate === -90) return { hw: h / 2, hh: w / 2 };
  return { hw: w / 2, hh: h / 2 };
}

function intersects(a: Placed, b: Placed): boolean {
  return !(
    a.x + a.hw < b.x - b.hw ||
    a.x - a.hw > b.x + b.hw ||
    a.y + a.hh < b.y - b.hh ||
    a.y - a.hh > b.y + b.hh
  );
}

const placed = computed<Placed[]>(() => {
  const rng = makeRng(props.seed);
  const items = [...props.items].sort((a, b) => b.weight - a.weight);
  const wMin = Math.min(...items.map((i) => i.weight));
  const wMax = Math.max(...items.map((i) => i.weight));
  const span = wMax - wMin || 1;

  const out: Placed[] = [];
  const cx = props.width / 2;
  const cy = props.height / 2;

  items.forEach((item, i) => {
    const t = (item.weight - wMin) / span;
    const font = props.minFont + t * (props.maxFont - props.minFont);
    const rotate = item.rotate ?? (rng() < props.rotateRatio ? 90 : 0);
    const color = item.color ?? props.palette[i % props.palette.length];
    const { hw, hh } = estimateBox(item.text, font, rotate);

    /* archimedean spiral seeded from center */
    let angle = rng() * Math.PI * 2;
    let radius = 0;
    const step = props.spiralStep;
    const maxAttempts = 800;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      const candidate: Placed = { index: i, item, x, y, rotate, font, color, hw, hh };
      const clipped = x - hw < 4 || x + hw > props.width - 4 || y - hh < 4 || y + hh > props.height - 4;
      if (!clipped && !out.some((p) => intersects(candidate, p))) {
        out.push(candidate);
        return;
      }
      angle += 0.35;
      radius += step * 0.05;
    }
    /* could not place: drop without crashing */
  });

  return out;
});

const hovered = ref<number | null>(null);
function onEnter(p: Placed) {
  hovered.value = p.index;
  emit('hover', { index: p.index, item: p.item });
}
function onLeave() {
  hovered.value = null;
  emit('hover', null);
}
function onClick(p: Placed) {
  emit('select', { index: p.index, item: p.item });
}
</script>

<template>
  <figure :class="['cf-wordcloud', `cf-wordcloud--${size}`]">
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      :width="width"
      :height="height"
      :aria-label="ariaLabel ?? '词云'"
      role="img"
    >
      <g class="cf-wordcloud__words">
        <text
          v-for="p in placed"
          :key="p.index"
          :x="p.x"
          :y="p.y"
          :font-size="p.font"
          :fill="p.color"
          :opacity="hovered === null || hovered === p.index ? 1 : 0.35"
          :transform="p.rotate ? `rotate(${p.rotate} ${p.x} ${p.y})` : undefined"
          text-anchor="middle"
          dominant-baseline="middle"
          class="cf-wordcloud__word"
          tabindex="0"
          :aria-label="`${p.item.text}: ${p.item.weight}`"
          @mouseenter="onEnter(p)"
          @mouseleave="onLeave"
          @click="onClick(p)"
        >{{ p.item.text }}</text>
      </g>
    </svg>
  </figure>
</template>
