<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { backTopClass, smoothScrollTo, type BackTopProps } from './variants';

const props = withDefaults(defineProps<BackTopProps>(), {
  visibilityHeight: 200,
  size: 'md',
  duration: 320,
});

const emit = defineEmits<{ click: [] }>();

const visible = ref(false);
let scope: Window | Element | null = null;

function getScroll() {
  if (!scope) return 0;
  return scope instanceof Window ? window.scrollY : (scope as Element).scrollTop;
}

function update() {
  visible.value = getScroll() > props.visibilityHeight;
}

onMounted(() => {
  scope = window;
  if (props.target) {
    const el = document.querySelector(props.target);
    if (el) scope = el;
  }
  scope.addEventListener('scroll', update, { passive: true });
  update();
});

onBeforeUnmount(() => {
  if (scope) scope.removeEventListener('scroll', update);
});

function onClick() {
  if (scope) smoothScrollTo(scope, 0, props.duration);
  emit('click');
}

const cls = computed(() =>
  backTopClass({ size: props.size, visible: visible.value, className: props.className }),
);
</script>

<template>
  <button
    type="button"
    :class="cls"
    aria-label="返回顶部"
    @click="onClick"
  >
    <slot>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5l-6 6h4v8h4v-8h4z" fill="currentColor" />
      </svg>
    </slot>
  </button>
</template>
