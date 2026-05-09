<script setup lang="ts">
import { CfScrollArea } from '@chufix/vue';

const rows = Array.from({ length: 18 }, (_, r) => r);
const cols = Array.from({ length: 12 }, (_, c) => c);
</script>

<template>
  <CfScrollArea bordered axis="both" :max-width="420" :max-height="200">
    <div style="display: grid; grid-auto-flow: row; padding: 8px;">
      <div
        v-for="r in rows"
        :key="r"
        style="display: grid; grid-template-columns: repeat(12, 80px); gap: 4px;"
      >
        <div
          v-for="c in cols"
          :key="c"
          style="background: var(--bg-2); border: 1px solid var(--line-1); padding: 6px 8px; font-size: 12px; border-radius: 4px;"
        >R{{ r + 1 }}·C{{ c + 1 }}</div>
      </div>
    </div>
  </CfScrollArea>
</template>
