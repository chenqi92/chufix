<script setup lang="ts">
import { Avatar } from '@chufix/vue';
</script>

<template>
  <div class="demo-row">
    <Avatar src="https://i.pravatar.cc/80?img=12" alt="头像" />
    <Avatar name="Chen Qi" />
    <Avatar name="Anna Lee" />
    <Avatar fallback="?" />
  </div>
</template>
