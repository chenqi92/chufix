<script setup lang="ts">
import { computed } from 'vue';
import { buttonGroupClass, type ButtonGroupProps } from './variants';

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  orientation: 'horizontal',
  variant: 'attached',
});

const cls = computed(() => buttonGroupClass(props));
</script>

<template>
  <div :class="cls" role="group" :aria-label="ariaLabel" :aria-orientation="orientation">
    <slot />
  </div>
</template>
