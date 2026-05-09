<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfDrawer } from '@chufix/vue';

const right = ref(false);
const left = ref(false);
const top = ref(false);
const bottom = ref(false);
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 8px;">
    <CfButton @click="right = true">从右侧</CfButton>
    <CfButton variant="secondary" @click="left = true">从左侧</CfButton>
    <CfButton variant="secondary" @click="top = true">从顶部</CfButton>
    <CfButton variant="secondary" @click="bottom = true">从底部</CfButton>
  </div>

  <CfDrawer v-model:open="right" title="右侧抽屉" placement="right" />
  <CfDrawer v-model:open="left" title="左侧抽屉" placement="left" />
  <CfDrawer v-model:open="top" title="顶部抽屉" placement="top" />
  <CfDrawer v-model:open="bottom" title="底部抽屉" placement="bottom" />
</template>
