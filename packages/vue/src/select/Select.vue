<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import {
  type SelectChangeMeta,
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
  multiple: false,
  searchable: false,
  loading: false,
  emptyText: '无选项',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: SelectValue): void;
  (e: 'change', value: SelectValue, meta: SelectChangeMeta): void;
  (e: 'select', option: SelectOption): void;
  (e: 'clear'): void;
  (e: 'openChange', open: boolean): void;
  (e: 'activeChange', option: SelectOption | null, index: number): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'search', term: string): void;
}>();

const open = ref(false);
const activeIndex = ref(-1);
const rootRef = ref<HTMLDivElement | null>(null);
const listRef = ref<HTMLUListElement | null>(null);
const searchRef = ref<HTMLInputElement | null>(null);
const term = ref('');
const menuId = computed(() => `${props.id ?? 'cf-select'}-menu`);

const cls = computed(() =>
  selectClass({
    variant: props.variant,
    size: props.size,
    open: open.value,
    disabled: props.disabled,
    error: props.error,
  }),
);

/* Single vs multi value handling */
const valueArr = computed<Array<string | number>>(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) ? props.modelValue : [];
  }
  return props.modelValue == null
    ? []
    : ([props.modelValue] as Array<string | number>);
});

function isSelected(opt: SelectOption): boolean {
  return valueArr.value.includes(opt.value);
}

const selected = computed<SelectOption | null>(() => {
  if (props.multiple) return null;
  return props.options.find((o) => o.value === props.modelValue) ?? null;
});

const selectedTags = computed<SelectOption[]>(() => {
  if (!props.multiple) return [];
  return valueArr.value
    .map((v) => props.options.find((o) => o.value === v))
    .filter((o): o is SelectOption => !!o);
});

/* filtered options + grouping */
const filteredOptions = computed<SelectOption[]>(() => {
  if (!props.searchable || !term.value.trim()) return props.options;
  const q = term.value.trim().toLowerCase();
  return props.options.filter((o) => o.label.toLowerCase().includes(q));
});

interface RenderRow {
  type: 'header' | 'option';
  group?: string;
  option?: SelectOption;
  optIndex?: number;
}
const renderRows = computed<RenderRow[]>(() => {
  const rows: RenderRow[] = [];
  const opts = filteredOptions.value;
  const hasGroups = opts.some((o) => o.group);
  if (!hasGroups) {
    opts.forEach((o, i) => rows.push({ type: 'option', option: o, optIndex: i }));
    return rows;
  }
  // group with stable order: first encounter wins; ungrouped at the bottom under "其他"
  const seen: string[] = [];
  for (const o of opts) {
    const g = o.group ?? '__';
    if (!seen.includes(g)) seen.push(g);
  }
  for (const g of seen) {
    if (g !== '__') rows.push({ type: 'header', group: g });
    opts.forEach((o, i) => {
      if ((o.group ?? '__') === g) rows.push({ type: 'option', option: o, optIndex: i });
    });
  }
  return rows;
});

function focusActive() {
  nextTick(() => {
    const el = listRef.value?.querySelectorAll<HTMLElement>('.cf-select__option')[
      activeIndex.value
    ];
    el?.scrollIntoView({ block: 'nearest' });
  });
}

function optionId(index: number) {
  return `${menuId.value}-option-${index}`;
}

function setActive(index: number) {
  activeIndex.value = index;
  emit('activeChange', index >= 0 ? filteredOptions.value[index] : null, index);
  focusActive();
}

function openMenu() {
  if (props.disabled || open.value) return;
  open.value = true;
  const opts = filteredOptions.value;
  const idx = opts.findIndex((o) => isSelected(o));
  setActive(idx >= 0 ? idx : opts.findIndex((o) => !o.disabled));
  document.addEventListener('mousedown', onDocClick);
  emit('openChange', true);
  if (props.searchable) nextTick(() => searchRef.value?.focus());
}

function closeMenu() {
  if (!open.value) return;
  open.value = false;
  if (props.searchable) term.value = '';
  document.removeEventListener('mousedown', onDocClick);
  emit('openChange', false);
}

function onDocClick(e: MouseEvent) {
  if (!rootRef.value) return;
  if (!rootRef.value.contains(e.target as Node)) closeMenu();
}

function pick(opt: SelectOption) {
  if (opt.disabled) return;
  if (props.multiple) {
    const arr = valueArr.value.slice();
    const idx = arr.indexOf(opt.value);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(opt.value);
    emit('update:modelValue', arr);
    emit('change', arr, { option: opt });
    emit('select', opt);
    // keep menu open for further picks
  } else {
    emit('update:modelValue', opt.value);
    emit('change', opt.value, { option: opt });
    emit('select', opt);
    closeMenu();
  }
}

function removeTag(opt: SelectOption, e?: MouseEvent) {
  if (e) e.stopPropagation();
  const arr = valueArr.value.filter((v) => v !== opt.value);
  emit('update:modelValue', arr);
  emit('change', arr, { option: opt });
}

function clear(e: MouseEvent) {
  e.stopPropagation();
  const next = props.multiple ? [] : null;
  emit('update:modelValue', next);
  emit('change', next, { option: null });
  emit('clear');
}

