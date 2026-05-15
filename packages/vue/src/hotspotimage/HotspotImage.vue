<script setup lang="ts">
import { ref } from 'vue';
import { type HotspotItem, toneStroke, toneFill } from './variants';

defineProps<{
  src: string;
  alt?: string;
  hotspots: HotspotItem[];
  showOutlines?: boolean;
}>();

const emit = defineEmits<{
  (e: 'hotspot-click', hotspot: HotspotItem, ev: MouseEvent): void;
  (e: 'hotspot-hover', hotspot: HotspotItem | null): void;
}>();

const hovered = ref<string | null>(null);

function onEnter(item: HotspotItem) {
  hovered.value = item.id;
  emit('hotspot-hover', item);
}
function onLeave() {
  hovered.value = null;
  emit('hotspot-hover', null);
}

function labelLeft(h: HotspotItem): number {
  if (h.shape === 'rect' && h.rect) return h.rect.x + h.rect.w / 2;
  if (h.shape === 'circle' && h.circle) return h.circle.cx;
  return 0.5;
}
function labelTop(h: HotspotItem): number {
  if (h.shape === 'rect' && h.rect) return h.rect.y;
  if (h.shape === 'circle' && h.circle) return h.circle.cy - h.circle.r;
  return 0;
}
</script>

<template>
  <div class="cf-hotspot">
    <img :src="src" :alt="alt ?? ''" class="cf-hotspot__img" draggable="false" />
    <svg
      class="cf-hotspot__overlay"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g
        v-for="h in hotspots"
        :key="h.id"
        class="cf-hotspot__group"
        :class="{ 'is-hovered': hovered === h.id, 'is-outlined': showOutlines }"
        @click="(e) => emit('hotspot-click', h, e)"
        @pointerenter="() => onEnter(h)"
        @pointerleave="onLeave"
      >
        <rect
          v-if="h.shape === 'rect' && h.rect"
          :x="h.rect.x * 100"
          :y="h.rect.y * 100"
          :width="h.rect.w * 100"
          :height="h.rect.h * 100"
          :stroke="toneStroke(h.tone)"
          :fill="toneFill(h.tone)"
          rx="0.5"
        />
        <circle
          v-else-if="h.shape === 'circle' && h.circle"
          :cx="h.circle.cx * 100"
          :cy="h.circle.cy * 100"
          :r="h.circle.r * 100"
          :stroke="toneStroke(h.tone)"
          :fill="toneFill(h.tone)"
        />
      </g>
    </svg>
    <template v-for="h in hotspots" :key="`label-${h.id}`">
      <div
        v-if="hovered === h.id && h.label"
        class="cf-hotspot__label"
        :style="{
          left: `${labelLeft(h) * 100}%`,
          top: `${labelTop(h) * 100}%`,
        }"
      >{{ h.label }}</div>
    </template>
  </div>
</template>
