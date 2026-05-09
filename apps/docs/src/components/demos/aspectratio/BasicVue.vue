<script setup lang="ts">
import { CfAspectRatio } from '@chufix/vue';
</script>

<template>
  <div style="max-width: 320px;">
    <CfAspectRatio :ratio="16 / 9">
      <div style="background: linear-gradient(135deg, oklch(70% 0.15 220), oklch(60% 0.18 280)); border-radius: 8px; display:flex; align-items:center; justify-content:center; color: white; font-size: 14px;">16 / 9</div>
    </CfAspectRatio>
  </div>
</template>
