<script setup lang="ts">
import { computed } from 'vue';
import { type EmptyProps, emptyClass } from './variants';

const props = withDefaults(defineProps<EmptyProps>(), {
  title: '暂无数据',
  size: 'md',
});

const rootClass = computed(() => emptyClass({ size: props.size! }));
</script>

<template>
  <div :class="rootClass" role="status">
    <div class="cf-empty__icon">
      <slot name="icon">
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="10" y="18" width="44" height="34" rx="3" />
          <path d="M10 28h44" />
          <path d="M22 12h20" />
          <circle cx="22" cy="40" r="2" fill="currentColor" />
          <circle cx="32" cy="40" r="2" fill="currentColor" />
          <circle cx="42" cy="40" r="2" fill="currentColor" />
        </svg>
      </slot>
    </div>
    <div class="cf-empty__title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div v-if="description || $slots.description" class="cf-empty__desc">
      <slot name="description">{{ description }}</slot>
    </div>
    <div v-if="$slots.action" class="cf-empty__action">
      <slot name="action" />
    </div>
  </div>
</template>
