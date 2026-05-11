<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  clampZoom,
  defaultMapViewport,
  toneClass,
  type MapCanvasEvent,
  type MapCoord,
  type MapMarkerEvent,
  type MapOverlayEvent,
  type MapProps,
  type MapViewport,
} from './variants';

const props = withDefaults(defineProps<MapProps>(), {
  markers: () => [],
  overlays: () => [],
  routes: () => [],
  height: 360,
  center: () => defaultMapViewport.center,
  zoom: defaultMapViewport.zoom,
  minZoom: 0.7,
  maxZoom: 2.4,
  showGrid: true,
  showLabels: true,
  controls: true,
  ariaLabel: '交互地图',
});

const emit = defineEmits<{
  markerClick: [payload: MapMarkerEvent];
  markerEnter: [payload: MapMarkerEvent];
  markerLeave: [payload: MapMarkerEvent];
  overlayClick: [payload: MapOverlayEvent];
  mapClick: [payload: MapCanvasEvent];
  viewportChange: [payload: MapViewport];
}>();

const center = ref<MapCoord>({ ...props.center });
const zoom = ref(clampZoom(props.zoom, props.minZoom, props.maxZoom));

watch(
  () => props.center,
  (next) => {
    center.value = { ...next };
  },
  { deep: true },
);

watch(
  () => props.zoom,
  (next) => {
    zoom.value = clampZoom(next, props.minZoom, props.maxZoom);
  },
);

const heightStyle = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height,
);

const viewportTransform = computed(() => {
  const z = zoom.value;
  const x = 50 - center.value.x * z;
  const y = 50 - center.value.y * z;
  return `translate(${x} ${y}) scale(${z})`;
});

function polyline(points: MapCoord[]) {
  return points.map((p) => `${p.x},${p.y}`).join(' ');
}

function overlayPath(points: MapCoord[]) {
  if (!points.length) return '';
  const [first, ...rest] = points;
  return `M ${first.x} ${first.y} ${rest.map((p) => `L ${p.x} ${p.y}`).join(' ')} Z`;
}

function notifyViewport() {
  emit('viewportChange', {
    center: { ...center.value },
    zoom: zoom.value,
  });
}

function setZoom(next: number) {
  const clamped = clampZoom(next, props.minZoom, props.maxZoom);
  if (clamped === zoom.value) return;
  zoom.value = clamped;
  notifyViewport();
}

function resetViewport() {
  center.value = { ...props.center };
  zoom.value = clampZoom(props.zoom, props.minZoom, props.maxZoom);
  notifyViewport();
}

function toMapPoint(event: MouseEvent, svg: SVGSVGElement): MapCoord {
  const matrix = svg.getScreenCTM();
  if (!matrix) return { x: 50, y: 50 };
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  const local = point.matrixTransform(matrix.inverse());
  return {
    x: (local.x - (50 - center.value.x * zoom.value)) / zoom.value,
    y: (local.y - (50 - center.value.y * zoom.value)) / zoom.value,
  };
}

function onMapClick(event: MouseEvent) {
  emit('mapClick', {
    point: toMapPoint(event, event.currentTarget as SVGSVGElement),
    nativeEvent: event,
  });
}

function onMarkerClick(marker: MapMarkerEvent['marker'], event: MouseEvent | KeyboardEvent) {
  if (marker.disabled) return;
  event.stopPropagation();
  emit('markerClick', { marker, nativeEvent: event });
}

function onOverlayClick(overlay: MapOverlayEvent['overlay'], event: MouseEvent | KeyboardEvent) {
  if (!overlay.interactive) return;
  event.stopPropagation();
  emit('overlayClick', { overlay, nativeEvent: event });
}

function onKeyActivate(event: KeyboardEvent, handler: (event: KeyboardEvent) => void) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  handler(event);
}
</script>

<template>
  <section class="cf-map" :style="{ '--cf-map-height': heightStyle }" :aria-label="ariaLabel">
    <svg
      class="cf-map__canvas"
      viewBox="0 0 100 100"
      role="img"
      :aria-label="ariaLabel"
      @click="onMapClick"
    >
      <defs>
        <pattern id="cf-map-grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" class="cf-map__grid-line" fill="none" />
        </pattern>
      </defs>
      <rect class="cf-map__water" x="0" y="0" width="100" height="100" rx="2" />
      <rect v-if="showGrid" class="cf-map__grid" x="0" y="0" width="100" height="100" fill="url(#cf-map-grid)" />

      <g :transform="viewportTransform">
        <path class="cf-map__land cf-map__land--primary" d="M10 22 C20 8 41 11 53 18 C68 27 83 21 91 36 C99 51 86 75 67 81 C47 88 24 82 14 67 C4 52 0 34 10 22Z" />
        <path class="cf-map__land cf-map__land--secondary" d="M18 66 C26 56 38 59 45 66 C51 74 62 72 69 78 C58 90 27 88 18 66Z" />

        <path
          v-for="overlay in overlays"
          :key="overlay.id"
          :class="['cf-map__overlay', toneClass(overlay.tone, 'cf-map__overlay'), overlay.interactive && 'is-interactive', overlay.id === activeId && 'is-active']"
          :d="overlayPath(overlay.points)"
          :tabindex="overlay.interactive ? 0 : undefined"
          :role="overlay.interactive ? 'button' : 'img'"
          :aria-label="overlay.label"
          @click="(event) => onOverlayClick(overlay, event)"
          @keydown="(event) => onKeyActivate(event, (e) => onOverlayClick(overlay, e))"
        />

        <polyline
          v-for="route in routes"
          :key="route.id"
          :class="['cf-map__route', toneClass(route.tone, 'cf-map__route'), route.dashed && 'is-dashed']"
          :points="polyline(route.points)"
          fill="none"
        />

        <g
          v-for="marker in markers"
          :key="marker.id"
          :class="['cf-map__marker', toneClass(marker.tone, 'cf-map__marker'), marker.id === activeId && 'is-active', marker.disabled && 'is-disabled']"
          :transform="`translate(${marker.x} ${marker.y})`"
          :tabindex="marker.disabled ? undefined : 0"
          role="button"
          :aria-label="marker.label"
          @click="(event) => onMarkerClick(marker, event)"
          @mouseenter="(event) => emit('markerEnter', { marker, nativeEvent: event })"
          @mouseleave="(event) => emit('markerLeave', { marker, nativeEvent: event })"
          @keydown="(event) => onKeyActivate(event, (e) => onMarkerClick(marker, e))"
        >
          <circle class="cf-map__marker-halo" r="4.8" />
          <circle class="cf-map__marker-dot" r="2.2" />
          <text v-if="showLabels" class="cf-map__marker-label" x="0" y="-6">{{ marker.label }}</text>
          <text v-if="marker.value != null" class="cf-map__marker-value" x="0" y="8">{{ marker.value }}</text>
        </g>
      </g>
    </svg>

    <div v-if="controls" class="cf-map__controls" aria-label="地图缩放">
      <button type="button" class="cf-map__control" aria-label="放大" @click="setZoom(zoom + 0.2)">+</button>
      <button type="button" class="cf-map__control" aria-label="缩小" @click="setZoom(zoom - 0.2)">−</button>
      <button type="button" class="cf-map__control cf-map__control--reset" aria-label="重置视图" @click="resetViewport">Reset</button>
    </div>
  </section>
</template>
