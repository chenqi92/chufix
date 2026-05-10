<script setup lang="ts">
import { ref } from 'vue';
import { CfNumberInput } from '@chufix-design/vue';

const value = ref<number | null>(10);
</script>

<template>
  <div style="max-width: 16rem;">
    <CfNumberInput v-model="value" :min="0" :max="100" />
  </div>
</template>
