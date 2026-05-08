<script setup lang="ts">
import { computed } from 'vue';
import { cardClass, type CardProps } from './variants';

const props = withDefaults(defineProps<CardProps>(), {
  variant: 'outlined',
  interactive: false,
  as: 'div',
});

defineEmits<{ (e: 'click', evt: MouseEvent): void }>();

const cls = computed(() =>
  cardClass({ variant: props.variant, interactive: props.interactive }),
);
</script>

<template>
  <component
    :is="as"
    :class="cls"
    :tabindex="interactive ? 0 : undefined"
    :role="interactive ? 'button' : undefined"
    @click="(e: MouseEvent) => $emit('click', e)"
  >
    <div v-if="$slots.header" class="cf-card__header">
      <slot name="header" />
    </div>
    <div v-if="$slots.default" class="cf-card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="cf-card__footer">
      <slot name="footer" />
    </div>
  </component>
</template>
