<script setup lang="ts">
import { CfVirtualGrid } from '@chufix-design/vue';

const items = Array.from({ length: 5000 }, (_, i) => ({
  id: i,
  color: `oklch(70% 0.12 ${(i * 17) % 360})`,
}));
</script>

<template>
  <CfVirtualGrid
    :items="items"
    :item-height="120"
    :min-column-width="120"
    :gap="8"
    :height="360"
    :item-key="(it) => it.id"
  >
    <template #default="{ item }">
      <div class="demo-tile" :style="{ background: item.color }">#{{ item.id + 1 }}</div>
    </template>
  </CfVirtualGrid>
</template>

<style scoped>
.demo-tile { display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-weight: 600; border-radius: var(--r-4); }
</style>
