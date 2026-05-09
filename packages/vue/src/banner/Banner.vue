<script setup lang="ts">
import { computed, ref } from 'vue';
import { bannerClass, type BannerProps } from './variants';

const props = withDefaults(defineProps<BannerProps>(), {
  tone: 'info',
  variant: 'subtle',
  dismissible: false,
  icon: true,
  sticky: false,
});

const emit = defineEmits<{ (e: 'dismiss'): void }>();

const closed = ref(false);
const cls = computed(() => bannerClass({ tone: props.tone, variant: props.variant, sticky: props.sticky }));

function dismiss() {
  closed.value = true;
  emit('dismiss');
}
</script>

<template>
  <div v-if="!closed" :class="cls" role="status">
    <slot name="icon">
      <svg
        v-if="icon"
        class="cf-banner__icon"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5" />
        <path d="M8 4.5v4M8 11v.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      </svg>
    </slot>
    <div class="cf-banner__content">
      <slot />
    </div>
    <div v-if="$slots.action" class="cf-banner__action">
      <slot name="action" />
    </div>
    <button
      v-if="dismissible"
      type="button"
      class="cf-banner__close"
      aria-label="关闭"
      @click="dismiss"
    >×</button>
  </div>
</template>
