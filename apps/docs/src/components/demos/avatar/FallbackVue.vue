<script setup lang="ts">
import { Avatar } from '@chufix/vue';
</script>

<template>
  <div class="demo-row">
    <Avatar src="https://i.pravatar.cc/80?img=22" alt="正常加载" />
    <Avatar src="/__intentionally_404__.png" name="Fallback Test" />
    <Avatar name="Chen Qi" />
    <Avatar name="anna lee smith" />
    <Avatar fallback="🐱" />
    <Avatar>
      <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
        <circle cx="8" cy="6" r="3" />
        <path d="M2 14a6 6 0 0 1 12 0" />
      </svg>
    </Avatar>
  </div>
</template>
