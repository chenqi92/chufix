<script setup lang="ts">
import { computed, useSlots } from 'vue';
import {
  badgeClass,
  badgeRootClass,
  formatBadgeContent,
  type BadgeProps,
} from './variants';

const props = withDefaults(defineProps<BadgeProps>(), {
  tone: 'danger',
  dot: false,
  max: 99,
  showZero: false,
  placement: 'top-right',
});

const slots = useSlots();
const wrap = computed(() => !!slots.default);

const text = computed(() =>
  formatBadgeContent(props.content, props.max),
);

const visible = computed(() => {
  if (props.dot) return true;
  if (text.value === undefined) return false;
  if (text.value === '0' && !props.showZero) return false;
  return true;
});

const rootCls = computed(() => badgeRootClass({ wrap: wrap.value }));
const badgeCls = computed(() =>
  badgeClass({
    tone: props.tone,
    dot: props.dot,
    placement: props.placement,
    wrap: wrap.value,
  }),
);

const offsetStyle = computed(() => {
  if (!wrap.value || !props.offset) return undefined;
  const [x, y] = props.offset;
  return {
    transform: `translate(${x}px, ${y}px)`,
  };
});
</script>

<template>
  <span :class="rootCls">
    <slot />
    <span v-if="visible" :class="badgeCls" :style="offsetStyle">
      <template v-if="!dot">{{ text }}</template>
    </span>
  </span>
</template>
