<script setup lang="ts">
import { ref } from 'vue';
import { Switch } from '@chufix/vue';

const a = ref(true);
const b = ref(false);
const c = ref(false);
</script>

<template>
  <div class="demo-stack">
    <Switch v-model="a" size="sm">Small</Switch>
    <Switch v-model="b" size="md">Medium（默认）</Switch>
    <Switch v-model="c" size="lg">Large</Switch>
  </div>
</template>
