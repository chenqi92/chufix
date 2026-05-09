<script setup lang="ts">
import { ref } from 'vue';
import { CfColorPicker } from '@chufix/vue';

const value = ref('#10b981');
</script>

<template>
  <CfColorPicker v-model="value" panel-only show-alpha />
</template>
