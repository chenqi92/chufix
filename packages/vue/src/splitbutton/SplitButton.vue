<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import {
  splitButtonClass,
  type SplitButtonItem,
  type SplitButtonProps,
} from './variants';

const props = withDefaults(defineProps<SplitButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
});

const emit = defineEmits<{
  (e: 'click', evt: MouseEvent): void;
  (e: 'select', value: string, item: SplitButtonItem): void;
}>();

const open = ref(false);
const rootRef = ref<HTMLDivElement | null>(null);

const cls = computed(() => splitButtonClass(props));
const inactive = computed(() => props.disabled || props.loading);

function toggleMenu() {
  if (inactive.value) return;
  open.value = !open.value;
  if (open.value) document.addEventListener('mousedown', onDocClick);
  else document.removeEventListener('mousedown', onDocClick);
}

function closeMenu() {
  open.value = false;
  document.removeEventListener('mousedown', onDocClick);
}

function onDocClick(e: MouseEvent) {
  if (!rootRef.value) return;
  if (!rootRef.value.contains(e.target as Node)) closeMenu();
}

function pick(item: SplitButtonItem) {
  if (item.disabled) return;
  emit('select', item.value, item);
  closeMenu();
}

function onMainClick(e: MouseEvent) {
  if (inactive.value) return;
  emit('click', e);
}

onBeforeUnmount(() => document.removeEventListener('mousedown', onDocClick));
</script>

<template>
  <div ref="rootRef" :class="cls">
    <button
      type="button"
      class="cf-splitbtn__main"
      :disabled="inactive"
      :aria-busy="loading || undefined"
      @click="onMainClick"
    >
      <slot />
    </button>
    <span class="cf-splitbtn__div" aria-hidden="true" />
    <button
      type="button"
      class="cf-splitbtn__more"
      :disabled="inactive"
      :aria-haspopup="'menu'"
      :aria-expanded="open"
      aria-label="更多操作"
      @click="toggleMenu"
    >
      <svg
        class="cf-splitbtn__caret"
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
    </button>
    <ul v-if="open" class="cf-splitbtn__menu" role="menu">
      <li
        v-for="item in items"
        :key="item.value"
        class="cf-splitbtn__option"
        :class="{
          'is-disabled': item.disabled,
          'is-danger': item.danger,
        }"
        role="menuitem"
        :aria-disabled="item.disabled || undefined"
        @mousedown.prevent="pick(item)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>
