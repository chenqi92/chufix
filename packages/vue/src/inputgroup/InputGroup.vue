<script setup lang="ts">
import { computed } from 'vue';
import { inputGroupClass, type InputGroupProps } from './variants';

const props = withDefaults(defineProps<InputGroupProps>(), {
  orientation: 'horizontal',
  size: 'md',
  stretch: false,
});

const cls = computed(() =>
  inputGroupClass({ orientation: props.orientation, size: props.size, stretch: props.stretch }),
);
</script>

<template>
  <div :class="cls" role="group">
    <slot />
  </div>
</template>
