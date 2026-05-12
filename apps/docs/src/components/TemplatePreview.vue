<script setup lang="ts">
import { computed } from 'vue';
import { templates } from '~/templates/registry';

const props = defineProps<{ templateId: string }>();
const tpl = computed(() => templates.find((t) => t.id === props.templateId));
</script>

<template>
  <component v-if="tpl?.Preview" :is="tpl.Preview" />
  <div v-else style="padding: 16px; color: var(--fg-3); font-family: var(--font-mono); font-size: 12px;">
    Template preview not found: {{ templateId }}
  </div>
</template>
