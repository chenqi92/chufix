<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  computeStrength,
  defaultRequirements,
  type PasswordRequirement,
  type PasswordStrengthProps,
} from './variants';

const props = withDefaults(defineProps<PasswordStrengthProps>(), {
  modelValue: '',
  size: 'md',
  placeholder: '请输入密码',
  disabled: false,
  showToggle: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const reqs = computed<PasswordRequirement[]>(
  () => props.requirements ?? defaultRequirements,
);
const strength = computed(() => computeStrength(props.modelValue, reqs.value));
const reveal = ref(false);

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
}

function toggleReveal() {
  reveal.value = !reveal.value;
}

const cls = computed(() => [
  'cf-pwstrength',
  `cf-pwstrength--${props.size}`,
  props.disabled && 'is-disabled',
]);
</script>

<template>
  <div :class="cls">
    <div class="cf-pwstrength__field">
      <input
        :type="reveal ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="cf-pwstrength__input"
        @input="onInput"
      />
      <button
        v-if="showToggle"
        type="button"
        class="cf-pwstrength__toggle"
        :aria-label="reveal ? '隐藏密码' : '显示密码'"
        :aria-pressed="reveal"
        @click="toggleReveal"
      >
        <svg v-if="reveal" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M2 8s2.4-4.5 6-4.5S14 8 14 8s-2.4 4.5-6 4.5S2 8 2 8z"
            stroke="currentColor"
            stroke-width="1.4"
            fill="none"
          />
          <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.4" fill="none" />
          <path d="M2 2l12 12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
        </svg>
        <svg v-else viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M2 8s2.4-4.5 6-4.5S14 8 14 8s-2.4 4.5-6 4.5S2 8 2 8z"
            stroke="currentColor"
            stroke-width="1.4"
            fill="none"
          />
          <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.4" fill="none" />
        </svg>
      </button>
    </div>

    <div class="cf-pwstrength__bars" :data-tone="strength.tone">
      <i :class="{ on: strength.score >= 1 }" />
      <i :class="{ on: strength.score >= 2 }" />
      <i :class="{ on: strength.score >= 3 }" />
      <i :class="{ on: strength.score >= 4 }" />
    </div>

    <div v-if="modelValue" class="cf-pwstrength__meta">
      强度：<span class="cf-pwstrength__lvl" :data-tone="strength.tone">{{
        strength.label
      }}</span>
    </div>

    <ul class="cf-pwstrength__reqs">
      <li
        v-for="(req, i) in reqs"
        :key="i"
        :class="{ 'is-passed': req.test(modelValue) }"
      >
        <span class="cf-pwstrength__dot" />
        {{ req.label }}
      </li>
    </ul>
  </div>
</template>
