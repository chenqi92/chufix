<script setup lang="ts">
import { computed } from 'vue';
import { colClass, colStyle, type ColProps } from './variants';

const props = withDefaults(defineProps<ColProps>(), {
  as: 'div',
});

const cls = computed(() => colClass(props));
const style = computed(() => colStyle(props));
</script>

<template>
  <component :is="as" :class="cls" :style="style">
    <slot />
  </component>
</template>
