<script setup lang="ts">
import { ref } from 'vue';
import { CfSwitch } from '@chufix/vue';

const sync = ref(false);
const loading = ref(false);

async function toggle(v: boolean) {
  loading.value = true;
  await new Promise((r) => setTimeout(r, 1000));
  sync.value = v;
  loading.value = false;
}
</script>

<template>
  <div class="demo-stack">
    <CfSwitch
      :model-value="sync"
      :loading="loading"
      @change="toggle"
    >自动同步（点击触发 1s 异步）</CfSwitch>
    <CfSwitch :model-value="true" disabled>禁用 · 已开</CfSwitch>
    <CfSwitch :model-value="false" disabled>禁用 · 已关</CfSwitch>
  </div>
</template>
