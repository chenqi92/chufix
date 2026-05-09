<script setup lang="ts">
import type { ChartCrosshairProps } from './variants';

withDefaults(defineProps<ChartCrosshairProps>(), {
  visible: true,
  showVertical: true,
  showHorizontal: false,
});
</script>

<template>
  <g v-if="visible && x != null" class="cf-crosshair" pointer-events="none">
    <line
      v-if="showVertical"
      class="cf-crosshair__line"
      :x1="x"
      :x2="x"
      :y1="0"
      :y2="height"
    />
    <line
      v-if="showHorizontal && y != null"
      class="cf-crosshair__line"
      :x1="0"
      :x2="width"
      :y1="y"
      :y2="y"
    />
    <g v-if="tooltip && y != null" class="cf-crosshair__tip" :transform="`translate(${x + 6} ${y - 18})`">
      <rect width="80" height="22" rx="3" />
      <text x="6" y="14">{{ tooltip }}</text>
    </g>
  </g>
</template>
