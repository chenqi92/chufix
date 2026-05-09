<script setup lang="ts">
import { computed } from 'vue';
import { resultClass, resultDefaultTitle, type ResultProps } from './variants';

const props = withDefaults(defineProps<ResultProps>(), {
  status: 'info',
  size: 'md',
});

const cls = computed(() =>
  resultClass({ status: props.status, size: props.size, className: props.className }),
);
const finalTitle = computed(() => props.title ?? resultDefaultTitle(props.status));

const codeStatuses = ['404', '403', '500'] as const;
const isCode = computed(() => codeStatuses.includes(props.status as (typeof codeStatuses)[number]));
</script>

<template>
  <div :class="cls">
    <div class="cf-result__icon" aria-hidden>
      <slot name="icon">
        <span v-if="isCode" class="cf-result__code">{{ status }}</span>
        <svg v-else viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" stroke-width="3" />
          <template v-if="status === 'success'">
            <path d="M20 32l8 8 16-16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          </template>
          <template v-else-if="status === 'error'">
            <path d="M22 22l20 20M42 22L22 42" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
          </template>
          <template v-else-if="status === 'warning'">
            <path d="M32 18v18M32 44v.01" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
          </template>
          <template v-else>
            <path d="M32 22v18M32 46v.01" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
          </template>
        </svg>
      </slot>
    </div>
    <div class="cf-result__title">
      <slot name="title">{{ finalTitle }}</slot>
    </div>
    <div v-if="$slots.description || description" class="cf-result__description">
      <slot name="description">{{ description }}</slot>
    </div>
    <div v-if="$slots.extra" class="cf-result__extra">
      <slot name="extra" />
    </div>
  </div>
</template>
