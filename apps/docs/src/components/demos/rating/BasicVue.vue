<script setup lang="ts">
import { ref } from 'vue';
import { CfRating } from '@chufix-design/vue';

const value = ref(3);
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 8px; align-items: flex-start;">
    <CfRating v-model="value" />
    <span style="font-size: 12px; color: var(--fg-3);">已选：<code>{{ value }}</code> / 5</span>
  </div>
</template>
