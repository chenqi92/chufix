<script setup lang="ts">
import { computed } from 'vue';
import {
  statusCodeBadgeClass,
  type StatusCodeBadgeProps,
} from './variants';

const props = withDefaults(defineProps<StatusCodeBadgeProps>(), {
  size: 'md',
});

const cls = computed(() => statusCodeBadgeClass(props));
const ariaLabel = computed(() =>
  props.reason ? `${props.code} ${props.reason}` : String(props.code),
);
</script>

<template>
  <span :class="cls" role="img" :aria-label="ariaLabel">
    <span class="cf-statuscode__code">{{ code }}</span>
    <span v-if="reason" class="cf-statuscode__reason">{{ reason }}</span>
  </span>
</template>
