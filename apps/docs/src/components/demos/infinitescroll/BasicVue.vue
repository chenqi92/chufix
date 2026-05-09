<script setup lang="ts">
import { ref } from 'vue';
import { CfInfiniteScroll } from '@chufix/vue';

const items = ref<number[]>(Array.from({ length: 12 }, (_, i) => i + 1));
const loading = ref(false);
const finished = ref(false);

function loadMore() {
  if (loading.value || finished.value) return;
  loading.value = true;
  setTimeout(() => {
    const start = items.value.length + 1;
    items.value.push(...Array.from({ length: 12 }, (_, i) => start + i));
    loading.value = false;
    if (items.value.length >= 60) finished.value = true;
  }, 600);
}
</script>

<template>
  <div style="height: 280px; overflow-y: auto; border: 1px solid var(--line-1); border-radius: 8px; padding: 8px;">
    <CfInfiniteScroll
      :loading="loading"
      :finished="finished"
      :threshold="80"
      @load="loadMore"
    >
      <ul style="margin: 0; padding: 0; list-style: none; display: grid; gap: 4px;">
        <li
          v-for="i in items"
          :key="i"
          style="padding: 8px 12px; background: var(--bg-2); border-radius: 4px;"
        >第 {{ i }} 项</li>
      </ul>
    </CfInfiniteScroll>
  </div>
</template>
