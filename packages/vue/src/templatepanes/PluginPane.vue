<script setup lang="ts">
import TemplatePane from './TemplatePane.vue';
import { PLUGIN_TABS, type TemplatePaneProps } from './variants';

const props = defineProps<TemplatePaneProps>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <TemplatePane
    :model-value="props.modelValue"
    :tabs="props.tabs"
    :size="props.size"
    :default-tabs="PLUGIN_TABS"
    pane-class="cf-tplpane--plugin"
    @update:model-value="(v: string) => emit('update:modelValue', v)"
  >
    <template
      v-for="(_, name) in $slots"
      v-slot:[name]="slotProps: Record<string, unknown>"
    >
      <slot :name="name" v-bind="slotProps" />
    </template>
  </TemplatePane>
</template>
