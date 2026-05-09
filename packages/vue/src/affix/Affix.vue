<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { affixClass, type AffixProps } from './variants';

const props = defineProps<AffixProps>();
const emit = defineEmits<{ change: [fixed: boolean] }>();

const fixed = ref(false);
const placeholder = ref<HTMLDivElement | null>(null);
const inner = ref<HTMLDivElement | null>(null);
const innerStyle = ref<Record<string, string>>({});
let scope: Window | Element | null = null;

function getViewportTop() {
  if (!scope || scope instanceof Window) return 0;
  const rect = (scope as Element).getBoundingClientRect();
  return rect.top;
}

function getViewportBottom() {
  if (!scope || scope instanceof Window) return typeof window !== 'undefined' ? window.innerHeight : 0;
  const rect = (scope as Element).getBoundingClientRect();
  return rect.bottom;
}

function update() {
  if (!placeholder.value || !inner.value) return;
  const rect = placeholder.value.getBoundingClientRect();
  const viewportTop = getViewportTop();
  const viewportBottom = getViewportBottom();

  if (props.offsetTop !== undefined) {
    const shouldFix = rect.top < viewportTop + props.offsetTop;
    if (shouldFix !== fixed.value) emit('change', shouldFix);
    fixed.value = shouldFix;
    if (shouldFix) {
      const left = scope instanceof Window ? rect.left : rect.left;
      innerStyle.value = {
        position: 'fixed',
        top: `${viewportTop + props.offsetTop}px`,
        left: `${left}px`,
        width: `${rect.width}px`,
        zIndex: String(props.zIndex ?? 100),
      };
    } else {
      innerStyle.value = {};
    }
    return;
  }

  if (props.offsetBottom !== undefined) {
    const shouldFix = rect.bottom > viewportBottom - props.offsetBottom;
    if (shouldFix !== fixed.value) emit('change', shouldFix);
    fixed.value = shouldFix;
    if (shouldFix) {
      const left = rect.left;
      innerStyle.value = {
        position: 'fixed',
        bottom: `${(scope instanceof Window ? 0 : window.innerHeight - viewportBottom) + props.offsetBottom}px`,
        left: `${left}px`,
        width: `${rect.width}px`,
        zIndex: String(props.zIndex ?? 100),
      };
    } else {
      innerStyle.value = {};
    }
  }
}

onMounted(() => {
  scope = window;
  if (props.target) {
    const el = document.querySelector(props.target);
    if (el) scope = el;
  }
  scope.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
});

onBeforeUnmount(() => {
  if (scope) scope.removeEventListener('scroll', update);
  if (typeof window !== 'undefined') window.removeEventListener('resize', update);
});

const cls = computed(() => affixClass({ fixed: fixed.value, className: props.className }));
const placeholderStyle = computed(() => {
  if (!fixed.value || !placeholder.value) return undefined;
  const rect = placeholder.value.getBoundingClientRect();
  return { width: `${rect.width}px`, height: `${rect.height}px` } as Record<string, string>;
});
</script>

<template>
  <div ref="placeholder" :class="cls" :style="placeholderStyle">
    <div ref="inner" :style="innerStyle">
      <slot />
    </div>
  </div>
</template>
