<script setup lang="ts">
import { ref } from 'vue';
import { CfSlider } from '@chufix-design/vue';

const a = ref(40);
const b = ref(40);
const c = ref(40);
</script>

<template>
  <div class="demo-stack" style="width: 100%; max-width: 32rem;">
    <CfSlider v-model="a" size="sm" />
    <CfSlider v-model="b" size="md" />
    <CfSlider v-model="c" size="lg" />
  </div>
</template>
