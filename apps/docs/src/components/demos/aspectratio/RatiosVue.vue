<script setup lang="ts">
import { CfAspectRatio } from '@chufix/vue';

const ratios = [
  { ratio: 21 / 9, label: '21 / 9（影院）', from: 'oklch(70% 0.15 220)', to: 'oklch(60% 0.18 280)' },
  { ratio: 16 / 9, label: '16 / 9（视频）', from: 'oklch(70% 0.16 200)', to: 'oklch(60% 0.18 240)' },
  { ratio: 4 / 3, label: '4 / 3（旧屏）', from: 'oklch(70% 0.15 30)', to: 'oklch(60% 0.18 60)' },
  { ratio: 1, label: '1 / 1（方形）', from: 'oklch(70% 0.15 140)', to: 'oklch(60% 0.18 180)' },
  { ratio: 3 / 4, label: '3 / 4（人像）', from: 'oklch(70% 0.16 320)', to: 'oklch(60% 0.18 350)' },
  { ratio: 9 / 16, label: '9 / 16（短视频）', from: 'oklch(70% 0.15 60)', to: 'oklch(60% 0.18 90)' },
];
</script>

<template>
  <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
    <div v-for="r in ratios" :key="r.label">
      <CfAspectRatio :ratio="r.ratio">
        <div :style="{
          background: `linear-gradient(135deg, ${r.from}, ${r.to})`,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px',
        }">{{ r.label }}</div>
      </CfAspectRatio>
    </div>
  </div>
</template>
