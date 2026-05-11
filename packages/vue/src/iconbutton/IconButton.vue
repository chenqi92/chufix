<script setup lang="ts">
import { computed } from 'vue';
import { iconButtonClass, type IconButtonProps } from './variants';

const props = withDefaults(defineProps<IconButtonProps>(), {
  variant: 'default',
  size: 'md',
  shape: 'square',
  pressed: false,
  loading: false,
  disabled: false,
  type: 'button',
});

defineEmits<{ (e: 'click', evt: MouseEvent): void }>();

const cls = computed(() => iconButtonClass(props));
const inactive = computed(() => props.disabled || props.loading);
</script>

<template>
  <button
    :class="cls"
    :type="type"
    :disabled="inactive"
    :aria-pressed="pressed || undefined"
    :aria-busy="loading || undefined"
    @click="(e) => !inactive && $emit('click', e)"
  >
    <slot />
    <span v-if="$slots.badge" class="cf-iconbtn__badge">
      <slot name="badge" />
    </span>
  </button>
</template>
