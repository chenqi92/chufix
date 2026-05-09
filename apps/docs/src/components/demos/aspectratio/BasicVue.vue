<script setup lang="ts">
import { CfAspectRatio } from '@chufix/vue';
</script>

<template>
  <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
    <div>
      <CfAspectRatio :ratio="16 / 9">
        <div style="background: linear-gradient(135deg, oklch(70% 0.15 220), oklch(60% 0.18 280)); border-radius: 8px; display:flex; align-items:center; justify-content:center; color: white; font-size: 12px;">16 / 9</div>
      </CfAspectRatio>
    </div>
    <div>
      <CfAspectRatio :ratio="4 / 3">
        <div style="background: linear-gradient(135deg, oklch(70% 0.15 30), oklch(60% 0.18 60)); border-radius: 8px; display:flex; align-items:center; justify-content:center; color: white; font-size: 12px;">4 / 3</div>
      </CfAspectRatio>
    </div>
    <div>
      <CfAspectRatio :ratio="1">
        <div style="background: linear-gradient(135deg, oklch(70% 0.15 140), oklch(60% 0.18 180)); border-radius: 8px; display:flex; align-items:center; justify-content:center; color: white; font-size: 12px;">1 / 1</div>
      </CfAspectRatio>
    </div>
  </div>
</template>
