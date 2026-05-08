<script setup lang="ts">
import { Skeleton } from '@chufix/vue';
</script>

<template>
  <div class="demo-stack" style="max-width: 22rem;">
    <div style="display: flex; gap: 12px; align-items: center;">
      <Skeleton shape="circle" :width="40" :height="40" />
      <div style="flex: 1;">
        <Skeleton shape="text" :width="120" />
        <div style="height: 6px;" />
        <Skeleton shape="text" :width="200" />
      </div>
    </div>
    <Skeleton shape="rect" :height="80" />
  </div>
</template>
