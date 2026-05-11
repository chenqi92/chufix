<script setup lang="ts">
import { computed } from 'vue';
import {
  statusIllustrationClass,
  type StatusIllustrationProps,
} from './variants';

const props = withDefaults(defineProps<StatusIllustrationProps>(), {
  variant: 'empty',
  size: 'md',
});

const cls = computed(() =>
  statusIllustrationClass({
    variant: props.variant,
    size: props.size,
    className: props.className,
  }),
);
</script>

<template>
  <svg
    :class="cls"
    viewBox="0 0 96 72"
    fill="none"
    :role="title ? 'img' : undefined"
    :aria-hidden="title ? undefined : 'true'"
  >
    <title v-if="title">{{ title }}</title>
    <ellipse class="cf-status-illustration__shadow" cx="48" cy="64" rx="33" ry="5" />
    <path class="cf-status-illustration__panel" d="M20 17a5 5 0 0 1 5-5h46a5 5 0 0 1 5 5v34a5 5 0 0 1-5 5H25a5 5 0 0 1-5-5V17z" />
    <path class="cf-status-illustration__bar" d="M20 24h56" />
    <circle class="cf-status-illustration__dot" cx="28" cy="18.5" r="1.6" />
    <circle class="cf-status-illustration__dot" cx="34" cy="18.5" r="1.6" />
    <circle class="cf-status-illustration__dot" cx="40" cy="18.5" r="1.6" />

    <template v-if="variant === 'upload'">
      <path class="cf-status-illustration__soft" d="M31 43.5h34a9 9 0 0 0 .9-18 14 14 0 0 0-27.1-3.7A11 11 0 0 0 31 43.5z" />
      <path class="cf-status-illustration__accent-stroke" d="M48 43V29m0 0-6 6m6-6 6 6" />
      <path class="cf-status-illustration__muted-stroke" d="M32 45.5h32" />
    </template>

    <template v-else-if="variant === 'success'">
      <circle class="cf-status-illustration__soft" cx="48" cy="37" r="17" />
      <path class="cf-status-illustration__accent-stroke" d="M39 37.5l6 6 13-14" />
      <path class="cf-status-illustration__muted-stroke" d="M30 54h36" />
    </template>

    <template v-else-if="variant === 'info'">
      <circle class="cf-status-illustration__soft" cx="48" cy="37" r="17" />
      <path class="cf-status-illustration__accent-stroke" d="M48 35v10M48 28.5v.2" />
      <path class="cf-status-illustration__muted-stroke" d="M36 54h24" />
    </template>

    <template v-else-if="variant === 'warning'">
      <path class="cf-status-illustration__soft" d="M48 22l19 31H29l19-31z" />
      <path class="cf-status-illustration__accent-stroke" d="M48 34v10M48 49v.2" />
      <path class="cf-status-illustration__muted-stroke" d="M34 56h28" />
    </template>

    <template v-else-if="variant === 'error'">
      <circle class="cf-status-illustration__soft" cx="48" cy="37" r="17" />
      <path class="cf-status-illustration__accent-stroke" d="M41 30l14 14M55 30 41 44" />
      <path class="cf-status-illustration__muted-stroke" d="M34 54h28" />
    </template>

    <template v-else-if="variant === 'search'">
      <path class="cf-status-illustration__muted-stroke" d="M32 33h16M32 41h10M32 49h14" />
      <circle class="cf-status-illustration__soft" cx="58" cy="36" r="10" />
      <circle class="cf-status-illustration__accent-stroke" cx="58" cy="36" r="8" />
      <path class="cf-status-illustration__accent-stroke" d="M64 42l7 7" />
    </template>

    <template v-else-if="variant === 'not-found'">
      <path class="cf-status-illustration__muted-stroke" d="M30 32h12M54 32h12M33 47c5-5 25-5 30 0" />
      <text class="cf-status-illustration__code" x="48" y="43" text-anchor="middle">404</text>
    </template>

    <template v-else-if="variant === 'forbidden'">
      <circle class="cf-status-illustration__soft" cx="48" cy="37" r="17" />
      <path class="cf-status-illustration__accent-stroke" d="M37 48l22-22" />
      <circle class="cf-status-illustration__accent-stroke" cx="48" cy="37" r="14" />
      <path class="cf-status-illustration__muted-stroke" d="M34 55h28" />
    </template>

    <template v-else-if="variant === 'server-error'">
      <rect class="cf-status-illustration__soft" x="31" y="27" width="34" height="10" rx="2" />
      <rect class="cf-status-illustration__soft" x="31" y="41" width="34" height="10" rx="2" />
      <path class="cf-status-illustration__accent-stroke" d="M57 32h3M57 46h3M37 32h.2M37 46h.2M41 32h10M41 46h10" />
      <path class="cf-status-illustration__muted-stroke" d="M48 24v-4M43 20h10" />
    </template>

    <template v-else>
      <path class="cf-status-illustration__soft" d="M33 30h30v17a4 4 0 0 1-4 4H37a4 4 0 0 1-4-4V30z" />
      <path class="cf-status-illustration__accent-stroke" d="M33 30h30M39 24h18M41 39h14M41 45h10" />
      <path class="cf-status-illustration__muted-stroke" d="M29 54h38" />
    </template>
  </svg>
</template>
