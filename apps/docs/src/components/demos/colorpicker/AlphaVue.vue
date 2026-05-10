<script setup lang="ts">
import { ref } from 'vue';
import { CfColorPicker } from '@chufix-design/vue';

const value = ref('rgba(99, 102, 241, 0.6)');
</script>

<template>
  <CfColorPicker v-model="value" show-alpha default-format="rgb" />
</template>
