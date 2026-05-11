<script setup lang="ts">
import { CfAvatar } from '@chufix-design/vue';

const avatarSrc = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22%3E%3Crect width=%2280%22 height=%2280%22 rx=%2218%22 fill=%22%23ecfeff%22/%3E%3Ccircle cx=%2240%22 cy=%2231%22 r=%2213%22 fill=%22%230891b2%22/%3E%3Cpath d=%22M17 68c5-16 16-24 23-24s18 8 23 24%22 fill=%22%2322d3ee%22/%3E%3C/svg%3E';
</script>

<template>
  <div class="demo-row">
    <CfAvatar :src="avatarSrc" alt="正常加载" />
    <CfAvatar name="Fallback Test" />
    <CfAvatar name="Chen Qi" />
    <CfAvatar name="anna lee smith" />
    <CfAvatar fallback="AI" />
    <CfAvatar>
      <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
        <circle cx="8" cy="6" r="3" />
        <path d="M2 14a6 6 0 0 1 12 0" />
      </svg>
    </CfAvatar>
  </div>
</template>
