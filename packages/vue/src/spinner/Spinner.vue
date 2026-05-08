<script setup lang="ts">
import { computed } from 'vue';
import { type SpinnerProps, spinnerClass } from './variants';

const props = withDefaults(defineProps<SpinnerProps>(), {
  size: 'md',
  tone: 'primary',
});

const cls = computed(() => spinnerClass({ size: props.size!, tone: props.tone! }));
</script>

<template>
  <span :class="cls" role="status" :aria-label="label || 'loading'">
    <span class="cf-spinner__ring"></span>
    <span v-if="label" class="cf-spinner__label">{{ label }}</span>
  </span>
</template>
