<script setup lang="ts">
import { ref } from 'vue';
import { CfRating } from '@chufix/vue';

const a = ref(3);
const b = ref(3);
const c = ref(3);
</script>

<template>
  <div class="demo-stack">
    <CfRating v-model="a" size="sm" show-value />
    <CfRating v-model="b" size="md" show-value />
    <CfRating v-model="c" size="lg" show-value />
  </div>
</template>
