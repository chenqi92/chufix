<script setup lang="ts">
import { ref } from 'vue';
import { Tag } from '@chufix/vue';

const tags = ref(['Vue', 'Astro', 'Tailwind', 'TypeScript']);

function remove(t: string) {
  tags.value = tags.value.filter((x) => x !== t);
}
function reset() {
  tags.value = ['Vue', 'Astro', 'Tailwind', 'TypeScript'];
}
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row">
      <Tag v-for="t in tags" :key="t" tone="primary" closable @close="remove(t)">
        {{ t }}
      </Tag>
      <button
        v-if="!tags.length"
        class="cf-btn cf-btn--soft cf-btn--sm"
        @click="reset"
      >全部清空，点这里恢复</button>
    </div>
  </div>
</template>
