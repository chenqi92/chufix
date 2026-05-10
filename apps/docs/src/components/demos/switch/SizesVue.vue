<script setup lang="ts">
import { ref } from 'vue';
import { CfSwitch } from '@chufix-design/vue';

const a = ref(true);
const b = ref(false);
const c = ref(false);
</script>

<template>
  <div class="demo-stack">
    <CfSwitch v-model="a" size="sm">Small</CfSwitch>
    <CfSwitch v-model="b" size="md">Medium（默认）</CfSwitch>
    <CfSwitch v-model="c" size="lg">Large</CfSwitch>
  </div>
</template>
