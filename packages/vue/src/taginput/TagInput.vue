<script setup lang="ts">
import { computed, ref } from 'vue';
import { tagInputClass, type TagInputProps } from './variants';

const props = withDefaults(defineProps<TagInputProps>(), {
  modelValue: () => [] as string[],
  placeholder: '输入后回车添加',
  variant: 'outline',
  size: 'md',
  tone: 'neutral',
  disabled: false,
  error: false,
  separators: () => ['Enter'],
  unique: true,
  trim: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
  (e: 'add', tag: string): void;
  (e: 'remove', tag: string, index: number): void;
}>();

const draft = ref('');
const focused = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const cls = computed(() =>
  tagInputClass({
    variant: props.variant,
    size: props.size,
    disabled: props.disabled,
    error: props.error,
    focused: focused.value,
  }),
);

const tagToneClass = computed(
  () => `cf-taginput__chip--${props.tone}`,
);

function commit(tags: string[]) {
  emit('update:modelValue', tags);
}

function tryAdd(raw: string) {
  if (props.disabled) return false;
  const v = props.trim ? raw.trim() : raw;
  if (!v) return false;
  if (props.unique && props.modelValue.includes(v)) return false;
  if (props.max != null && props.modelValue.length >= props.max) return false;
  if (props.validate && !props.validate(v)) return false;
  const next = [...props.modelValue, v];
  commit(next);
  emit('add', v);
  return true;
}

function removeAt(i: number) {
  if (props.disabled) return;
  const tag = props.modelValue[i];
  const next = props.modelValue.filter((_, idx) => idx !== i);
  commit(next);
  emit('remove', tag, i);
}

function isSeparator(e: KeyboardEvent): boolean {
  return props.separators.some((s) => {
    if (s === 'Enter') return e.key === 'Enter';
    if (s === 'Tab') return e.key === 'Tab';
    if (s === ',') return e.key === ',';
    if (s === ' ') return e.key === ' ';
    return e.key === s;
  });
}

function onKeydown(e: KeyboardEvent) {
  if (props.disabled) return;
  if (isSeparator(e)) {
    if (draft.value.trim()) {
      e.preventDefault();
      if (tryAdd(draft.value)) draft.value = '';
    } else if (e.key === 'Enter') {
      e.preventDefault();
    }
  } else if (e.key === 'Backspace' && !draft.value && props.modelValue.length) {
    e.preventDefault();
    removeAt(props.modelValue.length - 1);
  }
}

function onPaste(e: ClipboardEvent) {
  const text = e.clipboardData?.getData('text');
  if (!text) return;
  const parts = text.split(/[,\n\t]+/).map((p) => p.trim()).filter(Boolean);
  if (parts.length <= 1) return;
  e.preventDefault();
  let added = false;
  for (const p of parts) if (tryAdd(p)) added = true;
  if (added) draft.value = '';
}

function focus() {
  inputRef.value?.focus();
}

defineExpose({ focus });
</script>

<template>
  <div :class="cls" @click="focus">
    <span
      v-for="(tag, i) in modelValue"
      :key="`${tag}-${i}`"
      class="cf-taginput__chip"
      :class="tagToneClass"
    >
      <span class="cf-taginput__chip-label">{{ tag }}</span>
      <button
        v-if="!disabled"
        type="button"
        class="cf-taginput__chip-close"
        :aria-label="`移除 ${tag}`"
        tabindex="-1"
        @click.stop="removeAt(i)"
      >
        ×
      </button>
    </span>
    <input
      ref="inputRef"
      v-model="draft"
      :id="id"
      :name="name"
      type="text"
      class="cf-taginput__input"
      :placeholder="modelValue.length ? '' : placeholder"
      :disabled="disabled"
      autocomplete="off"
      @keydown="onKeydown"
      @paste="onPaste"
      @focus="focused = true"
      @blur="focused = false"
    />
  </div>
</template>
