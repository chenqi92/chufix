<script setup lang="ts">
import { CfTitleBar } from '@chufix/vue';
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <div style="border: 1px solid var(--line-1); border-radius: var(--r-6); overflow: hidden;">
      <CfTitleBar platform="macos" title="orders.parquet" subtitle="protoforge" :modified="true" />
      <div style="padding: 16px; color: var(--fg-3);">macOS · centered title</div>
    </div>
    <div style="border: 1px solid var(--line-1); border-radius: var(--r-6); overflow: hidden;">
      <CfTitleBar platform="windows" title="orders.parquet" subtitle="protoforge" />
      <div style="padding: 16px; color: var(--fg-3);">Windows · min / max / close</div>
    </div>
  </div>
</template>
