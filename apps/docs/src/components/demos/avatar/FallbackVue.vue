<script setup lang="ts">
import { CfAvatar } from '@chufix/vue';
</script>

<template>
  <div class="demo-row">
    <CfAvatar src="https://i.pravatar.cc/80?img=22" alt="正常加载" />
    <CfAvatar src="/__intentionally_404__.png" name="Fallback Test" />
    <CfAvatar name="Chen Qi" />
    <CfAvatar name="anna lee smith" />
    <CfAvatar fallback="🐱" />
    <CfAvatar>
      <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
        <circle cx="8" cy="6" r="3" />
        <path d="M2 14a6 6 0 0 1 12 0" />
      </svg>
    </CfAvatar>
  </div>
</template>
