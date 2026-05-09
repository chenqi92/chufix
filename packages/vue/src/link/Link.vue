<script setup lang="ts">
import { computed } from 'vue';
import { linkClass, type LinkProps } from './variants';

const props = withDefaults(defineProps<LinkProps>(), {
  variant: 'default',
  size: 'md',
  disabled: false,
});

const cls = computed(() =>
  linkClass({
    variant: props.variant,
    size: props.size,
    disabled: props.disabled,
  }),
);

const isExternal = computed(() => {
  if (props.external) return true;
  if (props.target === '_blank') return true;
  if (props.href && /^https?:\/\//i.test(props.href)) return true;
  return false;
});

const computedRel = computed(() => {
  if (props.rel) return props.rel;
  if (isExternal.value) return 'noopener noreferrer';
  return undefined;
});

const computedTarget = computed(() => {
  if (props.target) return props.target;
  if (props.external) return '_blank';
  return undefined;
});
</script>

<template>
  <a
    :class="cls"
    :href="disabled ? undefined : href"
    :target="computedTarget"
    :rel="computedRel"
    :aria-disabled="disabled"
    @click="disabled && $event.preventDefault()"
  >
    <slot />
    <svg
      v-if="isExternal"
      class="cf-link__external"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path d="M9 3h4v4M13 3l-6 6M11 9v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </a>
</template>
