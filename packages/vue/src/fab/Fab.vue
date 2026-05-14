<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useSlots } from 'vue';
import type { FabProps } from './variants';

const props = withDefaults(defineProps<FabProps>(), {
  size: 'md',
  variant: 'primary',
  position: 'bottom-right',
  hideOnScroll: false,
  disabled: false,
});

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void;
}>();

const slots = useSlots();

const isExtended = computed(() => {
  if (typeof props.extended === 'boolean') return props.extended;
  return Boolean(props.label);
});

const hidden = ref(false);
let lastScroll = 0;

function onScroll() {
  if (!props.hideOnScroll || typeof window === 'undefined') return;
  const y = window.scrollY || document.documentElement.scrollTop || 0;
  const delta = y - lastScroll;
  if (Math.abs(delta) > 4) {
    hidden.value = delta > 0 && y > 80;
    lastScroll = y;
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    lastScroll = window.scrollY || 0;
    window.addEventListener('scroll', onScroll, { passive: true });
  }
});
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.removeEventListener('scroll', onScroll);
});

function handleClick(e: MouseEvent) {
  if (props.disabled) return;
  emit('click', e);
}

const showBadge = computed(() => props.badge !== undefined && props.badge !== '' && props.badge !== 0);
</script>

<template>
  <button
    type="button"
    :class="[
      'cf-fab',
      `cf-fab--${size}`,
      `cf-fab--${variant}`,
      `cf-fab--${position}`,
      isExtended && 'cf-fab--extended',
      hidden && 'is-hidden',
    ]"
    :aria-label="ariaLabel || label"
    :disabled="disabled"
    @click="handleClick"
  >
    <span v-if="slots.icon || $slots.default" class="cf-fab__icon">
      <slot name="icon">
        <slot />
      </slot>
    </span>
    <span v-if="isExtended && label" class="cf-fab__label">{{ label }}</span>
    <span v-if="showBadge" class="cf-fab__badge">{{ badge }}</span>
  </button>
</template>
