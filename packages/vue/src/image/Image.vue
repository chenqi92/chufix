<script setup lang="ts">
import { computed, ref } from 'vue';
import { imageClass, type ImageProps } from './variants';

const props = withDefaults(defineProps<ImageProps>(), {
  alt: '',
  fit: 'cover',
  rounded: false,
  bordered: false,
  lazy: true,
});

const state = ref<'loading' | 'loaded' | 'error'>('loading');

function onLoad() { state.value = 'loaded'; }
function onError() { state.value = 'error'; }

const cls = computed(() =>
  imageClass({
    rounded: props.rounded,
    bordered: props.bordered,
    state: state.value,
    className: props.className,
  }),
);

const wrapStyle = computed(() => {
  const w = typeof props.width === 'number' ? `${props.width}px` : props.width;
  const h = typeof props.height === 'number' ? `${props.height}px` : props.height;
  return { width: w, height: h };
});

const imgStyle = computed(() => ({ objectFit: props.fit }));

const showFallback = computed(() => state.value === 'error' && props.fallback);
const finalLoading = computed(() =>
  props.loading ?? (props.lazy ? 'lazy' : 'eager'),
);
</script>

<template>
  <span :class="cls" :style="wrapStyle">
    <span v-if="state === 'loading'" class="cf-image__placeholder" aria-hidden />
    <img
      v-show="state !== 'error'"
      :src="src"
      :alt="alt"
      :loading="finalLoading"
      :style="imgStyle"
      @load="onLoad"
      @error="onError"
    />
    <img
      v-if="showFallback"
      :src="fallback"
      :alt="alt"
      :style="imgStyle"
      class="cf-image__fallback"
    />
    <span v-else-if="state === 'error'" class="cf-image__error" aria-hidden>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm2 0v9.59l3.29-3.3a1 1 0 0 1 1.42 0L13 14.59l2.29-2.3a1 1 0 0 1 1.42 0L19 14.59V5H5z" fill="currentColor" />
      </svg>
    </span>
  </span>
</template>
