<script setup lang="ts">
import { ref } from 'vue';
import { CfSlider } from '@chufix-design/vue';

const value = ref(40);
</script>

<template>
  <div style="width: 100%; max-width: 32rem;">
    <CfSlider v-model="value" show-value />
  </div>
</template>
