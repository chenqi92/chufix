<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import {
  defaultCountries,
  type CountryCode,
  type PhoneInputProps,
} from './variants';

const props = withDefaults(defineProps<PhoneInputProps>(), {
  modelValue: '',
  country: 'CN',
  size: 'md',
  placeholder: '请输入手机号',
  disabled: false,
  error: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'update:country', value: string): void;
}>();

const open = ref(false);
const search = ref('');
const rootRef = ref<HTMLDivElement | null>(null);

const countries = computed<CountryCode[]>(
  () => props.countries ?? defaultCountries,
);
const current = computed<CountryCode>(
  () =>
    countries.value.find((c) => c.code === props.country) ?? countries.value[0],
);

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return countries.value;
  return countries.value.filter(
    (c) =>
      c.label.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.dial.includes(q),
  );
});

const cls = computed(() => [
  'cf-phoneinput',
  `cf-phoneinput--${props.size}`,
  open.value && 'is-open',
  props.disabled && 'is-disabled',
  props.error && 'is-error',
]);

function toggleMenu() {
  if (props.disabled) return;
  open.value = !open.value;
  if (open.value) document.addEventListener('mousedown', onDocClick);
  else closeMenu();
}

function closeMenu() {
  open.value = false;
  search.value = '';
  document.removeEventListener('mousedown', onDocClick);
}

function onDocClick(e: MouseEvent) {
  if (!rootRef.value) return;
  if (!rootRef.value.contains(e.target as Node)) closeMenu();
}

function pickCountry(c: CountryCode) {
  emit('update:country', c.code);
  closeMenu();
}

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
}

onBeforeUnmount(() =>
  document.removeEventListener('mousedown', onDocClick),
);
</script>

<template>
  <div ref="rootRef" :class="cls">
    <button
      type="button"
      class="cf-phoneinput__cc"
      :disabled="disabled"
      :aria-haspopup="'listbox'"
      :aria-expanded="open"
      @click="toggleMenu"
    >
      <span class="cf-phoneinput__cc-code">+{{ current.dial }}</span>
      <svg viewBox="0 0 16 16" aria-hidden="true" class="cf-phoneinput__caret">
        <path
          d="M4 6l4 4 4-4"
          stroke="currentColor"
          stroke-width="1.6"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
    <input
      type="tel"
      class="cf-phoneinput__input"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="onInput"
    />
    <div v-if="open" class="cf-phoneinput__menu">
      <div class="cf-phoneinput__search">
        <input
          v-model="search"
          type="text"
          placeholder="搜索国家 / 区号…"
          autofocus
        />
      </div>
      <ul class="cf-phoneinput__list" role="listbox">
        <li
          v-for="c in filtered"
          :key="c.code"
          class="cf-phoneinput__opt"
          :class="{ 'is-selected': c.code === current.code }"
          role="option"
          :aria-selected="c.code === current.code"
          @mousedown.prevent="pickCountry(c)"
        >
          <span class="cf-phoneinput__opt-label">{{ c.label }}</span>
          <span class="cf-phoneinput__opt-dial">+{{ c.dial }}</span>
        </li>
        <li v-if="!filtered.length" class="cf-phoneinput__empty">
          无匹配国家
        </li>
      </ul>
    </div>
  </div>
</template>
