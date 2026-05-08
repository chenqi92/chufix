<script setup lang="ts">
import { computed } from 'vue';
import { type SearchInputProps, searchInputClass } from './variants';

const props = withDefaults(defineProps<SearchInputProps>(), {
  modelValue: '',
  placeholder: '搜索…',
  size: 'md',
  disabled: false,
  clearable: true,
});
const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
  (e: 'search', v: string): void;
  (e: 'clear'): void;
}>();

const cls = computed(() => searchInputClass({ size: props.size! }));

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
}
function onSubmit(e: Event) {
  e.preventDefault();
  emit('search', props.modelValue || '');
}
function clear() {
  emit('update:modelValue', '');
  emit('clear');
}
</script>

<template>
  <form :class="cls" role="search" @submit="onSubmit">
    <span class="cf-search__icon" aria-hidden="true">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="7" cy="7" r="5" />
        <path d="M14 14l-3-3" />
      </svg>
    </span>
    <input
      class="cf-search__native"
      type="search"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled || undefined"
      @input="onInput"
    />
    <button
      v-if="clearable && modelValue && !disabled"
      type="button"
      class="cf-search__clear"
      aria-label="清空"
      @click="clear"
    >
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
        <path d="M4 4l8 8M12 4l-8 8" />
      </svg>
    </button>
    <kbd v-if="shortcut" class="cf-search__shortcut">{{ shortcut }}</kbd>
  </form>
</template>
