<script setup lang="ts">
import { computed, ref } from 'vue';
import type {
  MarimekkoColumn,
  MarimekkoHoverPayload,
  MarimekkoProps,
  MarimekkoSegment,
} from './variants';

const props = withDefaults(defineProps<MarimekkoProps>(), {
  height: 320,
  showColumnLabels: true,
  showSegmentLabels: true,
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
  (e: 'hover', p: MarimekkoHoverPayload | null): void;
  (e: 'select', p: MarimekkoHoverPayload): void;
}>();

const PAD_L = 12;
const PAD_R = 12;
const PAD_T = 24;
const PAD_B = 28;

const innerW = ref(560);
function setWidth(el: SVGSVGElement | null) {
  if (el) innerW.value = Math.max(280, el.clientWidth);
}

const columnTotals = computed(() => props.columns.map((c) => c.segments.reduce((s, x) => s + x.value, 0)));
const grandTotal = computed(() => columnTotals.value.reduce((a, b) => a + b, 0));

interface Cell {
  ci: number;
  si: number;
  column: MarimekkoColumn;
  segment: MarimekkoSegment;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  columnShare: number;
  segmentShare: number;
  cellShare: number;
}

const chartW = computed(() => innerW.value - PAD_L - PAD_R);
const chartH = computed(() => props.height - PAD_T - PAD_B);

const cells = computed<Cell[]>(() => {
  const out: Cell[] = [];
  let x = PAD_L;
  props.columns.forEach((col, ci) => {
    const colT = columnTotals.value[ci] || 1;
    const colShare = grandTotal.value ? colT / grandTotal.value : 0;
    const w = chartW.value * colShare;
    let y = PAD_T;
    col.segments.forEach((seg, si) => {
      const segShare = seg.value / colT;
      const h = chartH.value * segShare;
      out.push({
        ci,
        si,
        column: col,
        segment: seg,
        x,
        y,
        w,
        h,
        color: seg.color ?? props.palette[si % props.palette.length],
        columnShare: colShare,
        segmentShare: segShare,
        cellShare: grandTotal.value ? seg.value / grandTotal.value : 0,
      });
      y += h;
    });
    x += w;
  });
  return out;
});

const hovered = ref<{ ci: number; si: number } | null>(null);

function onEnter(c: Cell) {
  hovered.value = { ci: c.ci, si: c.si };
  emit('hover', payloadOf(c));
}
function onLeave() {
  hovered.value = null;
  emit('hover', null);
}
function onClick(c: Cell) {
  emit('select', payloadOf(c));
}

function payloadOf(c: Cell): MarimekkoHoverPayload {
  return {
    column: c.column,
    segment: c.segment,
    columnShare: c.columnShare,
    segmentShare: c.segmentShare,
    cellShare: c.cellShare,
  };
}

function fmt(c: Cell): string {
  if (props.format) return props.format(c.segment.value, c.segment, c.column);
  return c.segment.value.toLocaleString();
}

function isDim(c: Cell): boolean {
  if (!hovered.value) return false;
  return hovered.value.ci !== c.ci || hovered.value.si !== c.si;
}

function colCenterX(ci: number): number {
  let x = PAD_L;
  for (let i = 0; i < ci; i++) {
    const t = columnTotals.value[i] || 1;
    x += chartW.value * (grandTotal.value ? t / grandTotal.value : 0);
  }
  const t = columnTotals.value[ci] || 1;
  return x + (chartW.value * (grandTotal.value ? t / grandTotal.value : 0)) / 2;
}
</script>

<template>
  <figure :class="['cf-marimekko', `cf-marimekko--${size}`]">
    <svg
      :viewBox="`0 0 ${innerW} ${height}`"
      preserveAspectRatio="none"
      :height="height"
      :ref="(el) => setWidth(el as SVGSVGElement | null)"
      :aria-label="ariaLabel ?? '马赛克图'"
      role="img"
    >
      <g class="cf-marimekko__cells">
        <g
          v-for="c in cells"
          :key="`${c.ci}-${c.si}`"
          class="cf-marimekko__cell"
          :class="{ 'is-dim': isDim(c) }"
          @mouseenter="onEnter(c)"
          @mouseleave="onLeave"
          @click="onClick(c)"
        >
          <rect
            :x="c.x"
            :y="c.y"
            :width="Math.max(0, c.w - 1)"
            :height="Math.max(0, c.h - 1)"
            :fill="c.color"
            tabindex="0"
            :aria-label="`${c.column.label} · ${c.segment.label}: ${fmt(c)}`"
          />
          <text
            v-if="showSegmentLabels && c.w > 56 && c.h > 22"
            :x="c.x + c.w / 2"
            :y="c.y + c.h / 2"
            class="cf-marimekko__seg-label"
            text-anchor="middle"
            dominant-baseline="middle"
          >{{ c.segment.label }}</text>
        </g>
      </g>

      <g v-if="showColumnLabels" class="cf-marimekko__col-labels">
        <text
          v-for="(col, ci) in columns"
          :key="ci"
          :x="colCenterX(ci)"
          :y="PAD_T - 8"
          class="cf-marimekko__col-label"
          text-anchor="middle"
        >{{ col.label }}</text>
        <text
          v-for="(col, ci) in columns"
          :key="`pct-${ci}`"
          :x="colCenterX(ci)"
          :y="height - PAD_B + 16"
          class="cf-marimekko__col-pct"
          text-anchor="middle"
        >{{ Math.round((grandTotal ? columnTotals[ci] / grandTotal : 0) * 100) }}%</text>
      </g>
    </svg>
    <figcaption v-if="hovered" class="cf-marimekko__tip">
      <span class="cf-marimekko__tip-cat">{{ cells[hovered.ci * 1 + 0].column.label }} · {{ cells.find((c) => c.ci === hovered!.ci && c.si === hovered!.si)?.segment.label }}</span>
      <span class="cf-marimekko__tip-row">
        {{ cells.find((c) => c.ci === hovered!.ci && c.si === hovered!.si) ? fmt(cells.find((c) => c.ci === hovered!.ci && c.si === hovered!.si)!) : '' }}
      </span>
      <span class="cf-marimekko__tip-row cf-marimekko__tip-row--muted">
        占该列 {{ Math.round((cells.find((c) => c.ci === hovered!.ci && c.si === hovered!.si)?.segmentShare ?? 0) * 100) }}% · 占总体 {{ Math.round((cells.find((c) => c.ci === hovered!.ci && c.si === hovered!.si)?.cellShare ?? 0) * 100) }}%
      </span>
    </figcaption>
  </figure>
</template>
