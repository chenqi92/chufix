<script setup lang="ts">
import { computed, ref } from 'vue';
import { type AlertProps, alertClass } from './variants';

const props = withDefaults(defineProps<AlertProps>(), {
  tone: 'info',
  variant: 'soft',
  closable: false,
  icon: true,
});
const emit = defineEmits<{ (e: 'close'): void }>();

const open = ref(true);
function close() {
  open.value = false;
  emit('close');
}

const rootClass = computed(() =>
  alertClass({ tone: props.tone!, variant: props.variant! })
);

const iconPath = computed(() => {
  switch (props.tone) {
    case 'success': return 'M3 8l3.5 3.5L13 5';
    case 'warning': return 'M8 3v6m0 2v.5';
    case 'error':   return 'M5 5l6 6m0-6l-6 6';
    default:        return 'M8 5v3m0 2v.5';
  }
});
</script>

<template>
  <div v-if="open" :class="rootClass" role="alert">
    <span v-if="icon" class="cf-alert__icon" aria-hidden="true">
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path :d="iconPath" />
      </svg>
    </span>
    <div class="cf-alert__body">
      <div v-if="title || $slots.title" class="cf-alert__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div class="cf-alert__content">
        <slot />
      </div>
    </div>
    <button
      v-if="closable"
      type="button"
      class="cf-alert__close"
      aria-label="close"
      @click="close"
    >
      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
        <path d="M4 4l8 8M12 4l-8 8" />
      </svg>
    </button>
  </div>
</template>
