<script setup lang="ts">
import { ref } from 'vue';
import { CfSearchInput } from '@chufix-design/vue';

const q = ref('');
</script>

<template>
  <div style="max-width: 24rem;">
    <CfSearchInput v-model="q" placeholder="按 Ctrl K 聚焦" shortcut="Ctrl K" />
  </div>
</template>
