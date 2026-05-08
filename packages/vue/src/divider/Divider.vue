<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { type DividerProps, dividerClass } from './variants';

const props = withDefaults(defineProps<DividerProps>(), {
  orientation: 'horizontal',
  variant: 'solid',
  align: 'center',
});

const slots = useSlots();
const rootClass = computed(() =>
  dividerClass({
    orientation: props.orientation!,
    variant: props.variant!,
    align: props.align!,
    hasLabel: !!slots.default,
  })
);
</script>

<template>
  <div :class="rootClass" role="separator" :aria-orientation="orientation">
    <span v-if="$slots.default" class="cf-divider__label"><slot /></span>
  </div>
</template>
