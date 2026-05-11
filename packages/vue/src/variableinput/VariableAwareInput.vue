<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  parseTokens,
  type VariableAwareInputProps,
} from './variants';

const props = withDefaults(defineProps<VariableAwareInputProps>(), {
  modelValue: '',
  size: 'md',
  variant: 'outline',
  placeholder: '',
  disabled: false,
  error: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const knownSet = computed(() => new Set((props.variables ?? []).map((item) => item.trim()).filter(Boolean)));
const tokens = computed(() => parseTokens(props.modelValue, knownSet.value));

const inputRef = ref<HTMLInputElement | null>(null);
const overlayRef = ref<HTMLDivElement | null>(null);

const cls = computed(() => [
  'cf-vinput',
  `cf-vinput--${props.size}`,
  `cf-vinput--${props.variant}`,
  props.disabled && 'is-disabled',
  props.error && 'is-error',
]);

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
}

function onScroll() {
  if (!overlayRef.value || !inputRef.value) return;
  overlayRef.value.scrollLeft = inputRef.value.scrollLeft;
}
</script>

<template>
  <div :class="cls">
    <div ref="overlayRef" class="cf-vinput__overlay" aria-hidden="true">
      <template v-if="!modelValue && placeholder">
        <span class="cf-vinput__placeholder">{{ placeholder }}</span>
      </template>
      <template v-else>
        <template v-for="(tok, i) in tokens" :key="i">
          <span v-if="tok.type === 'text'" class="cf-vinput__plain">{{
            tok.text
          }}</span>
          <span
            v-else
            class="cf-vinput__var"
            :class="{ 'is-invalid': !tok.valid }"
          >{{ tok.raw }}</span>
        </template>
      </template>
    </div>
    <input
      ref="inputRef"
      type="text"
      class="cf-vinput__input"
      :value="modelValue"
      :disabled="disabled"
      spellcheck="false"
      autocomplete="off"
      @input="onInput"
      @scroll="onScroll"
    />
  </div>
</template>
