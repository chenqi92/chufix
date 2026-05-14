<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useClickOutside } from '../composables/useClickOutside';
import {
  formatContextWindow,
  groupOptions,
  type ModelOption,
  type ModelPickerProps,
} from './variants';

const props = withDefaults(defineProps<ModelPickerProps>(), {
  placeholder: '选择模型',
  groupByProvider: true,
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
  (e: 'change', v: string, option: ModelOption): void;
}>();

const open = ref(false);
const rootRef = ref<HTMLDivElement | null>(null);

const selected = computed(() => props.options.find((o) => o.id === props.modelValue));
const groups = computed(() => groupOptions(props.options, props.groupByProvider));

function toggle() {
  if (props.disabled) return;
  open.value = !open.value;
}

function onSelect(opt: ModelOption) {
  if (opt.disabled) return;
  emit('update:modelValue', opt.id);
  emit('change', opt.id, opt);
  open.value = false;
}

useClickOutside(rootRef, () => (open.value = false));

function onKey(e: KeyboardEvent) {
  if (!open.value) return;
  if (e.key === 'Escape') {
    e.stopPropagation();
    open.value = false;
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') window.addEventListener('keydown', onKey, true);
});
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.removeEventListener('keydown', onKey, true);
});
</script>

<template>
  <div ref="rootRef" :class="['cf-modelpicker', open && 'is-open', disabled && 'is-disabled']">
    <button
      type="button"
      class="cf-modelpicker__trigger"
      :aria-expanded="open"
      :aria-haspopup="'listbox'"
      :disabled="disabled"
      @click="toggle"
    >
      <span v-if="selected" class="cf-modelpicker__selected">
        <span class="cf-modelpicker__label">{{ selected.label }}</span>
        <span v-if="selected.contextWindow" class="cf-modelpicker__ctx">{{ formatContextWindow(selected.contextWindow) }}</span>
      </span>
      <span v-else class="cf-modelpicker__placeholder">{{ placeholder }}</span>
      <svg class="cf-modelpicker__caret" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <div v-if="open" class="cf-modelpicker__menu" role="listbox">
      <template v-for="group in groups" :key="group.provider">
        <div v-if="groupByProvider && group.provider" class="cf-modelpicker__group">{{ group.provider }}</div>
        <button
          v-for="opt in group.items"
          :key="opt.id"
          type="button"
          role="option"
          :aria-selected="opt.id === modelValue"
          :aria-disabled="opt.disabled || undefined"
          :disabled="opt.disabled"
          :class="['cf-modelpicker__option', opt.id === modelValue && 'is-active']"
          @click="onSelect(opt)"
        >
          <div class="cf-modelpicker__option-main">
            <span class="cf-modelpicker__option-label">{{ opt.label }}</span>
            <span v-if="opt.description" class="cf-modelpicker__option-desc">{{ opt.description }}</span>
          </div>
          <div class="cf-modelpicker__option-meta">
            <span
              v-for="cap in opt.capabilities ?? []"
              :key="cap"
              class="cf-modelpicker__cap"
            >{{ cap }}</span>
            <span v-if="opt.contextWindow" class="cf-modelpicker__ctx">{{ formatContextWindow(opt.contextWindow) }}</span>
          </div>
        </button>
      </template>
    </div>
  </div>
</template>
