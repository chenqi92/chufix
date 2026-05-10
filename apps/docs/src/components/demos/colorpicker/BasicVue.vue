<script setup lang="ts">
import { ref } from 'vue';
import { CfColorPicker } from '@chufix-design/vue';

const value = ref('#3b82f6');
</script>

<template>
  <div style="display: flex; gap: 16px; align-items: center;">
    <CfColorPicker v-model="value" />
    <span
      style="
        display: inline-block;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        box-shadow: inset 0 0 0 1px var(--line-1);
      "
      :style="{ background: value }"
    />
    <code style="font-size: 12px;">{{ value }}</code>
  </div>
</template>
