<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import {
  applyMention,
  filterOptions,
  findTrigger,
  mentionClass,
  type MentionOption,
  type MentionProps,
  type TriggerMatch,
} from './variants';

const props = withDefaults(defineProps<MentionProps>(), {
  defaultValue: '',
  trigger: '@',
  placeholder: '输入 @ 触发提及',
  size: 'md',
  rows: 4,
  disabled: false,
  readonly: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  select: [option: MentionOption];
}>();

const isControlled = computed(() => props.modelValue !== undefined);
const internal = ref(props.defaultValue);
const text = computed(() => (isControlled.value ? props.modelValue ?? '' : internal.value));

const ta = ref<HTMLTextAreaElement | null>(null);
const match = ref<TriggerMatch | null>(null);
const active = ref(0);

const matches = computed<MentionOption[]>(() =>
  match.value ? filterOptions(props.options, match.value.query) : [],
);
const open = computed(() => match.value !== null && matches.value.length > 0);

const cls = computed(() =>
  mentionClass({
    size: props.size,
    disabled: props.disabled,
    readonly: props.readonly,
    className: props.className,
  }),
);

function setText(next: string) {
  if (!isControlled.value) internal.value = next;
  emit('update:modelValue', next);
}

function recompute() {
  if (!ta.value) return;
  const caret = ta.value.selectionStart ?? 0;
  match.value = findTrigger(text.value, caret, props.trigger);
  active.value = 0;
}

function onInput(e: Event) {
  setText((e.target as HTMLTextAreaElement).value);
  nextTick(recompute);
}

function onKeyDown(e: KeyboardEvent) {
  if (!open.value) return;
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    active.value = (active.value + 1) % matches.value.length;
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    active.value = (active.value - 1 + matches.value.length) % matches.value.length;
  } else if (e.key === 'Enter' || e.key === 'Tab') {
    e.preventDefault();
    pick(matches.value[active.value]);
  } else if (e.key === 'Escape') {
    match.value = null;
  }
}

function pick(opt: MentionOption) {
  if (!opt || opt.disabled || !match.value || !ta.value) return;
  const caret = ta.value.selectionStart ?? 0;
  const { text: nextText, caret: nextCaret } = applyMention(
    text.value,
    match.value,
    caret,
    props.trigger,
    opt,
  );
  setText(nextText);
  emit('select', opt);
  match.value = null;
  nextTick(() => {
    if (!ta.value) return;
    ta.value.focus();
    ta.value.setSelectionRange(nextCaret, nextCaret);
  });
}
</script>

<template>
  <div :class="cls">
    <textarea
      ref="ta"
      class="cf-mention__input"
      :value="text"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      @input="onInput"
      @keydown="onKeyDown"
      @click="recompute"
      @keyup="recompute"
    />
    <div v-if="open" class="cf-mention__menu" role="listbox">
      <button
        v-for="(opt, i) in matches"
        :key="opt.value"
        type="button"
        :class="['cf-mention__item', i === active && 'is-active', opt.disabled && 'is-disabled']"
        :disabled="opt.disabled"
        @mousedown.prevent="pick(opt)"
        @mouseenter="active = i"
      >
        <span class="cf-mention__label">{{ opt.label ?? opt.value }}</span>
        <span v-if="opt.description" class="cf-mention__desc">{{ opt.description }}</span>
      </button>
    </div>
  </div>
</template>
