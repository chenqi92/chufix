<script setup lang="ts">
import { computed, ref } from 'vue';
import type { FilterSectionProps } from './variants';

const props = withDefaults(defineProps<FilterSectionProps>(), {
  defaultOpen: true,
});

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void;
}>();

const isControlled = computed(() => typeof props.open === 'boolean');
const internal = ref(props.defaultOpen);
const open = computed(() => (isControlled.value ? (props.open as boolean) : internal.value));

function toggle() {
  const next = !open.value;
  if (!isControlled.value) internal.value = next;
  emit('update:open', next);
}
</script>

<template>
  <section :class="['cf-filterpanel__section', open && 'is-open']">
    <button
      type="button"
      class="cf-filterpanel__section-head"
      :aria-expanded="open"
      @click="toggle"
    >
      <span class="cf-filterpanel__section-title">{{ title }}</span>
      <span v-if="count" class="cf-filterpanel__section-count">{{ count }}</span>
      <svg class="cf-filterpanel__section-caret" viewBox="0 0 16 16" width="12" height="12">
        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <div v-if="open" class="cf-filterpanel__section-body">
      <slot />
    </div>
  </section>
</template>
