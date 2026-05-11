<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue';
import {
  computeGeometry,
  tourClass,
  type TourGeometry,
  type TourProps,
} from './variants';

const props = withDefaults(defineProps<TourProps>(), {
  defaultValue: false,
  defaultCurrent: 0,
});

const emit = defineEmits<{
  'update:modelValue': [v: boolean];
  'update:current': [n: number];
  finish: [];
  close: [];
}>();

const isOpenControlled = computed(() => props.modelValue !== undefined);
const internalOpen = ref(props.defaultValue);
const open = computed(() =>
  isOpenControlled.value ? !!props.modelValue : internalOpen.value,
);

const isCurrentControlled = computed(() => props.current !== undefined);
const internalCurrent = ref(props.defaultCurrent);
const currentIndex = computed(() =>
  isCurrentControlled.value ? (props.current as number) : internalCurrent.value,
);

const currentStep = computed(() => props.steps[currentIndex.value]);

const geometry = ref<TourGeometry | null>(null);
const canRender = ref(false);

function setOpen(v: boolean) {
  if (!isOpenControlled.value) internalOpen.value = v;
  emit('update:modelValue', v);
  if (!v) emit('close');
}

function setCurrent(n: number) {
  if (!isCurrentControlled.value) internalCurrent.value = n;
  emit('update:current', n);
}

function recompute() {
  if (typeof document === 'undefined') return;
  const step = currentStep.value;
  if (!step) {
    geometry.value = null;
    return;
  }
  const el = document.querySelector(step.target);
  if (!el) {
    geometry.value = null;
    return;
  }
  geometry.value = computeGeometry(el, step.placement ?? 'bottom');
}

function next() {
  if (currentIndex.value >= props.steps.length - 1) {
    emit('finish');
    setOpen(false);
    setCurrent(0);
  } else {
    setCurrent(currentIndex.value + 1);
  }
}

function prev() {
  if (currentIndex.value > 0) setCurrent(currentIndex.value - 1);
}

function close() {
  setOpen(false);
}

watch([open, currentIndex], () => nextTick(recompute), { immediate: false });

onMounted(() => {
  if (typeof window === 'undefined') return;
  canRender.value = true;
  recompute();
  window.addEventListener('scroll', recompute, true);
  window.addEventListener('resize', recompute);
});

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return;
  window.removeEventListener('scroll', recompute, true);
  window.removeEventListener('resize', recompute);
});

const cls = computed(() => tourClass({ className: props.className }));
</script>

<template>
  <Teleport v-if="canRender" to="body">
    <div v-if="open && currentStep" :class="cls">
      <div class="cf-tour__backdrop" @click="close" />
      <div
        v-if="geometry"
        class="cf-tour__highlight"
        :style="geometry.highlightStyle"
      />
      <div
        v-if="geometry"
        class="cf-tour__popover"
        :style="geometry.popoverStyle"
        role="dialog"
        @click.stop
      >
        <h4 class="cf-tour__title">{{ currentStep.title }}</h4>
        <p v-if="currentStep.description" class="cf-tour__desc">{{ currentStep.description }}</p>
        <div class="cf-tour__footer">
          <span class="cf-tour__progress">{{ currentIndex + 1 }} / {{ steps.length }}</span>
          <div class="cf-tour__actions">
            <button
              v-if="currentIndex > 0"
              type="button"
              class="cf-tour__btn cf-tour__btn--ghost"
              @click="prev"
            >上一步</button>
            <button
              type="button"
              class="cf-tour__btn cf-tour__btn--ghost"
              @click="close"
            >跳过</button>
            <button
              type="button"
              class="cf-tour__btn cf-tour__btn--primary"
              @click="next"
            >{{ currentIndex < steps.length - 1 ? '下一步' : '完成' }}</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
