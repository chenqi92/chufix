<script setup lang="ts">
import { computed } from 'vue';
import { templatePreviews } from '~/templates/preview-registry';

const props = defineProps<{ templateId: string }>();
const Preview = computed(() => templatePreviews[props.templateId]);
</script>

<template>
  <component v-if="Preview" :is="Preview" />
  <div v-else style="padding: 16px; color: var(--fg-3); font-family: var(--font-mono); font-size: 12px;">
    Template preview not found: {{ templateId }}
  </div>
</template>
