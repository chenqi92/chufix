<script setup lang="ts">
import { CfSkeleton } from '@chufix-design/vue';
</script>

<template>
  <div style="max-width: 22rem; padding: 12px; border: 1px solid var(--line-1); border-radius: 8px;">
    <CfSkeleton shape="rect" :height="120" />
    <div style="height: 12px;" />
    <div style="display: flex; gap: 12px; align-items: center;">
      <CfSkeleton shape="circle" :width="32" :height="32" />
      <div style="flex: 1;">
        <CfSkeleton shape="text" :width="100" />
        <div style="height: 6px;" />
        <CfSkeleton shape="text" :width="160" />
      </div>
    </div>
    <div style="height: 8px;" />
    <CfSkeleton shape="text" :lines="3" />
  </div>
</template>
