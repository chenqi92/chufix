<script setup lang="ts">
import { CfAvatar } from '@chufix-design/vue';

const avatarSrc = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22%3E%3Crect width=%2280%22 height=%2280%22 rx=%2220%22 fill=%22%23dbeafe%22/%3E%3Ccircle cx=%2240%22 cy=%2232%22 r=%2214%22 fill=%22%232563eb%22/%3E%3Cpath d=%22M16 70c4-18 16-27 24-27s20 9 24 27%22 fill=%22%2360a5fa%22/%3E%3C/svg%3E';
</script>

<template>
  <div class="demo-row">
    <CfAvatar :src="avatarSrc" alt="头像" />
    <CfAvatar name="Chen Qi" />
    <CfAvatar name="Anna Lee" />
    <CfAvatar fallback="?" />
  </div>
</template>
