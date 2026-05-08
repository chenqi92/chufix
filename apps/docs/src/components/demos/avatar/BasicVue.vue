<script setup lang="ts">
import { CfAvatar } from '@chufix/vue';
</script>

<template>
  <div class="demo-row">
    <CfAvatar src="https://i.pravatar.cc/80?img=12" alt="头像" />
    <CfAvatar name="Chen Qi" />
    <CfAvatar name="Anna Lee" />
    <CfAvatar fallback="?" />
  </div>
</template>
