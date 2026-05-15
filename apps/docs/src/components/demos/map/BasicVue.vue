<script setup lang="ts">
import { ref } from 'vue';
import { CfBadge } from '@chufix-design/vue';
import {
  CfMap,
  type MapCanvasEvent,
  type MapMarkerEvent,
  type MapOverlayEvent,
  type MapViewport,
} from '@chufix-design/maps-vue';

const activeId = ref('edge-a');
const lastEvent = ref('点击地图、标记或区域后，这里会显示事件 payload。');

const markers = [
  { id: 'edge-a', label: 'Edge A', x: 24, y: 34, tone: 'success' as const, value: '99%' },
  { id: 'dc-core', label: 'Core', x: 52, y: 46, tone: 'info' as const, value: '12ms' },
  { id: 'edge-b', label: 'Edge B', x: 72, y: 38, tone: 'warning' as const, value: '3 alerts' },
  { id: 'backup', label: 'Backup', x: 42, y: 74, tone: 'default' as const, value: 'idle' },
];

const overlays = [
  {
    id: 'zone-north',
    label: '北区覆盖层',
    tone: 'info' as const,
    interactive: true,
    points: [
      { x: 18, y: 20 },
      { x: 56, y: 18 },
      { x: 60, y: 48 },
      { x: 28, y: 55 },
    ],
  },
  {
    id: 'zone-risk',
    label: '风险区域',
    tone: 'warning' as const,
    interactive: true,
    points: [
      { x: 61, y: 30 },
      { x: 84, y: 38 },
      { x: 78, y: 62 },
      { x: 58, y: 56 },
    ],
  },
];

const routes = [
  {
    id: 'primary-link',
    tone: 'success' as const,
    points: [
      { x: 24, y: 34 },
      { x: 52, y: 46 },
      { x: 72, y: 38 },
    ],
  },
  {
    id: 'backup-link',
    tone: 'warning' as const,
    dashed: true,
    points: [
      { x: 24, y: 34 },
      { x: 42, y: 74 },
      { x: 72, y: 38 },
    ],
  },
];

function onMarkerClick(event: MapMarkerEvent) {
  activeId.value = event.marker.id;
  lastEvent.value = `marker-click: ${event.marker.label} / ${event.marker.value ?? '-'}`;
}

function onOverlayClick(event: MapOverlayEvent) {
  activeId.value = event.overlay.id;
  lastEvent.value = `overlay-click: ${event.overlay.label} / ${event.overlay.points.length} points`;
}

function onMapClick(event: MapCanvasEvent) {
  lastEvent.value = `map-click: x=${event.point.x.toFixed(1)}, y=${event.point.y.toFixed(1)}`;
}

function onViewportChange(viewport: MapViewport) {
  lastEvent.value = `viewport-change: zoom=${viewport.zoom.toFixed(1)}, center=${viewport.center.x},${viewport.center.y}`;
}
</script>

<template>
  <div class="map-demo">
    <CfMap
      :markers="markers"
      :overlays="overlays"
      :routes="routes"
      :active-id="activeId"
      :height="540"
      @marker-click="onMarkerClick"
      @overlay-click="onOverlayClick"
      @map-click="onMapClick"
      @viewport-change="onViewportChange"
    />
    <div class="map-demo__status">
      <CfBadge tone="info" :content="activeId" />
      <code>{{ lastEvent }}</code>
    </div>
  </div>
</template>

<style scoped>
.map-demo {
  display: grid;
  gap: 12px;
  width: 100%;
}
.map-demo__status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.map-demo__status code {
  white-space: normal;
}
</style>
