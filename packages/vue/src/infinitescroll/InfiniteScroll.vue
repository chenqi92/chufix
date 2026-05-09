<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { infiniteScrollClass, type InfiniteScrollProps } from './variants';

const props = withDefaults(defineProps<InfiniteScrollProps>(), {
  loading: false,
  finished: false,
  threshold: 100,
});

const emit = defineEmits<{ load: [] }>();

const sentinel = ref<HTMLDivElement | null>(null);
let io: IntersectionObserver | null = null;

function fire() {
  if (props.loading || props.finished) return;
  emit('load');
}

function setup() {
  if (typeof window === 'undefined' || !sentinel.value) return;
  io?.disconnect();
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) fire();
      }
    },
    { rootMargin: `${props.threshold}px` },
  );
  io.observe(sentinel.value);
}

onMounted(setup);
watch(() => [props.loading, props.finished, props.threshold], setup);

onBeforeUnmount(() => {
  io?.disconnect();
  io = null;
});

const cls = computed(() => infiniteScrollClass({ className: props.className }));
</script>

<template>
  <div :class="cls">
    <slot />
    <div ref="sentinel" class="cf-infscroll__sentinel" aria-hidden="true">
      <div v-if="loading" class="cf-infscroll__hint">
        <slot name="loading">加载中…</slot>
      </div>
      <div v-else-if="finished" class="cf-infscroll__hint">
        <slot name="finished">没有更多了</slot>
      </div>
    </div>
  </div>
</template>
