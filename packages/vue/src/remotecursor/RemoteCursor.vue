<script setup lang="ts">
import { type RemoteCursorItem, colorForCursor } from './variants';

defineProps<{
  cursors: RemoteCursorItem[];
  positioning?: 'fixed' | 'absolute';
}>();
</script>

<template>
  <div class="cf-rcursor" :class="`cf-rcursor--${positioning ?? 'absolute'}`">
    <div
      v-for="c in cursors"
      :key="c.id"
      class="cf-rcursor__item"
      :style="{
        left: `${c.x}px`,
        top: `${c.y}px`,
        '--cf-rcursor-color': colorForCursor(c),
      }"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" class="cf-rcursor__pointer">
        <path
          d="M5 3l14 8-6 1.5L9 21z"
          fill="currentColor"
          stroke="white"
          stroke-width="1"
          stroke-linejoin="round"
        />
      </svg>
      <span v-if="c.name" class="cf-rcursor__label">{{ c.name }}</span>
    </div>
  </div>
</template>
