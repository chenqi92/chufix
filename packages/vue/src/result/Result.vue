<script setup lang="ts">
import { computed } from 'vue';
import { resultClass, resultDefaultTitle, type ResultProps } from './variants';
import StatusIllustration from '../statusillustration/StatusIllustration.vue';
import type { StatusIllustrationVariant } from '../statusillustration/variants';

const props = withDefaults(defineProps<ResultProps>(), {
  status: 'info',
  imageAlt: '',
  size: 'md',
});

const cls = computed(() =>
  resultClass({ status: props.status, size: props.size, className: props.className }),
);
const finalTitle = computed(() => props.title ?? resultDefaultTitle(props.status));

const illustrationVariant = computed<StatusIllustrationVariant>(() => {
  switch (props.status) {
    case 'success': return 'success';
    case 'warning': return 'warning';
    case 'error': return 'error';
    case '404': return 'not-found';
    case '403': return 'forbidden';
    case '500': return 'server-error';
    case 'info':
    default:
      return 'info';
  }
});
</script>

<template>
  <div :class="cls">
    <div class="cf-result__icon">
      <slot name="icon">
        <img v-if="image" class="cf-result__image" :src="image" :alt="imageAlt" />
        <StatusIllustration v-else :variant="illustrationVariant" :size="size" />
      </slot>
    </div>
    <div class="cf-result__title">
      <slot name="title">{{ finalTitle }}</slot>
    </div>
    <div v-if="$slots.description || description" class="cf-result__description">
      <slot name="description">{{ description }}</slot>
    </div>
    <div v-if="$slots.extra" class="cf-result__extra">
      <slot name="extra" />
    </div>
  </div>
</template>
