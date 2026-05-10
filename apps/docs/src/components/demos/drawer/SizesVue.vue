<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfDrawer } from '@chufix-design/vue';

const sm = ref(false);
const md = ref(false);
const lg = ref(false);
const xl = ref(false);
const full = ref(false);
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 8px;">
    <CfButton @click="sm = true">sm</CfButton>
    <CfButton @click="md = true">md</CfButton>
    <CfButton @click="lg = true">lg</CfButton>
    <CfButton @click="xl = true">xl</CfButton>
    <CfButton @click="full = true">full</CfButton>
  </div>

  <CfDrawer v-model:open="sm" title="size = sm" size="sm" />
  <CfDrawer v-model:open="md" title="size = md" size="md" />
  <CfDrawer v-model:open="lg" title="size = lg" size="lg" />
  <CfDrawer v-model:open="xl" title="size = xl" size="xl" />
  <CfDrawer v-model:open="full" title="size = full" size="full" />
</template>
