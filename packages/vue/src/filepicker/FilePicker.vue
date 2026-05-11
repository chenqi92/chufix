<script setup lang="ts">
import { computed, ref } from 'vue';
import { formatBytes, type FilePickerProps } from './variants';

const props = withDefaults(defineProps<FilePickerProps>(), {
  modelValue: () => [] as File[],
  multiple: false,
  size: 'md',
  variant: 'outline',
  disabled: false,
  buttonText: '选择文件',
  emptyText: '未选择文件',
  showFiles: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: File[]): void;
  (e: 'change', files: File[]): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);

const files = computed<File[]>(() => props.modelValue ?? []);

const cls = computed(() => [
  'cf-filepicker',
  `cf-filepicker--${props.size}`,
  `cf-filepicker--${props.variant}`,
  props.disabled && 'is-disabled',
]);

function openPicker() {
  if (props.disabled) return;
  inputRef.value?.click();
}

function onFiles(e: Event) {
  const list = (e.target as HTMLInputElement).files;
  if (!list) return;
  const arr = Array.from(list);
  emit('update:modelValue', arr);
  emit('change', arr);
  // reset so picking the same file again retriggers change
  if (inputRef.value) inputRef.value.value = '';
}

function removeFile(idx: number) {
  const next = files.value.slice();
  next.splice(idx, 1);
  emit('update:modelValue', next);
  emit('change', next);
}

function clearAll() {
  emit('update:modelValue', []);
  emit('change', []);
}
</script>

<template>
  <div :class="cls">
    <button
      type="button"
      class="cf-filepicker__btn"
      :disabled="disabled"
      @click="openPicker"
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M4 2.5h5L13 6.5v6.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linejoin="round"
          fill="none"
        />
        <path
          d="M9 2.5v3.5a1 1 0 0 0 1 1H13"
          stroke="currentColor"
          stroke-width="1.4"
          fill="none"
          stroke-linejoin="round"
        />
      </svg>
      <span>{{ buttonText }}</span>
    </button>
    <input
      ref="inputRef"
      type="file"
      class="cf-filepicker__native"
      :multiple="multiple"
      :accept="accept"
      @change="onFiles"
    />
    <span v-if="showFiles && files.length === 0" class="cf-filepicker__empty">
      {{ emptyText }}
    </span>
    <ul v-if="showFiles && files.length" class="cf-filepicker__list">
      <li
        v-for="(file, i) in files"
        :key="`${file.name}-${i}`"
        class="cf-filepicker__item"
      >
        <span class="cf-filepicker__name">{{ file.name }}</span>
        <span class="cf-filepicker__size">{{ formatBytes(file.size) }}</span>
        <button
          type="button"
          class="cf-filepicker__remove"
          aria-label="移除"
          @click="removeFile(i)"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </li>
    </ul>
    <button
      v-if="showFiles && files.length > 1"
      type="button"
      class="cf-filepicker__clear"
      @click="clearAll"
    >
      清空
    </button>
  </div>
</template>
