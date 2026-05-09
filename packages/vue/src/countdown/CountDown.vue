<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import {
  countDownClass,
  formatRemaining,
  targetMs,
  type CountDownProps,
} from './variants';

const props = withDefaults(defineProps<CountDownProps>(), {
  format: 'HH:mm:ss',
  interval: 1000,
  size: 'md',
});

const emit = defineEmits<{ finish: []; change: [remaining: number] }>();

const remaining = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

function clear() {
  if (timer) clearInterval(timer);
  timer = null;
}

function start() {
  clear();
  if (typeof window === 'undefined') return;
  const tms = targetMs(props.target);
  if (!tms) return;
  function tick() {
    const r = tms - Date.now();
    if (r <= 0) {
      remaining.value = 0;
      emit('change', 0);
      emit('finish');
      clear();
    } else {
      remaining.value = r;
      emit('change', r);
    }
  }
  tick();
  timer = setInterval(tick, props.interval);
}

watch(() => [props.target, props.interval], start, { immediate: true });
onBeforeUnmount(clear);

const cls = computed(() => countDownClass({ size: props.size, className: props.className }));
const text = computed(() => formatRemaining(remaining.value, props.format));
</script>

<template>
  <span :class="cls">{{ text }}</span>
</template>
