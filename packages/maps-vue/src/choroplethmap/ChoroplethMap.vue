<script setup lang="ts" generic="T extends ChoroplethDatum">
import { computed, inject, ref } from 'vue';
import {
  computeDomain,
  computeExtent,
  polygonToFitPath,
  polygonToProjectedPath,
  projectFit,
  resolveColorScale,
  type ChoroplethDatum,
  type ChoroplethMapProps,
} from './variants';
import type { GeoJsonFeature } from '../mapminimap/variants';
import { MAPTILE_CONTEXT_KEY } from '../maptile/variants';

const props = withDefaults(defineProps<ChoroplethMapProps>(), {
  width: 480,
  height: 280,
  idField: 'id',
  nameField: 'name',
  tooltip: true,
  legend: true,
});

const ctx = inject(MAPTILE_CONTEXT_KEY, null);
const liveViewport = computed(() => ctx?.());
const insideTile = computed(() => !!liveViewport.value);

const features = computed(() => props.geojson?.features ?? []);
const extent = computed(() => props.extent ?? computeExtent(features.value));
const domain = computed(() => props.domain ?? computeDomain(props.data));
const scaleFn = computed(() => resolveColorScale(props.colorScale));

const w = computed(() => (insideTile.value ? liveViewport.value!.viewport.width : props.width));
const h = computed(() => (insideTile.value ? liveViewport.value!.viewport.height : props.height));

const customProject = computed<((lng: number, lat: number) => { x: number; y: number }) | null>(() => {
  if (props.projection) return props.projection;
  if (liveViewport.value) return liveViewport.value.project;
  return null;
});

const dataIndex = computed(() => {
  const m = new Map<string, ChoroplethDatum>();
  for (const d of props.data) m.set(String(d.id), d);
  return m;
});

const regions = computed(() => {
  return features.value.map((f, i) => {
    const geom = (f as GeoJsonFeature).geometry;
    const multi = geom.type === 'MultiPolygon';
    const d = customProject.value
      ? polygonToProjectedPath(geom.coordinates as never, multi, customProject.value)
      : polygonToFitPath(
          geom.coordinates as never,
          multi,
          extent.value,
          w.value,
          h.value,
        );
    const propsObj = (f as GeoJsonFeature).properties ?? {};
    const idVal = propsObj[props.idField];
    const datum = idVal != null ? dataIndex.value.get(String(idVal)) : undefined;
    const fill = datum
      ? scaleFn.value(datum.value, domain.value)
      : 'oklch(from var(--bg-2) l c h / 0.6)';
    const name = (datum?.name ?? propsObj[props.nameField] ?? idVal ?? '') as string | number;
    return { id: i, d, fill, name: String(name), value: datum?.value };
  });
});

const hover = ref<{ x: number; y: number; name: string; value?: number } | null>(null);

function onEnter(e: PointerEvent, r: { name: string; value?: number }) {
  if (!props.tooltip) return;
  const target = e.currentTarget as SVGElement;
  const rect = target.ownerSVGElement?.getBoundingClientRect();
  hover.value = {
    x: rect ? e.clientX - rect.left : e.offsetX,
    y: rect ? e.clientY - rect.top : e.offsetY,
    name: r.name,
    value: r.value,
  };
}

function onMove(e: PointerEvent) {
  if (!hover.value) return;
  const target = e.currentTarget as SVGElement;
  const rect = target.ownerSVGElement?.getBoundingClientRect();
  if (!rect) return;
  hover.value = { ...hover.value, x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function onLeave() {
  hover.value = null;
}

const legendStops = computed(() => {
  const fn = scaleFn.value;
  const [min, max] = domain.value;
  const steps = 12;
  return Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    return { offset: `${(t * 100).toFixed(2)}%`, color: fn(min + (max - min) * t, [min, max]) };
  });
});

function fmt(v: number | undefined) {
  if (v == null || !Number.isFinite(v)) return '—';
  return `${v}${props.unit ?? ''}`;
}
</script>

<template>
  <div
    class="cf-choroplethmap"
    :class="insideTile ? 'cf-choroplethmap--layer' : 'cf-choroplethmap--standalone'"
  >
    <svg
      class="cf-choroplethmap__svg"
      :viewBox="`0 0 ${w} ${h}`"
      :width="insideTile ? undefined : w"
      :height="insideTile ? undefined : h"
      role="img"
      aria-label="分级填色地图"
      @pointerleave="onLeave"
    >
      <path
        v-for="r in regions"
        :key="r.id"
        class="cf-choroplethmap__region"
        :d="r.d"
        :fill="r.fill"
        :data-name="r.name"
        @pointerenter="(e) => onEnter(e, r)"
        @pointermove="onMove"
      />
    </svg>
    <div
      v-if="tooltip && hover"
      class="cf-choroplethmap__tooltip"
      :style="{ left: hover.x + 'px', top: hover.y + 'px' }"
      role="tooltip"
    >
      <span class="cf-choroplethmap__tooltip-name">{{ hover.name }}</span>
      <span class="cf-choroplethmap__tooltip-value">{{ fmt(hover.value) }}</span>
    </div>
    <div v-if="legend" class="cf-choroplethmap__legend">
      <span class="cf-choroplethmap__legend-min">{{ fmt(domain[0]) }}</span>
      <span class="cf-choroplethmap__legend-bar" aria-hidden="true">
        <span
          v-for="(s, i) in legendStops"
          :key="i"
          class="cf-choroplethmap__legend-stop"
          :style="{ background: s.color }"
        />
      </span>
      <span class="cf-choroplethmap__legend-max">{{ fmt(domain[1]) }}</span>
    </div>
  </div>
</template>
