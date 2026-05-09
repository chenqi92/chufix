<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  dropzoneClass,
  formatBytes,
  matchesAccept,
  type DropzoneProps,
  type DropzoneRejection,
} from './variants';

const props = withDefaults(defineProps<DropzoneProps>(), {
  modelValue: () => [] as File[],
  multiple: true,
  disabled: false,
  size: 'md',
  hideList: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: File[]): void;
  (e: 'change', files: File[]): void;
  (e: 'reject', rejections: DropzoneRejection[]): void;
  (e: 'remove', file: File, index: number): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const dragCount = ref(0);
const reject = ref(false);

const cls = computed(() =>
  dropzoneClass({
    size: props.size,
    disabled: props.disabled,
    active: dragCount.value > 0,
    reject: reject.value,
  }),
);

function commit(next: File[]) {
  emit('update:modelValue', next);
  emit('change', next);
}

function isDuplicate(a: File, b: File) {
  return (
    a.name === b.name && a.size === b.size && a.lastModified === b.lastModified
  );
}

function ingest(incoming: FileList | File[]) {
  if (props.disabled) return;
  const arr = Array.from(incoming);
  const accepted: File[] = [];
  const rejections: DropzoneRejection[] = [];
  let pool = [...props.modelValue];

  for (const file of arr) {
    if (props.maxSize != null && file.size > props.maxSize) {
      rejections.push({ file, reason: 'too-large' });
      continue;
    }
    if (!matchesAccept(file, props.accept)) {
      rejections.push({ file, reason: 'wrong-type' });
      continue;
    }
    if (pool.some((existing) => isDuplicate(existing, file))) {
      rejections.push({ file, reason: 'duplicate' });
      continue;
    }
    if (
      props.maxFiles != null &&
      pool.length + accepted.length >= props.maxFiles
    ) {
      rejections.push({ file, reason: 'too-many' });
      continue;
    }
    accepted.push(file);
  }

  if (!props.multiple) {
    if (accepted.length) commit(accepted.slice(-1));
  } else if (accepted.length) {
    pool = [...pool, ...accepted];
    commit(pool);
  }

  if (rejections.length) emit('reject', rejections);
}

function onSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files) ingest(input.files);
  input.value = '';
}

function pickFiles() {
  if (props.disabled) return;
  inputRef.value?.click();
}

function onDragEnter(e: DragEvent) {
  if (props.disabled) return;
  e.preventDefault();
  dragCount.value++;
}
function onDragLeave(e: DragEvent) {
  e.preventDefault();
  dragCount.value = Math.max(0, dragCount.value - 1);
  if (dragCount.value === 0) reject.value = false;
}
function onDragOver(e: DragEvent) {
  if (props.disabled) return;
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
}
function onDrop(e: DragEvent) {
  if (props.disabled) return;
  e.preventDefault();
  dragCount.value = 0;
  reject.value = false;
  if (e.dataTransfer?.files) ingest(e.dataTransfer.files);
}

function removeAt(i: number) {
  if (props.disabled) return;
  const file = props.modelValue[i];
  const next = props.modelValue.filter((_, idx) => idx !== i);
  commit(next);
  emit('remove', file, i);
}

function statusOf(i: number) {
  return props.statuses?.[i];
}

function clearAll() {
  if (props.disabled) return;
  commit([]);
}

defineExpose({ pickFiles, clearAll });
</script>

<template>
  <div>
    <div
      :class="cls"
      role="button"
      tabindex="0"
      :aria-disabled="disabled"
      @click="pickFiles"
      @keydown.enter.prevent="pickFiles"
      @keydown.space.prevent="pickFiles"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @dragover="onDragOver"
      @drop="onDrop"
    >
      <input
        ref="inputRef"
        type="file"
        class="cf-dropzone__input"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        @change="onSelect"
      />
      <slot name="icon">
        <svg
          class="cf-dropzone__icon"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 4v12m0-12-4 4m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </slot>
      <slot>
        <div class="cf-dropzone__title">
          点击或拖拽文件到此区域上传
        </div>
        <div v-if="hint" class="cf-dropzone__hint">{{ hint }}</div>
      </slot>
    </div>

    <ul v-if="!hideList && modelValue.length" class="cf-dropzone__list">
      <li
        v-for="(file, i) in modelValue"
        :key="`${file.name}-${file.lastModified}-${i}`"
        class="cf-dropzone__file"
        :class="statusOf(i)?.status === 'error' && 'is-error'"
      >
        <span class="cf-dropzone__file-name">{{ file.name }}</span>
        <span class="cf-dropzone__file-size">{{ formatBytes(file.size) }}</span>
        <span
          v-if="statusOf(i)?.status === 'uploading'"
          class="cf-dropzone__progress"
          :style="{ '--progress': `${statusOf(i)?.progress ?? 0}%` }"
        />
        <span
          v-if="statusOf(i)?.status === 'success'"
          class="cf-dropzone__file-status cf-dropzone__file-status--ok"
          aria-label="完成"
        >✓</span>
        <span
          v-if="statusOf(i)?.status === 'error'"
          class="cf-dropzone__file-status cf-dropzone__file-status--err"
          :title="statusOf(i)?.error"
          aria-label="失败"
        >!</span>
        <button
          v-if="!disabled"
          type="button"
          class="cf-dropzone__file-remove"
          :aria-label="`移除 ${file.name}`"
          @click.stop="removeAt(i)"
        >×</button>
      </li>
    </ul>
  </div>
</template>
