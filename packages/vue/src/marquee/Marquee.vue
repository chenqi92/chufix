<script setup lang="ts">
import { computed } from 'vue';
import { marqueeClass, type MarqueeProps } from './variants';

const props = withDefaults(defineProps<MarqueeProps>(), {
  duration: 20,
  direction: 'left',
  pauseOnHover: true,
  gap: 40,
});

const cls = computed(() =>
  marqueeClass({
    direction: props.direction,
    pauseOnHover: props.pauseOnHover,
    className: props.className,
  }),
);

const trackStyle = computed(() => ({
  animationDuration: `${props.duration}s`,
  gap: `${props.gap}px`,
}));
</script>

<template>
  <div :class="cls">
    <div class="cf-marquee__track" :style="trackStyle">
      <div class="cf-marquee__group">
        <slot>{{ content }}</slot>
      </div>
      <div class="cf-marquee__group" aria-hidden="true">
        <slot>{{ content }}</slot>
      </div>
    </div>
  </div>
</template>
