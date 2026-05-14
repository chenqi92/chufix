<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useSwipe } from '../composables/useSwipe';
import { carouselClass, type CarouselProps } from './variants';

const props = withDefaults(defineProps<CarouselProps>(), {
  defaultValue: 0,
  autoplay: false,
  interval: 4000,
  loop: true,
  controls: true,
  indicators: true,
  size: 'md',
});

const emit = defineEmits<{ 'update:modelValue': [value: number] }>();

const isControlled = computed(() => props.modelValue !== undefined);
const internal = ref(props.defaultValue ?? 0);
const current = computed(() =>
  isControlled.value ? (props.modelValue as number) : internal.value,
);
const total = computed(() => props.items.length);

let timer: ReturnType<typeof setInterval> | null = null;
const hovered = ref(false);

function go(index: number) {
  if (total.value === 0) return;
  let next = index;
  if (props.loop) {
    next = ((index % total.value) + total.value) % total.value;
  } else {
    next = Math.max(0, Math.min(total.value - 1, index));
  }
  if (!isControlled.value) internal.value = next;
  emit('update:modelValue', next);
}

function next() { go(current.value + 1); }
function prev() { go(current.value - 1); }

function startTimer() {
  stopTimer();
  if (!props.autoplay || hovered.value) return;
  timer = setInterval(() => {
    next();
  }, props.interval);
}

function stopTimer() {
  if (timer) clearInterval(timer);
  timer = null;
}

onMounted(startTimer);
onBeforeUnmount(stopTimer);
watch(() => [props.autoplay, props.interval, hovered.value, total.value], startTimer);

const cls = computed(() => carouselClass({ size: props.size, className: props.className }));
const trackStyle = computed(() => ({ transform: `translateX(-${current.value * 100}%)` }));

const viewportRef = ref<HTMLElement | null>(null);
useSwipe(viewportRef, {
  axis: 'x',
  onSwipe(dir) {
    if (dir === 'left') next();
    else if (dir === 'right') prev();
  },
});
</script>

<template>
  <div
    :class="cls"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <div ref="viewportRef" class="cf-carousel__viewport">
      <div class="cf-carousel__track" :style="trackStyle">
        <div
          v-for="(item, i) in items"
          :key="item.key ?? i"
          class="cf-carousel__slide"
        >
          <slot :item="item" :index="i">
            <img v-if="item.src" :src="item.src" :alt="item.alt ?? ''" />
          </slot>
        </div>
      </div>
    </div>

    <button
      v-if="controls && total > 1"
      type="button"
      class="cf-carousel__control cf-carousel__control--prev"
      aria-label="上一项"
      :disabled="!loop && current === 0"
      @click="prev"
    >‹</button>
    <button
      v-if="controls && total > 1"
      type="button"
      class="cf-carousel__control cf-carousel__control--next"
      aria-label="下一项"
      :disabled="!loop && current === total - 1"
      @click="next"
    >›</button>

    <div v-if="indicators && total > 1" class="cf-carousel__indicators">
      <button
        v-for="(_, i) in items"
        :key="i"
        type="button"
        :class="['cf-carousel__indicator', i === current && 'is-active']"
        :aria-label="`第 ${i + 1} 项`"
        :aria-current="i === current ? 'true' : undefined"
        @click="go(i)"
      />
    </div>
  </div>
</template>
