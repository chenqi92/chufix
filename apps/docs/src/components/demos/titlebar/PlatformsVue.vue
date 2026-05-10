<script setup lang="ts">
import { CfTitleBar } from '@chufix-design/vue';
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <div style="border: 1px solid var(--line-1); border-radius: var(--r-6); overflow: hidden;">
      <CfTitleBar platform="macos" title="orders.parquet" subtitle="protoforge" :modified="true" size="sm" />
    </div>
    <div style="border: 1px solid var(--line-1); border-radius: var(--r-6); overflow: hidden;">
      <CfTitleBar platform="windows" title="orders.parquet" subtitle="protoforge" :modified="true" />
    </div>
    <div style="border: 1px solid var(--line-1); border-radius: var(--r-6); overflow: hidden;">
      <CfTitleBar platform="linux" title="orders.parquet" subtitle="protoforge" size="lg" />
    </div>
    <div style="border: 1px solid var(--line-1); border-radius: var(--r-6); overflow: hidden;">
      <CfTitleBar platform="macos" title="只标题（隐藏控件）" hide-controls />
    </div>
  </div>
</template>
