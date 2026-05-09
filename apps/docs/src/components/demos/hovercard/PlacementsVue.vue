<script setup lang="ts">
import { CfHoverCard } from '@chufix/vue';
const placements = ['top', 'bottom', 'left', 'right'] as const;
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; padding: 60px 16px;">
    <CfHoverCard v-for="p in placements" :key="p" :placement="p" :open-delay="200">
      <span style="background: var(--bg-2); padding: 6px 10px; border-radius: var(--r-3); cursor: pointer; text-align: center; display: inline-block;">{{ p }}</span>
      <template #content>
        <div style="padding: 4px 0;">
          <div style="font-weight: 500; color: var(--fg-1);">{{ p }} 弹出</div>
          <div style="font-size: 12px; color: var(--fg-2); margin-top: 2px;">200ms 延迟</div>
        </div>
      </template>
    </CfHoverCard>
  </div>
</template>
