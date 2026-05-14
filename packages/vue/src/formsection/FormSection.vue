<script setup lang="ts">
import { computed, ref } from 'vue';
import type { FormSectionProps } from './variants';

const props = withDefaults(defineProps<FormSectionProps>(), {
  collapsible: false,
  defaultOpen: true,
});

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void;
}>();

const isControlled = computed(() => typeof props.open === 'boolean');
const internal = ref(props.defaultOpen);
const open = computed(() => (isControlled.value ? (props.open as boolean) : internal.value));

function toggle() {
  if (!props.collapsible) return;
  const next = !open.value;
  if (!isControlled.value) internal.value = next;
  emit('update:open', next);
}
</script>

<template>
  <section :class="['cf-formsection', collapsible && 'is-collapsible', open && 'is-open']" :id="anchor">
    <header
      v-if="title || description"
      class="cf-formsection__head"
      :class="collapsible && 'is-clickable'"
      :role="collapsible ? 'button' : undefined"
      :aria-expanded="collapsible ? open : undefined"
      :tabindex="collapsible ? 0 : undefined"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
    >
      <div class="cf-formsection__head-text">
        <h3 v-if="title" class="cf-formsection__title">{{ title }}</h3>
        <p v-if="description" class="cf-formsection__description">{{ description }}</p>
      </div>
      <svg
        v-if="collapsible"
        class="cf-formsection__caret"
        viewBox="0 0 16 16"
        width="14"
        height="14"
        aria-hidden="true"
      >
        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </header>
    <div v-if="open" class="cf-formsection__body">
      <slot />
    </div>
  </section>
</template>
