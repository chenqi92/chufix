<script setup lang="ts">
import { computed } from 'vue';
import { toolbarClass, type ToolbarProps } from './variants';

const props = withDefaults(defineProps<ToolbarProps>(), {
  variant: 'default',
  size: 'md',
  orientation: 'horizontal',
});

const cls = computed(() => toolbarClass(props));
const ariaOrientation = computed(() =>
  props.orientation === 'vertical' ? 'vertical' : 'horizontal',
);
</script>

<template>
  <div :class="cls" role="toolbar" :aria-orientation="ariaOrientation">
    <slot />
  </div>
</template>
