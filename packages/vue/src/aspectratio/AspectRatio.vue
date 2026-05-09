<script setup lang="ts">
import { computed } from 'vue';
import type { AspectRatioProps } from './variants';

const props = withDefaults(defineProps<AspectRatioProps>(), { ratio: 16 / 9 });

const styles = computed(() => ({
  '--cf-aspect': String(props.ratio),
}));
</script>

<template>
  <div class="cf-aspect" :style="styles">
    <div class="cf-aspect__inner">
      <slot />
    </div>
  </div>
</template>
