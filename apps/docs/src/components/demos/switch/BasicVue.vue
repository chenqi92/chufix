<script setup lang="ts">
import { ref } from 'vue';
import { Switch } from '@chukit/vue';

const wifi = ref(true);
const dnd = ref(false);
const sync = ref(false);

async function onSync(v: boolean) {
  if (!v) return;
  // simulate async toggle
  sync.value = false;
  await new Promise((r) => setTimeout(r, 1000));
  sync.value = true;
}
</script>

<template>
  <div style="display: grid; gap: 0.85rem; max-width: 18rem;">
    <Switch v-model="wifi">Wi-Fi {{ wifi ? '已开启' : '已关闭' }}</Switch>
    <Switch v-model="dnd" size="sm">勿扰模式（sm）</Switch>
    <Switch v-model="sync" size="lg" @change="onSync">大尺寸 + 异步</Switch>
    <Switch :model-value="true" disabled>禁用 · 已开</Switch>
    <Switch :model-value="false" disabled>禁用 · 已关</Switch>
  </div>
</template>
