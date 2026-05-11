<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfTag } from '@chufix-design/vue';

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
      <CfTag v-for="t in tags" :key="t" tone="primary" closable @close="remove(t)">
        {{ t }}
      </CfTag>
      <CfButton
        v-if="!tags.length"
        class="cf-btn cf-btn--soft cf-btn--sm"
        @click="reset"
      >全部清空，点这里恢复</CfButton>
    </div>
  </div>
</template>
