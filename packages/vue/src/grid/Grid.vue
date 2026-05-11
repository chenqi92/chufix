<script setup lang="ts">
import { computed } from 'vue';
import { gridClass, gridStyle, type GridProps } from './variants';

const props = withDefaults(defineProps<GridProps>(), {
  as: 'div',
  gap: 'md',
  align: 'stretch',
  justify: 'stretch',
  dense: false,
});

const cls = computed(() => gridClass(props));
const style = computed(() => gridStyle(props));
</script>

<template>
  <component :is="as" :class="cls" :style="style">
    <slot />
  </component>
</template>
