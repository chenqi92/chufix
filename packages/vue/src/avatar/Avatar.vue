<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  avatarClass,
  initialsFromName,
  type AvatarProps,
} from './variants';

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'md',
  shape: 'circle',
});

const failed = ref(false);

watch(
  () => props.src,
  () => {
    failed.value = false;
  },
);

const cls = computed(() => avatarClass({ size: props.size, shape: props.shape }));
const showImage = computed(() => !!props.src && !failed.value);
const initials = computed(() => initialsFromName(props.name, props.fallback));
</script>

<template>
  <span :class="cls" role="img" :aria-label="alt || name">
    <img
      v-if="showImage"
      class="ck-avatar__img"
      :src="src"
      :alt="alt || name || ''"
      @error="failed = true"
    />
    <span v-else-if="$slots.default" class="ck-avatar__icon"><slot /></span>
    <span v-else class="ck-avatar__initials">{{ initials }}</span>
  </span>
</template>
