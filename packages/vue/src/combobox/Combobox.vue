<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import {
  comboboxClass,
  defaultFilter,
  type ComboboxOption,
  type ComboboxProps,
  type ComboboxValue,
} from './variants';

const props = withDefaults(defineProps<ComboboxProps>(), {
  modelValue: null,
  options: () => [] as ComboboxOption[],
  placeholder: '请选择或输入',
  variant: 'outline',
  size: 'md',
  disabled: false,
  clearable: false,
  error: false,
  allowCreate: false,
  emptyText: '无匹配项',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: ComboboxValue): void;
  (e: 'change', value: ComboboxValue): void;
  (e: 'create', value: string): void;
}>();

const open = ref(false);
const query = ref('');
const activeIndex = ref(-1);
const rootRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const listRef = ref<HTMLUListElement | null>(null);

const cls = computed(() =>
  comboboxClass({
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

const filtered = computed(() => {
  const fn = props.filter ?? defaultFilter;
  return props.options.filter((o) => fn(query.value, o));
});

const showCreate = computed(
  () =>
    props.allowCreate &&
    query.value.length > 0 &&
    !filtered.value.some((o) => o.label === query.value),
);

watch(
  () => props.modelValue,
  () => {
    if (!open.value) query.value = selected.value?.label ?? '';
  },
  { immediate: true },
);

function focusActive() {
  nextTick(() => {
    const el = listRef.value?.querySelectorAll<HTMLElement>(
      '.cf-combobox__option',
    )[activeIndex.value];
    el?.scrollIntoView({ block: 'nearest' });
  });
}

function openMenu() {
  if (props.disabled || open.value) return;
  open.value = true;
  query.value = '';
  activeIndex.value = filtered.value.findIndex((o) => !o.disabled);
  document.addEventListener('mousedown', onDocClick);
  nextTick(() => inputRef.value?.focus());
}

function closeMenu() {
  if (!open.value) return;
  open.value = false;
  query.value = selected.value?.label ?? '';
  document.removeEventListener('mousedown', onDocClick);
}

function onDocClick(e: MouseEvent) {
  if (!rootRef.value) return;
  if (!rootRef.value.contains(e.target as Node)) closeMenu();
}

function pick(opt: ComboboxOption) {
  if (opt.disabled) return;
  emit('update:modelValue', opt.value);
  emit('change', opt.value);
  closeMenu();
}

function createTag() {
  const v = query.value.trim();
  if (!v) return;
  emit('create', v);
  emit('update:modelValue', v);
  emit('change', v);
  closeMenu();
}

function clear(e: MouseEvent) {
  e.stopPropagation();
  emit('update:modelValue', null);
  emit('change', null);
  query.value = '';
  inputRef.value?.focus();
}

function moveActive(delta: number) {
  const total = filtered.value.length + (showCreate.value ? 1 : 0);
  if (!total) return;
  let i = activeIndex.value;
  for (let n = 0; n < total; n++) {
    i = (i + delta + total) % total;
    const isCreate = i === filtered.value.length;
    if (isCreate) break;
    if (!filtered.value[i]?.disabled) break;
  }
  activeIndex.value = i;
  focusActive();
}

function onInput(e: Event) {
  query.value = (e.target as HTMLInputElement).value;
  if (!open.value) {
    open.value = true;
    document.addEventListener('mousedown', onDocClick);
  }
  activeIndex.value = filtered.value.findIndex((o) => !o.disabled);
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
  } else if (e.key === 'Enter') {
    if (!open.value) return;
    e.preventDefault();
    if (showCreate.value && activeIndex.value === filtered.value.length) {
      createTag();
    } else if (activeIndex.value >= 0 && filtered.value[activeIndex.value]) {
      pick(filtered.value[activeIndex.value]);
    } else if (props.allowCreate && query.value.trim()) {
      createTag();
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

watch(filtered, () => {
  if (activeIndex.value >= filtered.value.length + (showCreate.value ? 1 : 0)) {
    activeIndex.value = -1;
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocClick);
});
</script>

<template>
  <div ref="rootRef" :class="cls">
    <div class="cf-combobox__trigger" @click="openMenu">
      <input
        ref="inputRef"
        :id="id"
        :name="name"
        type="text"
        class="cf-combobox__input"
        :value="query"
        :placeholder="selected ? selected.label : placeholder"
        :disabled="disabled"
        :aria-expanded="open"
        :aria-haspopup="'listbox'"
        autocomplete="off"
        @input="onInput"
        @focus="openMenu"
        @keydown="onKeydown"
      />
      <span
        v-if="clearable && selected && !disabled"
        class="cf-combobox__clear"
        role="button"
        tabindex="-1"
        aria-label="清除"
        @mousedown.prevent="clear"
      >×</span>
      <svg
        class="cf-combobox__caret"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <path
          d="M4 6l4 4 4-4"
          stroke="currentColor"
          stroke-width="1.6"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <ul
      v-if="open"
      ref="listRef"
      class="cf-combobox__menu"
      role="listbox"
    >
      <li
        v-for="(opt, i) in filtered"
        :key="String(opt.value)"
        class="cf-combobox__option"
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
          class="cf-combobox__check"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 8.5l3.2 3.2L13 5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </li>
      <li
        v-if="showCreate"
        class="cf-combobox__option cf-combobox__option--create"
        :class="{ 'is-active': activeIndex === filtered.length }"
        role="option"
        @mouseenter="activeIndex = filtered.length"
        @mousedown.prevent="createTag"
      >
        创建 "{{ query }}"
      </li>
      <li
        v-if="!filtered.length && !showCreate"
        class="cf-combobox__empty"
      >
        {{ emptyText }}
      </li>
    </ul>
  </div>
</template>
