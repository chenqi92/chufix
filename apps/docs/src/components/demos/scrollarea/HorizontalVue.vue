<script setup lang="ts">
import { CfScrollArea } from '@chufix-design/vue';

const tags = Array.from({ length: 24 }, (_, i) => `tag-${i + 1}`);
</script>

<template>
  <CfScrollArea bordered axis="x" :max-width="420">
    <div style="display: flex; gap: 6px; padding: 8px 12px; white-space: nowrap;">
      <span
        v-for="tag in tags"
        :key="tag"
        style="background: var(--bg-2); border: 1px solid var(--line-1); padding: 2px 10px; border-radius: 999px; font-size: 12px;"
      >{{ tag }}</span>
    </div>
  </CfScrollArea>
</template>
