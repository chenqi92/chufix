<script setup lang="ts">
import CfTabs from '../tabs/Tabs.vue';
import type { SegmentedProps } from './variants';

const props = withDefaults(defineProps<SegmentedProps>(), {
  size: 'md',
  align: 'start',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <CfTabs
    variant="segmented"
    :size="props.size"
    :align="props.align"
    :items="props.items"
    :model-value="props.modelValue"
    @update:model-value="(v) => emit('update:modelValue', v)"
  />
</template>
