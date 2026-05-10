<script setup lang="ts">
import { computed } from 'vue';
import { flexClass, flexStyle, type FlexProps } from './variants';

const props = withDefaults(defineProps<FlexProps>(), {
  as: 'div',
  direction: 'row',
  align: 'stretch',
  justify: 'start',
  gap: 'md',
  wrap: false,
  inline: false,
  full: false,
});

const cls = computed(() => flexClass(props));
const style = computed(() => flexStyle(props.gap));
</script>

<template>
  <component :is="as" :class="cls" :style="style">
    <slot />
  </component>
</template>
