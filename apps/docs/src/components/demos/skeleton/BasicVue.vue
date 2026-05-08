<script setup lang="ts">
import { CfSkeleton } from '@chufix/vue';
</script>

<template>
  <div class="demo-stack" style="max-width: 22rem;">
    <div style="display: flex; gap: 12px; align-items: center;">
      <CfSkeleton shape="circle" :width="40" :height="40" />
      <div style="flex: 1;">
        <CfSkeleton shape="text" :width="120" />
        <div style="height: 6px;" />
        <CfSkeleton shape="text" :width="200" />
      </div>
    </div>
    <CfSkeleton shape="rect" :height="80" />
  </div>
</template>
