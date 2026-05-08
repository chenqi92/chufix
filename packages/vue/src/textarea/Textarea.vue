<script setup lang="ts">
import { computed, nextTick, ref, watch, onMounted } from 'vue';
import { textareaClass, type TextareaProps } from './variants';

const props = withDefaults(defineProps<TextareaProps>(), {
  modelValue: '',
  variant: 'outline',
  size: 'md',
  rows: 3,
  disabled: false,
  readonly: false,
  error: false,
  resize: 'vertical',
  autoResize: false,
  showCount: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'focus', ev: FocusEvent): void;
  (e: 'blur', ev: FocusEvent): void;
}>();

const focused = ref(false);
const taRef = ref<HTMLTextAreaElement | null>(null);

const cls = computed(() =>
  textareaClass({
    variant: props.variant,
    size: props.size,
    focused: focused.value,
    disabled: props.disabled,
    error: props.error,
  }),
);

const resizeStyle = computed(() => ({
  resize: props.autoResize ? 'none' : props.resize,
}));

function autoSize() {
  if (!props.autoResize || !taRef.value) return;
  const el = taRef.value;
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight}px`;
}

onMounted(() => {
  nextTick(autoSize);
});
watch(() => props.modelValue, () => nextTick(autoSize));

function onInput(e: Event) {
  const v = (e.target as HTMLTextAreaElement).value;
  emit('update:modelValue', v);
  if (props.autoResize) nextTick(autoSize);
}

function onChange(e: Event) {
  emit('change', (e.target as HTMLTextAreaElement).value);
}

const count = computed(() => (props.modelValue ?? '').length);
const overLimit = computed(() =>
  props.maxlength != null && count.value > props.maxlength,
);
</script>

<template>
  <div :class="cls">
    <textarea
      ref="taRef"
      class="ck-textarea__el"
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :name="name"
      :id="id"
      :style="resizeStyle"
      @input="onInput"
      @change="onChange"
      @focus="(ev) => { focused = true; emit('focus', ev); }"
      @blur="(ev) => { focused = false; emit('blur', ev); }"
    />
    <div v-if="showCount" class="ck-textarea__count" :class="{ 'is-over': overLimit }">
      {{ count }}<template v-if="maxlength != null"> / {{ maxlength }}</template>
    </div>
  </div>
</template>
