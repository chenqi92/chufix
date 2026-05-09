<script setup lang="ts">
import { CfScrollArea } from '@chufix/vue';

const items = Array.from({ length: 30 }, (_, i) => `第 ${i + 1} 项 — Lorem ipsum dolor sit amet, consectetur adipiscing elit.`);
</script>

<template>
  <CfScrollArea bordered :max-height="200" :max-width="420">
    <ul style="margin: 0; padding: 8px 12px; list-style: none;">
      <li
        v-for="(text, i) in items"
        :key="i"
        style="padding: 6px 0; border-bottom: 1px solid var(--line-1); font-size: 13px;"
      >{{ text }}</li>
    </ul>
  </CfScrollArea>
</template>
