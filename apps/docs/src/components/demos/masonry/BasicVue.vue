<script setup lang="ts">
import { CfMasonry } from '@chufix-design/vue';

const heights = [120, 80, 160, 100, 140, 180, 90, 130, 110, 170, 95, 150, 125];
const palette = ['#5b8def', '#52c41a', '#fa8c16', '#eb2f96', '#13c2c2', '#722ed1'];
</script>

<template>
  <CfMasonry :min-column-width="160" :gap="8">
    <div
      v-for="(h, i) in heights"
      :key="i"
      class="demo-card"
      :style="{ height: `${h}px`, background: palette[i % palette.length] }"
    >#{{ i + 1 }} · {{ h }}px</div>
  </CfMasonry>
</template>

<style scoped>
.demo-card { display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; border-radius: var(--r-4); }
</style>
