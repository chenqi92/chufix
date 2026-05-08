<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import {
  selectClass,
  type SelectOption,
  type SelectProps,
  type SelectValue,
} from './variants';

const props = withDefaults(defineProps<SelectProps>(), {
  modelValue: null,
  options: () => [] as SelectOption[],
  placeholder: '请选择',
  variant: 'outline',
  size: 'md',
  disabled: false,
  clearable: false,
  error: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: SelectValue): void;
  (e: 'change', value: SelectValue): void;
}>();

const open = ref(false);
const activeIndex = ref(-1);
const rootRef = ref<HTMLDivElement | null>(null);
const listRef = ref<HTMLUListElement | null>(null);

const cls = computed(() =>
  selectClass({
    variant: props.variant,
    size: props.size,
    open: open.value,
    disabled: props.disabled,
    error: props.error,
  }),
);

const selected = computed(() =>
  props.options.find((o) => o.value === props.modelValue) ?? null,
);

function focusActive() {
  nextTick(() => {
    const el = listRef.value?.querySelectorAll<HTMLElement>('.ck-select__option')[
      activeIndex.value
    ];
    el?.scrollIntoView({ block: 'nearest' });
  });
}

function openMenu() {
  if (props.disabled || open.value) return;
  open.value = true;
  const idx = props.options.findIndex((o) => o.value === props.modelValue);
  activeIndex.value = idx >= 0 ? idx : props.options.findIndex((o) => !o.disabled);
  document.addEventListener('mousedown', onDocClick);
  focusActive();
}

function closeMenu() {
  if (!open.value) return;
  open.value = false;
  document.removeEventListener('mousedown', onDocClick);
}

function onDocClick(e: MouseEvent) {
  if (!rootRef.value) return;
  if (!rootRef.value.contains(e.target as Node)) closeMenu();
}

function pick(opt: SelectOption) {
  if (opt.disabled) return;
  emit('update:modelValue', opt.value);
  emit('change', opt.value);
  closeMenu();
}

function clear(e: MouseEvent) {
  e.stopPropagation();
  emit('update:modelValue', null);
  emit('change', null);
}

function moveActive(delta: number) {
  if (!props.options.length) return;
  let i = activeIndex.value;
  for (let n = 0; n < props.options.length; n++) {
    i = (i + delta + props.options.length) % props.options.length;
    if (!props.options[i].disabled) break;
  }
  activeIndex.value = i;
  focusActive();
}

function onKeydown(e: KeyboardEvent) {
  if (props.disabled) return;
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (!open.value) openMenu();
    else moveActive(1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (!open.value) openMenu();
    else moveActive(-1);
  } else if (e.key === 'Enter' || e.key === ' ') {
    if (!open.value) {
      e.preventDefault();
      openMenu();
    } else if (activeIndex.value >= 0) {
      e.preventDefault();
      pick(props.options[activeIndex.value]);
    }
  } else if (e.key === 'Escape') {
    if (open.value) {
      e.preventDefault();
      closeMenu();
    }
  } else if (e.key === 'Tab') {
    closeMenu();
  }
}

watch(() => props.options, () => {
  if (activeIndex.value >= props.options.length) activeIndex.value = -1;
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocClick);
});
</script>

<template>
  <div ref="rootRef" :class="cls">
    <button
      type="button"
      class="ck-select__trigger"
      :disabled="disabled"
      :aria-haspopup="'listbox'"
      :aria-expanded="open"
      @click="open ? closeMenu() : openMenu()"
      @keydown="onKeydown"
    >
      <span class="ck-select__value">
        <template v-if="selected">{{ selected.label }}</template>
        <span v-else class="ck-select__placeholder">{{ placeholder }}</span>
      </span>
      <span
        v-if="clearable && selected && !disabled"
        class="ck-select__clear"
        role="button"
        tabindex="-1"
        aria-label="清除"
        @click="clear"
      >×</span>
      <svg class="ck-select__caret" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <ul
      v-if="open"
      ref="listRef"
      class="ck-select__menu"
      role="listbox"
    >
      <li
        v-for="(opt, i) in options"
        :key="String(opt.value)"
        class="ck-select__option"
        :class="{
          'is-active': i === activeIndex,
          'is-selected': opt.value === modelValue,
          'is-disabled': opt.disabled,
        }"
        role="option"
        :aria-selected="opt.value === modelValue"
        @mouseenter="!opt.disabled && (activeIndex = i)"
        @mousedown.prevent="pick(opt)"
      >
        {{ opt.label }}
        <svg
          v-if="opt.value === modelValue"
          class="ck-select__check"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </li>
      <li v-if="!options.length" class="ck-select__empty">无选项</li>
    </ul>
  </div>
</template>
