<script setup lang="ts">
import { computed } from 'vue';
import { type EmptyProps, emptyClass } from './variants';
import StatusIllustration from '../statusillustration/StatusIllustration.vue';

const props = withDefaults(defineProps<EmptyProps>(), {
  title: '暂无数据',
  size: 'md',
});

const rootClass = computed(() => emptyClass({ size: props.size! }));
</script>

<template>
  <div :class="rootClass" role="status">
    <div class="cf-empty__icon">
      <slot name="icon">
        <StatusIllustration variant="empty" />
      </slot>
    </div>
    <div class="cf-empty__title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div v-if="description || $slots.description" class="cf-empty__desc">
      <slot name="description">{{ description }}</slot>
    </div>
    <div v-if="$slots.action" class="cf-empty__action">
      <slot name="action" />
    </div>
  </div>
</template>
