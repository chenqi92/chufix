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
    viewBox="0 0 128 96"
    fill="none"
    :role="title ? 'img' : undefined"
    :aria-hidden="title ? undefined : 'true'"
  >
    <title v-if="title">{{ title }}</title>
    <ellipse class="cf-status-illustration__shadow" cx="64" cy="84" rx="42" ry="6" />
    <path class="cf-status-illustration__backdrop" d="M31 14h58a7 7 0 0 1 7 7v36a7 7 0 0 1-7 7H31a7 7 0 0 1-7-7V21a7 7 0 0 1 7-7z" />
    <path class="cf-status-illustration__panel" d="M21 22h86a8 8 0 0 1 8 8v42a8 8 0 0 1-8 8H21a8 8 0 0 1-8-8V30a8 8 0 0 1 8-8z" />
    <path class="cf-status-illustration__bar" d="M13 35h102" />
    <circle class="cf-status-illustration__dot" cx="25" cy="28.5" r="1.8" />
    <circle class="cf-status-illustration__dot" cx="32" cy="28.5" r="1.8" />
    <circle class="cf-status-illustration__dot" cx="39" cy="28.5" r="1.8" />
    <path class="cf-status-illustration__muted-stroke" d="M89 28.5h12" />

    <template v-if="variant === 'upload'">
      <path class="cf-status-illustration__muted-stroke" d="M31 47h20M31 57h13M31 67h17" />
      <rect class="cf-status-illustration__soft" x="63" y="45" width="34" height="24" rx="6" />
      <path class="cf-status-illustration__accent-stroke" d="M80 61V48m0 0-6 6m6-6 6 6" />
      <path class="cf-status-illustration__muted-stroke" d="M70 65h20" />
    </template>

    <template v-else-if="variant === 'success'">
      <path class="cf-status-illustration__muted-stroke" d="M31 48h24M31 58h18M31 68h26" />
      <circle class="cf-status-illustration__soft" cx="82" cy="57" r="17" />
      <path class="cf-status-illustration__accent-stroke" d="M72 57l6 6 15-16" />
    </template>

    <template v-else-if="variant === 'info'">
      <path class="cf-status-illustration__muted-stroke" d="M31 48h24M31 58h18M31 68h26" />
      <circle class="cf-status-illustration__soft" cx="82" cy="57" r="17" />
      <path class="cf-status-illustration__accent-stroke" d="M82 55v10M82 48.5v.3" />
    </template>

    <template v-else-if="variant === 'warning'">
      <path class="cf-status-illustration__muted-stroke" d="M31 48h22M31 58h15M31 68h20" />
      <path class="cf-status-illustration__soft" d="M82 41l21 34H61l21-34z" />
      <path class="cf-status-illustration__accent-stroke" d="M82 54v9M82 68v.3" />
    </template>

    <template v-else-if="variant === 'error'">
      <path class="cf-status-illustration__muted-stroke" d="M31 48h24M31 58h18M31 68h26" />
      <circle class="cf-status-illustration__soft" cx="82" cy="57" r="17" />
      <path class="cf-status-illustration__accent-stroke" d="M75 50l14 14M89 50 75 64" />
    </template>

    <template v-else-if="variant === 'search'">
      <path class="cf-status-illustration__muted-stroke" d="M31 48h31M31 58h20M31 68h25" />
      <circle class="cf-status-illustration__soft" cx="78" cy="55" r="15" />
      <circle class="cf-status-illustration__accent-stroke" cx="78" cy="55" r="10" />
      <path class="cf-status-illustration__accent-stroke" d="M86 63l12 12" />
    </template>

    <template v-else-if="variant === 'not-found'">
      <path class="cf-status-illustration__muted-stroke" d="M32 50h12m40 0h12M38 68c8-6 44-6 52 0" />
      <text class="cf-status-illustration__code" x="64" y="60" text-anchor="middle">404</text>
    </template>

    <template v-else-if="variant === 'forbidden'">
      <path class="cf-status-illustration__muted-stroke" d="M31 48h24M31 58h18M31 68h26" />
      <circle class="cf-status-illustration__soft" cx="82" cy="57" r="17" />
      <circle class="cf-status-illustration__accent-stroke" cx="82" cy="57" r="12" />
      <path class="cf-status-illustration__accent-stroke" d="M74 65l16-16" />
    </template>

    <template v-else-if="variant === 'server-error'">
      <rect class="cf-status-illustration__soft" x="34" y="44" width="60" height="10" rx="3" />
      <rect class="cf-status-illustration__soft" x="34" y="60" width="60" height="10" rx="3" />
      <path class="cf-status-illustration__accent-stroke" d="M82 49h4M82 65h4M43 49h.3M43 65h.3M49 49h22M49 65h22" />
      <path class="cf-status-illustration__muted-stroke" d="M64 40v-5M56 35h16" />
    </template>

    <template v-else>
      <path class="cf-status-illustration__muted-stroke" d="M32 48h20M76 48h20M35 69h58" />
      <rect class="cf-status-illustration__soft" x="43" y="46" width="42" height="22" rx="6" />
      <path class="cf-status-illustration__accent-stroke" d="M43 54h42M52 61h24" />
    </template>
  </svg>
</template>
