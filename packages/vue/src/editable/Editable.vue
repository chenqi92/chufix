<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import type { EditableCommitPayload, EditableProps } from './variants';

const props = withDefaults(defineProps<EditableProps>(), {
  multiline: false,
  disabled: false,
  showHint: true,
  commitOnEnter: true,
  size: 'md',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'commit', payload: EditableCommitPayload): void;
  (e: 'cancel'): void;
  (e: 'edit-start'): void;
  (e: 'invalid', message: string): void;
}>();

const editing = ref(false);
const draft = ref('');
const error = ref<string | null>(null);
const inputRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);

const cls = computed(() =>
  [
    'cf-editable',
    `cf-editable--${props.size}`,
    editing.value ? 'cf-editable--editing' : '',
    props.disabled ? 'cf-editable--disabled' : '',
    error.value ? 'cf-editable--invalid' : '',
    props.multiline ? 'cf-editable--multiline' : '',
  ]
    .filter(Boolean)
    .join(' '),
);

const displayText = computed(() => props.modelValue || props.placeholder || '');
const isEmpty = computed(() => !props.modelValue);

async function startEdit() {
  if (props.disabled || editing.value) return;
  draft.value = props.modelValue;
  error.value = null;
  editing.value = true;
  emit('edit-start');
  await nextTick();
  inputRef.value?.focus();
  if (inputRef.value && 'select' in inputRef.value) {
    (inputRef.value as HTMLInputElement).select();
  }
}

async function commit() {
  if (draft.value === props.modelValue) {
    editing.value = false;
    return;
  }
  if (props.validate) {
    const result = await props.validate(draft.value);
    if (result !== true) {
      const msg = typeof result === 'string' ? result : '校验未通过';
      error.value = msg;
      emit('invalid', msg);
      return;
    }
  }
  const previous = props.modelValue;
  emit('update:modelValue', draft.value);
  emit('commit', { value: draft.value, previous });
  editing.value = false;
  error.value = null;
}

function cancel() {
  editing.value = false;
  error.value = null;
  emit('cancel');
}

function onKeydown(ev: KeyboardEvent) {
  if (ev.key === 'Escape') {
    ev.preventDefault();
    cancel();
    return;
  }
  if (ev.key === 'Enter' && props.commitOnEnter) {
    if (props.multiline && !(ev.ctrlKey || ev.metaKey)) return;
    ev.preventDefault();
    commit();
  }
}
</script>

<template>
  <span :class="cls" @click="startEdit" :tabindex="disabled || editing ? -1 : 0" @keydown.enter="startEdit" @keydown.space="startEdit" role="button" :aria-label="ariaLabel">
    <template v-if="!editing">
      <span :class="['cf-editable__text', isEmpty ? 'cf-editable__text--placeholder' : '']">{{ displayText }}</span>
      <svg v-if="showHint && !disabled" class="cf-editable__pencil" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.06 9.02 14.98 9.94 5.92 19H5v-.92L14.06 9.02M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83a.996.996 0 0 0 0-1.41l-2.34-2.34a.98.98 0 0 0-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" fill="currentColor" />
      </svg>
    </template>
    <template v-else>
      <textarea
        v-if="multiline"
        ref="inputRef"
        v-model="draft"
        class="cf-editable__input cf-editable__textarea"
        :maxlength="maxLength"
        @keydown="onKeydown"
        @blur="commit"
        @click.stop
      />
      <input
        v-else
        ref="inputRef"
        v-model="draft"
        class="cf-editable__input"
        type="text"
        :maxlength="maxLength"
        @keydown="onKeydown"
        @blur="commit"
        @click.stop
      />
      <span v-if="error" class="cf-editable__error">{{ error }}</span>
    </template>
  </span>
</template>
