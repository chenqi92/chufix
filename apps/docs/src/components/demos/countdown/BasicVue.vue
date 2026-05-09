<script setup lang="ts">
import { ref, computed } from 'vue';
import { CfCountDown, CfButton } from '@chufix/vue';

const now = Date.now();
const target = ref<number>(now + 60_000);

function reset() {
  target.value = Date.now() + 60_000;
}

const finished = ref(false);
</script>

<template>
  <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
    <CfCountDown :target="target" format="HH:mm:ss" size="lg" @finish="finished = true" />
    <CfButton size="sm" @click="() => { finished = false; reset(); }">重置 60 秒</CfButton>
    <span v-if="finished" style="color: var(--status-success);">已结束</span>
  </div>
</template>
