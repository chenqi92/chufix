<script setup lang="ts">
import { computed } from 'vue';
import {
  displayLabel,
  protocolBadgeClass,
  type ProtocolBadgeProps,
} from './variants';

const props = withDefaults(defineProps<ProtocolBadgeProps>(), {
  size: 'md',
});

const cls = computed(() => protocolBadgeClass(props));
const label = computed(() => displayLabel(props.kind));
</script>

<template>
  <span :class="cls" role="img" :aria-label="label">{{ label }}</span>
</template>
