<script setup lang="ts">
import { computed } from 'vue';
import { blocks } from '~/blocks/registry';

const props = defineProps<{ blockId: string }>();
const block = computed(() => blocks.find((b) => b.id === props.blockId));
</script>

<template>
  <component v-if="block" :is="block.Preview" />
  <div v-else style="padding: 16px; color: var(--fg-3); font-family: var(--font-mono); font-size: 12px;">
    Block not found: {{ blockId }}
  </div>
</template>
