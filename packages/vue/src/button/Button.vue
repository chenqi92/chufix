<script setup lang="ts">
import { computed } from 'vue';
import { buttonClass, type ButtonProps } from './variants';

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'solid',
  size: 'md',
  shape: 'default',
  tone: 'primary',
  disabled: false,
  loading: false,
  block: false,
  type: 'button',
});

defineEmits<{ (e: 'click', evt: MouseEvent): void }>();

const cls = computed(() => buttonClass(props));
const ariaDisabled = computed(() => props.disabled || props.loading);
</script>

<template>
  <button
    :class="cls"
    :type="type"
    :disabled="ariaDisabled"
    :aria-busy="loading || undefined"
    @click="(e) => !ariaDisabled && $emit('click', e)"
  >
    <span v-if="loading" class="cf-btn__spinner" aria-hidden="true" />
    <span v-else-if="$slots.leading" class="cf-btn__leading">
      <slot name="leading" />
    </span>
    <span class="cf-btn__label"><slot /></span>
    <span v-if="$slots.trailing" class="cf-btn__trailing">
      <slot name="trailing" />
    </span>
  </button>
</template>
