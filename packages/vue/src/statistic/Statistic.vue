<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
  formatCountdown,
  formatNumber,
  statisticClass,
  type StatisticProps,
} from './variants';

const props = withDefaults(defineProps<StatisticProps>(), {
  precision: 0,
  separator: ',',
  decimal: '.',
  duration: 800,
  size: 'md',
  loading: false,
  format: 'HH:mm:ss',
});

const emit = defineEmits<{ finish: [] }>();

const display = ref(props.countdown == null ? props.value ?? 0 : 0);
const canAnimate = ref(false);
let raf: number | null = null;
let timer: ReturnType<typeof setInterval> | null = null;

function clearAnim() {
  if (raf) cancelAnimationFrame(raf);
  raf = null;
  if (timer) clearInterval(timer);
  timer = null;
}

function animateTo(target: number) {
  clearAnim();
  if (props.duration <= 0 || typeof window === 'undefined') {
    display.value = target;
    return;
  }
  const start = display.value || 0;
  const change = target - start;
  const startTime = performance.now();
  function step(now: number) {
    const t = Math.min(1, (now - startTime) / props.duration);
    const eased = 1 - Math.pow(1 - t, 3);
    display.value = start + change * eased;
    if (t < 1) raf = requestAnimationFrame(step);
  }
  raf = requestAnimationFrame(step);
}

function startCountdown() {
  clearAnim();
  if (props.countdown == null || typeof window === 'undefined') return;
  const targetMs = props.countdown instanceof Date ? props.countdown.getTime() : props.countdown;
  function update() {
    const remaining = targetMs - Date.now();
    if (remaining <= 0) {
      display.value = 0;
      emit('finish');
      if (timer) clearInterval(timer);
      timer = null;
      return;
    }
    display.value = remaining;
  }
  update();
  timer = setInterval(update, 1000);
}

watch(
  () => [props.value, props.countdown, canAnimate.value],
  () => {
    if (props.countdown != null) {
      if (canAnimate.value) startCountdown();
      else display.value = 0;
    } else if (props.value != null) {
      if (canAnimate.value) animateTo(props.value);
      else display.value = props.value;
    }
  },
  { immediate: true },
);

onMounted(() => {
  canAnimate.value = true;
});

onBeforeUnmount(clearAnim);

const text = computed(() => {
  if (props.loading) return '—';
  if (props.countdown != null) return formatCountdown(display.value, props.format);
  return formatNumber(display.value, props.precision, props.separator, props.decimal);
});

const cls = computed(() => statisticClass({ size: props.size, className: props.className }));
</script>

<template>
  <div :class="cls">
    <div v-if="label" class="cf-statistic__label">{{ label }}</div>
    <div class="cf-statistic__value">
      <span v-if="prefix" class="cf-statistic__prefix">{{ prefix }}</span>
      <span class="cf-statistic__number">{{ text }}</span>
      <span v-if="suffix" class="cf-statistic__suffix">{{ suffix }}</span>
    </div>
  </div>
</template>
