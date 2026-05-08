<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  type AccordionProps,
  type AccordionItem,
  accordionClass,
} from './variants';

const props = withDefaults(defineProps<AccordionProps>(), {
  items: () => [],
  mode: 'single',
  variant: 'bordered',
});
const emit = defineEmits<{
  (e: 'update:modelValue', v: string | string[]): void;
}>();

function toArray(v: string | string[] | undefined): string[] {
  if (v == null) return [];
  return Array.isArray(v) ? v : v ? [v] : [];
}

const inner = ref<string[]>(
  toArray(props.modelValue ?? props.defaultOpen)
);
const open = computed<string[]>(() =>
  props.modelValue !== undefined
    ? toArray(props.modelValue)
    : inner.value
);
watch(
  () => props.modelValue,
  (v) => {
    if (v !== undefined) inner.value = toArray(v);
  }
);

function isOpen(value: string): boolean {
  return open.value.includes(value);
}

function toggle(item: AccordionItem) {
  if (item.disabled) return;
  let next: string[];
  if (props.mode === 'multiple') {
    next = isOpen(item.value)
      ? open.value.filter((x) => x !== item.value)
      : [...open.value, item.value];
  } else {
    next = isOpen(item.value) ? [] : [item.value];
  }
  inner.value = next;
  const out: string | string[] = props.mode === 'multiple' ? next : (next[0] ?? '');
  emit('update:modelValue', out);
}

const cls = computed(() => accordionClass({ variant: props.variant! }));
</script>

<template>
  <div :class="cls">
    <div
      v-for="item in items"
      :key="item.value"
      class="cf-accordion__item"
      :class="{ 'is-open': isOpen(item.value), 'is-disabled': item.disabled }"
    >
      <button
        type="button"
        class="cf-accordion__trigger"
        :aria-expanded="isOpen(item.value)"
        :disabled="item.disabled || undefined"
        @click="toggle(item)"
      >
        <span class="cf-accordion__title">
          <slot :name="`title-${item.value}`">{{ item.title }}</slot>
        </span>
        <svg class="cf-accordion__chevron" viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>
      <div
        v-show="isOpen(item.value)"
        class="cf-accordion__panel"
        role="region"
      >
        <div class="cf-accordion__panel-inner">
          <slot :name="item.value">{{ item.content }}</slot>
        </div>
      </div>
    </div>
  </div>
</template>
