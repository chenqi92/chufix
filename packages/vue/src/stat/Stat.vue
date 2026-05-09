<script setup lang="ts">
import { computed } from 'vue';
import {
  statClass,
  trendDirection,
  type StatProps,
} from './variants';

const props = withDefaults(defineProps<StatProps>(), {
  variant: 'default',
  size: 'md',
  loading: false,
});

const cls = computed(() =>
  statClass({
    variant: props.variant,
    size: props.size,
    loading: props.loading,
  }),
);

const dir = computed(() => trendDirection(props.trend));
</script>

<template>
  <div :class="cls">
    <div class="cf-stat__head">
      <slot name="leading" />
      <span class="cf-stat__label">{{ label }}</span>
      <span v-if="$slots.trailing" class="cf-stat__trailing">
        <slot name="trailing" />
      </span>
    </div>

    <div class="cf-stat__value">
      <span v-if="prefix" class="cf-stat__prefix">{{ prefix }}</span>
      <span class="cf-stat__number">
        <slot name="value">{{ value }}</slot>
      </span>
      <span v-if="suffix" class="cf-stat__suffix">{{ suffix }}</span>
    </div>

    <div v-if="trend || hint || $slots.footer" class="cf-stat__foot">
      <span
        v-if="trend"
        class="cf-stat__trend"
        :class="`cf-stat__trend--${dir}`"
      >
        <svg
          v-if="dir === 'up'"
          viewBox="0 0 12 12"
          fill="currentColor"
          aria-hidden="true"
          class="cf-stat__trend-icon"
        ><path d="M2 8l4-4 4 4H2z"/></svg>
        <svg
          v-else-if="dir === 'down'"
          viewBox="0 0 12 12"
          fill="currentColor"
          aria-hidden="true"
          class="cf-stat__trend-icon"
        ><path d="M2 4l4 4 4-4H2z"/></svg>
        <svg
          v-else
          viewBox="0 0 12 12"
          fill="currentColor"
          aria-hidden="true"
          class="cf-stat__trend-icon"
        ><rect x="2" y="5" width="8" height="2"/></svg>
        <span class="cf-stat__trend-delta">{{ trend.delta }}</span>
        <span v-if="trend.label" class="cf-stat__trend-label">{{ trend.label }}</span>
      </span>
      <span v-if="hint" class="cf-stat__hint">{{ hint }}</span>
      <slot name="footer" />
    </div>
  </div>
</template>
