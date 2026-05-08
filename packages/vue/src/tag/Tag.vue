<script setup lang="ts">
import { computed } from 'vue';
import { tagClass, type TagProps } from './variants';

const props = withDefaults(defineProps<TagProps>(), {
  variant: 'soft',
  size: 'md',
  tone: 'neutral',
  closable: false,
  rounded: false,
});

const emit = defineEmits<{
  (e: 'close', ev: MouseEvent): void;
}>();

const cls = computed(() =>
  tagClass({
    variant: props.variant,
    size: props.size,
    tone: props.tone,
    rounded: props.rounded,
  }),
);
</script>

<template>
  <span :class="cls">
    <span v-if="$slots.leading" class="ck-tag__leading"><slot name="leading" /></span>
    <slot />
    <button
      v-if="closable"
      type="button"
      class="ck-tag__close"
      aria-label="关闭"
      @click="(e) => emit('close', e)"
    >×</button>
  </span>
</template>