function moveActive(delta: number) {
  const opts = filteredOptions.value;
  if (!opts.length) return;
  let i = activeIndex.value;
  for (let n = 0; n < opts.length; n++) {
    i = (i + delta + opts.length) % opts.length;
    if (!opts[i].disabled) break;
  }
  setActive(i);
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
    if (!open.value) {
      e.preventDefault();
      openMenu();
    } else if (activeIndex.value >= 0) {
      e.preventDefault();
      pick(filteredOptions.value[activeIndex.value]);
    }
  } else if (e.key === ' ' && !props.searchable) {
    if (!open.value) {
      e.preventDefault();
      openMenu();
    } else if (activeIndex.value >= 0) {
      e.preventDefault();
      pick(filteredOptions.value[activeIndex.value]);
    }
  } else if (e.key === 'Escape') {
    if (open.value) {
      e.preventDefault();
      closeMenu();
    }
  } else if (e.key === 'Tab') {
    closeMenu();
  } else if (e.key === 'Backspace' && props.multiple && !term.value && valueArr.value.length) {
    // backspace removes last tag
    const last = props.options.find((o) => o.value === valueArr.value[valueArr.value.length - 1]);
    if (last) removeTag(last);
  }
}

function onSearchInput(e: Event) {
  term.value = (e.target as HTMLInputElement).value;
  emit('search', term.value);
  // reset active to first non-disabled
  const opts = filteredOptions.value;
  setActive(opts.findIndex((o) => !o.disabled));
}

watch(() => props.options, () => {
  if (activeIndex.value >= filteredOptions.value.length) activeIndex.value = -1;
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocClick);
});

const visibleTags = computed(() => {
  const cap = props.maxTagCount ?? Number.POSITIVE_INFINITY;
  return selectedTags.value.slice(0, cap);
});
const overflowCount = computed(() => {
  const cap = props.maxTagCount ?? Number.POSITIVE_INFINITY;
  return Math.max(0, selectedTags.value.length - cap);
});
</script>

<template>
  <div ref="rootRef" :class="[cls, multiple && 'cf-select--multi']">
    <button
      :id="id"
      type="button"
      class="cf-select__trigger"
      role="combobox"
      :disabled="disabled || loading"
      :aria-haspopup="'listbox'"
      :aria-expanded="open"
      :aria-label="selected ? selected.label : placeholder"
      :aria-controls="open ? menuId : undefined"
      :aria-activedescendant="open && activeIndex >= 0 ? optionId(activeIndex) : undefined"
      @click="open ? closeMenu() : openMenu()"
      @keydown="onKeydown"
      @focus="(event) => emit('focus', event)"
      @blur="(event) => emit('blur', event)"
    >
      <span class="cf-select__value">
        <template v-if="multiple">
          <template v-if="selectedTags.length">
            <span
              v-for="opt in visibleTags"
              :key="String(opt.value)"
              class="cf-select__tag"
            >
              {{ opt.label }}
              <span
                v-if="!disabled"
                class="cf-select__tag-x"
                role="button"
                tabindex="-1"
                aria-label="移除"
                @mousedown.prevent
                @click="(ev) => removeTag(opt, ev)"
              >×</span>
            </span>
            <span v-if="overflowCount" class="cf-select__tag is-more">+{{ overflowCount }}</span>
          </template>
          <span v-else class="cf-select__placeholder">{{ placeholder }}</span>
        </template>
        <template v-else>
          <template v-if="selected">{{ selected.label }}</template>
          <span v-else class="cf-select__placeholder">{{ placeholder }}</span>
        </template>
      </span>
      <span
        v-if="clearable && (multiple ? valueArr.length : selected) && !disabled && !loading"
        class="cf-select__clear"
        role="button"
        tabindex="-1"
        aria-label="清除"
        @click="clear"
      >×</span>
      <span v-if="loading" class="cf-select__spinner" aria-hidden="true" />
      <svg v-else class="cf-select__caret" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <ul
      v-if="open"
      :id="menuId"
      ref="listRef"
      class="cf-select__menu"
      role="listbox"
      :aria-multiselectable="multiple || undefined"
    >
      <li v-if="searchable" class="cf-select__search">
        <input
          ref="searchRef"
          type="text"
          :value="term"
          placeholder="搜索…"
          class="cf-select__search-input"
          @input="onSearchInput"
          @keydown.stop="onKeydown"
        />
      </li>
      <li v-if="loading" class="cf-select__empty">加载中…</li>
      <template v-else>
        <template v-for="(row, i) in renderRows" :key="i">
          <li v-if="row.type === 'header'" class="cf-select__group">{{ row.group }}</li>
          <li
            v-else
            :id="optionId(row.optIndex!)"
            class="cf-select__option"
            :class="{
              'is-active': row.optIndex === activeIndex,
              'is-selected': isSelected(row.option!),
              'is-disabled': row.option!.disabled,
            }"
            role="option"
            :aria-selected="isSelected(row.option!)"
            @mouseenter="!row.option!.disabled && setActive(row.optIndex!)"
            @mousedown.prevent="pick(row.option!)"
          >
            <span v-if="multiple" class="cf-select__check-box">
              <svg
                v-if="isSelected(row.option!)"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            {{ row.option!.label }}
            <svg
              v-if="!multiple && isSelected(row.option!)"
              class="cf-select__check"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </li>
        </template>
        <li v-if="!filteredOptions.length" class="cf-select__empty">{{ emptyText }}</li>
      </template>
    </ul>
    <input v-if="name && !multiple" type="hidden" :name="name" :value="modelValue ?? ''" />
  </div>
</template>
