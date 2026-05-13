<script setup lang="ts">
import { computed, h } from 'vue';
import { headingClass, type HeadingProps } from './variants';

const props = withDefaults(defineProps<HeadingProps>(), {
  level: 2,
});

const cls = computed(() => headingClass(props));
</script>

<template>
  <component :is="`h${level}`" :class="cls">
    <slot />
  </component>
</template>
