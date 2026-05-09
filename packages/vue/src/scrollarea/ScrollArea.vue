<script setup lang="ts">
import { computed } from 'vue';
import { scrollAreaClass, type ScrollAreaProps } from './variants';

const props = withDefaults(defineProps<ScrollAreaProps>(), {
  size: 'md',
  bordered: false,
  axis: 'y',
});

const cls = computed(() =>
  scrollAreaClass({
    size: props.size,
    bordered: props.bordered,
    axis: props.axis,
  }),
);

const styles = computed(() => {
  const out: Record<string, string> = {};
  if (props.maxHeight != null)
    out.maxHeight =
      typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight;
  if (props.maxWidth != null)
    out.maxWidth =
      typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth;
  return out;
});
</script>

<template>
  <div :class="cls" :style="styles">
    <slot />
  </div>
</template>
