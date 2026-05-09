<script setup lang="ts">
import { computed } from 'vue';
import { floatButtonClass, floatButtonStyle, type FloatButtonProps } from './variants';

const props = withDefaults(defineProps<FloatButtonProps>(), {
  shape: 'circle',
  variant: 'default',
});

const emit = defineEmits<{ click: [evt: MouseEvent] }>();

const cls = computed(() =>
  floatButtonClass({
    shape: props.shape,
    variant: props.variant,
    className: props.className,
  }),
);

const style = computed(() =>
  floatButtonStyle({
    bottom: props.bottom,
    right: props.right,
    top: props.top,
    left: props.left,
  }),
);
</script>

<template>
  <button
    type="button"
    :class="cls"
    :style="style"
    :aria-label="ariaLabel ?? tooltip"
    :title="tooltip"
    @click="emit('click', $event)"
  >
    <span class="cf-floatbtn__icon">
      <slot />
    </span>
    <span v-if="badge != null && badge !== ''" class="cf-floatbtn__badge">{{ badge }}</span>
  </button>
</template>
