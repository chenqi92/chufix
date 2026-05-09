<script setup lang="ts">
import { computed, useId } from 'vue';
import { iconSymbols } from '@chufix/icons';
import { iconClass, iconStyle, type IconProps } from './variants';

const props = withDefaults(defineProps<IconProps>(), {
  size: 'md',
  strokeWidth: 1.5,
});

const titleId = useId();
const cls = computed(() => iconClass(props.size!, props.motion));
const style = computed(() => iconStyle(props.size!, props.color));
const hasAccessibleName = computed(() => Boolean(props.title || props.label));
const markup = computed(() => iconSymbols[props.name]);
</script>

<template>
  <svg
    :class="cls"
    :style="style"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="hasAccessibleName ? 'img' : undefined"
    :aria-label="label"
    :aria-labelledby="title ? titleId : undefined"
    :aria-hidden="hasAccessibleName ? undefined : true"
  >
    <title v-if="title" :id="titleId">{{ title }}</title>
    <g v-html="markup"></g>
  </svg>
</template>
