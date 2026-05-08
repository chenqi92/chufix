<script setup lang="ts">
import { computed } from 'vue';
import { type SkeletonProps, skeletonClass } from './variants';

const props = withDefaults(defineProps<SkeletonProps>(), {
  shape: 'rect',
  lines: 1,
  static: false,
});

function dim(v: string | number | undefined): string | undefined {
  if (v == null) return undefined;
  return typeof v === 'number' ? `${v}px` : v;
}

const rootClass = computed(() =>
  skeletonClass({ shape: props.shape!, isStatic: props.static! })
);

const style = computed(() => {
  const w = dim(props.width);
  const h = dim(props.height);
  const out: Record<string, string> = {};
  if (w) out.width = w;
  if (h) out.height = h;
  return out;
});
</script>

<template>
  <span v-if="shape === 'text' && lines > 1" class="ck-skeleton-stack">
    <span
      v-for="i in lines"
      :key="i"
      :class="rootClass"
      :style="i === lines ? { ...style, width: '60%' } : style"
    />
  </span>
  <span v-else :class="rootClass" :style="style" />
</template>
