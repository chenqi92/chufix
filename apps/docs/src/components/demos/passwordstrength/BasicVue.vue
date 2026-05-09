<script setup lang="ts">
import { ref } from 'vue';
import { CfPasswordStrength } from '@chufix/vue';
const pwd = ref('');
</script>

<template>
  <div style="max-width: 360px;">
    <CfPasswordStrength v-model="pwd" placeholder="试着输入复杂密码…" />
  </div>
</template>
