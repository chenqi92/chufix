<script setup lang="ts">
import { computed, onBeforeUnmount, provide, reactive, ref, shallowRef, watch } from 'vue';
import {
  clampLat,
  clampZoom,
  lngLatToTile,
  makeProjection,
  makeUnproject,
  tileScreenRect,
  tilesForViewport,
  TILE_SIZE,
} from './mercator';
import {
  fillTileUrl,
  MAPTILE_CONTEXT_KEY,
  OSM_TILES,
  type LngLat,
  type MapTileContext,
  type MapTileProps,
  type Viewport,
} from './variants';

const props = withDefaults(defineProps<MapTileProps>(), {
  width: 480,
  height: 320,
  zoom: 2,
  minZoom: 0,
  maxZoom: 19,
  showZoomControl: true,
  showAttribution: true,
  staticView: false,
});

const emit = defineEmits<{
  (e: 'update:center', v: LngLat): void;
  (e: 'update:zoom', v: number): void;
  (e: 'move', v: { center: LngLat; zoom: number }): void;
}>();

const state = reactive({
  center: { lng: props.center?.lng ?? 0, lat: clampLat(props.center?.lat ?? 20) } as LngLat,
  zoom: clampZoom(props.zoom, props.minZoom, Math.min(props.maxZoom, props.tileSource?.maxZoom ?? props.maxZoom)),
});

watch(
  () => props.center,
  (c) => {
    if (!c) return;
    state.center = { lng: c.lng, lat: clampLat(c.lat) };
  },
);
watch(
  () => props.zoom,
  (z) => {
    state.zoom = clampZoom(z, props.minZoom, props.maxZoom);
  },
);

const viewport = computed<Viewport>(() => ({
  center: state.center,
  zoom: state.zoom,
  width: props.width,
  height: props.height,
}));

const tiles = computed(() => tilesForViewport(viewport.value, 1));

const tileRects = computed(() =>
  tiles.value.map((t) => {
    const rect = tileScreenRect(viewport.value, t);
    return {
      key: `${t.z}/${t.x}/${t.y}`,
      url: fillTileUrl(
        (props.tileSource ?? OSM_TILES).url,
        t.z,
        t.x,
        t.y,
        (props.tileSource ?? OSM_TILES).subdomains,
      ),
      x: rect.x,
      y: rect.y,
      size: rect.size,
    };
  }),
);

const containerRef = ref<HTMLDivElement | null>(null);
const drag = shallowRef<{ pointerId: number; startX: number; startY: number; startCenter: LngLat } | null>(null);

function onPointerDown(e: PointerEvent) {
  if (props.staticView) return;
  if (e.button !== 0) return;
  containerRef.value?.setPointerCapture(e.pointerId);
  drag.value = {
    pointerId: e.pointerId,
    startX: e.clientX,
    startY: e.clientY,
    startCenter: { ...state.center },
  };
}

function onPointerMove(e: PointerEvent) {
  if (!drag.value || drag.value.pointerId !== e.pointerId) return;
  const dx = e.clientX - drag.value.startX;
  const dy = e.clientY - drag.value.startY;
  const startTile = lngLatToTile(drag.value.startCenter.lng, drag.value.startCenter.lat, state.zoom);
  const newTileX = startTile.x - dx / TILE_SIZE;
  const newTileY = startTile.y - dy / TILE_SIZE;
  const n = Math.pow(2, state.zoom);
  const lng = ((newTileX / n) * 360 - 180 + 540) % 360 - 180;
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * newTileY) / n)));
  const lat = clampLat((latRad * 180) / Math.PI);
  state.center = { lng, lat };
  emit('update:center', state.center);
  emit('move', { center: state.center, zoom: state.zoom });
}

function onPointerUp(e: PointerEvent) {
  if (!drag.value) return;
  if (drag.value.pointerId === e.pointerId) {
    try {
      containerRef.value?.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    drag.value = null;
  }
}

function onWheel(e: WheelEvent) {
  if (props.staticView) return;
  e.preventDefault();
  const rect = containerRef.value?.getBoundingClientRect();
  if (!rect) return;
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const ll = makeUnproject(viewport.value)(x, y);
  const dz = -Math.sign(e.deltaY) * 0.5;
  const newZoom = clampZoom(state.zoom + dz, props.minZoom, Math.min(props.maxZoom, props.tileSource?.maxZoom ?? props.maxZoom));
  if (newZoom === state.zoom) return;
  state.zoom = newZoom;
  // Re-center so the cursor still points at the same lng/lat.
  const after = makeProjection({ ...viewport.value, zoom: newZoom })(ll.lng, ll.lat);
  const offX = after.x - x;
  const offY = after.y - y;
  const center = makeUnproject({ ...viewport.value, zoom: newZoom })(props.width / 2 + offX, props.height / 2 + offY);
  state.center = { lng: center.lng, lat: clampLat(center.lat) };
  emit('update:zoom', state.zoom);
  emit('update:center', state.center);
  emit('move', { center: state.center, zoom: state.zoom });
}

function zoomBy(delta: number) {
  state.zoom = clampZoom(state.zoom + delta, props.minZoom, Math.min(props.maxZoom, props.tileSource?.maxZoom ?? props.maxZoom));
  emit('update:zoom', state.zoom);
  emit('move', { center: state.center, zoom: state.zoom });
}

defineExpose({
  panTo(c: LngLat) {
    state.center = { lng: c.lng, lat: clampLat(c.lat) };
    emit('update:center', state.center);
  },
  zoomTo(z: number) {
    state.zoom = clampZoom(z, props.minZoom, props.maxZoom);
    emit('update:zoom', state.zoom);
  },
  getViewport(): Viewport {
    return viewport.value;
  },
});

const ctx: MapTileContext = reactive({
  viewport: viewport.value,
  project: makeProjection(viewport.value),
  unproject: makeUnproject(viewport.value),
});

watch(viewport, (v) => {
  ctx.viewport = v;
  ctx.project = makeProjection(v);
  ctx.unproject = makeUnproject(v);
});

provide(MAPTILE_CONTEXT_KEY, () => ctx);

onBeforeUnmount(() => {
  drag.value = null;
});
</script>

<template>
  <div
    ref="containerRef"
    class="cf-maptile"
    :class="{ 'is-static': staticView }"
    :style="{ width: width + 'px', height: height + 'px' }"
    role="region"
    aria-label="交互地图"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @wheel="onWheel"
  >
    <div class="cf-maptile__tiles">
      <img
        v-for="t in tileRects"
        :key="t.key"
        class="cf-maptile__tile"
        :src="t.url"
        :style="{
          left: t.x + 'px',
          top: t.y + 'px',
          width: t.size + 'px',
          height: t.size + 'px',
        }"
        draggable="false"
        alt=""
      />
    </div>
    <div class="cf-maptile__overlay">
      <slot />
    </div>
    <div v-if="showZoomControl && !staticView" class="cf-maptile__zoom" role="group" aria-label="缩放控件">
      <button
        type="button"
        class="cf-maptile__zoom-btn"
        aria-label="放大"
        @click="zoomBy(1)"
      >+</button>
      <button
        type="button"
        class="cf-maptile__zoom-btn"
        aria-label="缩小"
        @click="zoomBy(-1)"
      >−</button>
    </div>
    <div
      v-if="showAttribution && (tileSource ?? OSM_TILES).attribution"
      class="cf-maptile__attribution"
      v-html="(tileSource ?? OSM_TILES).attribution"
    />
  </div>
</template>
