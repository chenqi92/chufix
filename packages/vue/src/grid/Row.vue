<script setup lang="ts">
import { computed } from 'vue';
import { rowClass, rowStyle, type RowProps } from './variants';

const props = withDefaults(defineProps<RowProps>(), {
  as: 'div',
  gutter: 0,
  justify: 'start',
  align: 'top',
  wrap: true,
});

const cls = computed(() => rowClass({ justify: props.justify, align: props.align, wrap: props.wrap }));
const style = computed(() => rowStyle(props.gutter));
</script>

<template>
  <component :is="as" :class="cls" :style="style">
    <slot />
  </component>
</template>
