<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import {
  applyVariableSuggestion,
  filterVariableOptions,
  findVariableSuggestion,
  findVariableTokenAt,
  normalizeVariables,
  parseTokens,
  variableMap,
  type NormalizedVariableOption,
  type VariableAwareInputProps,
  type VariableToken,
} from './variants';

const props = withDefaults(defineProps<VariableAwareInputProps>(), {
  modelValue: '',
  size: 'md',
  variant: 'outline',
  placeholder: '',
  disabled: false,
  error: false,
  suggest: true,
  suggestTrigger: '{{',
  interactive: true,
  showVariablePopover: true,
});

defineSlots<{
  option?(props: { variable: NormalizedVariableOption; active: boolean; query: string }): unknown;
  'variable-popover'?(props: {
    variable?: NormalizedVariableOption;
    token: VariableToken;
    draftValue: string;
    setDraftValue: (value: string) => void;
    update: () => void;
    create: () => void;
    close: () => void;
  }): unknown;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'variable-select', value: NormalizedVariableOption): void;
  (e: 'variable-click', value: { name: string; token: VariableToken; variable?: NormalizedVariableOption }): void;
  (e: 'variable-update', value: { name: string; value: string; token: VariableToken; variable?: NormalizedVariableOption }): void;
  (e: 'variable-create', value: { name: string; token: VariableToken; variable?: NormalizedVariableOption }): void;
}>();

const variables = computed(() => normalizeVariables(props.variables ?? []));
const variablesByName = computed(() => variableMap(variables.value));
const tokens = computed(() => parseTokens(props.modelValue, variablesByName.value));
const suggestion = ref<ReturnType<typeof findVariableSuggestion>>(null);
const activeSuggestion = ref(0);
const activeToken = ref<VariableToken | null>(null);
const draftValue = ref('');
const menuId = `cf-vinput-menu-${Math.random().toString(36).slice(2)}`;
const popoverId = `cf-vinput-popover-${Math.random().toString(36).slice(2)}`;

const suggestionOptions = computed(() =>
  suggestion.value ? filterVariableOptions(variables.value, suggestion.value.query) : [],
);
const suggestionsOpen = computed(() =>
  Boolean(props.suggest && suggestion.value && suggestionOptions.value.length),
);
const activeVariable = computed(() =>
  activeToken.value
    ? activeToken.value.variable ?? variablesByName.value.get(activeToken.value.name)
    : undefined,
);
const popoverOpen = computed(() =>
  Boolean(props.interactive && props.showVariablePopover && activeToken.value && !suggestionsOpen.value),
);
const inputRef = ref<HTMLInputElement | null>(null);
const overlayRef = ref<HTMLDivElement | null>(null);
const rootRef = ref<HTMLDivElement | null>(null);

const cls = computed(() => [
  'cf-vinput',
  `cf-vinput--${props.size}`,
  `cf-vinput--${props.variant}`,
  props.disabled && 'is-disabled',
  props.error && 'is-error',
  (suggestionsOpen.value || popoverOpen.value) && 'is-open',
]);

function onInput(e: Event) {
  const input = e.target as HTMLInputElement;
  emit('update:modelValue', input.value);
  syncSuggestion(input.value, input.selectionStart ?? input.value.length);
}

function onScroll() {
  if (!overlayRef.value || !inputRef.value) return;
  overlayRef.value.scrollLeft = inputRef.value.scrollLeft;
}

function closePanels() {
  suggestion.value = null;
  activeToken.value = null;
}

function setDraftValue(value: string) {
  draftValue.value = value;
}

function onDraftInput(e: Event) {
  setDraftValue((e.target as HTMLInputElement).value);
}

function syncSuggestion(value = props.modelValue, caret = inputRef.value?.selectionStart ?? 0) {
  if (!props.suggest || props.disabled) {
    suggestion.value = null;
    return;
  }
  suggestion.value = findVariableSuggestion(value, caret, props.suggestTrigger);
  activeSuggestion.value = 0;
  if (suggestion.value) activeToken.value = null;
}

function onKeyUp(e: KeyboardEvent) {
  if (['ArrowDown', 'ArrowUp', 'Enter', 'Tab', 'Escape'].includes(e.key)) return;
  syncSuggestion();
}

function onKeyDown(e: KeyboardEvent) {
  if (suggestionsOpen.value) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeSuggestion.value = (activeSuggestion.value + 1) % suggestionOptions.value.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeSuggestion.value = (activeSuggestion.value - 1 + suggestionOptions.value.length) % suggestionOptions.value.length;
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      pickVariable(suggestionOptions.value[activeSuggestion.value]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      suggestion.value = null;
    }
    return;
  }
  if (e.key === 'Escape') closePanels();
}

function pickVariable(option?: NormalizedVariableOption) {
  if (!option || option.disabled || !suggestion.value) return;
  const { text, caret } = applyVariableSuggestion(props.modelValue, suggestion.value, option);
  emit('update:modelValue', text);
  emit('variable-select', option);
  suggestion.value = null;
  nextTick(() => {
    inputRef.value?.focus();
    inputRef.value?.setSelectionRange(caret, caret);
  });
}

function openVariablePopover() {
  if (!props.interactive || !inputRef.value) return;
  const caret = inputRef.value.selectionStart ?? 0;
  const token = findVariableTokenAt(tokens.value, caret);
  if (!token) {
    activeToken.value = null;
    syncSuggestion();
    return;
  }
  activeToken.value = token;
  draftValue.value = token.variable?.value ?? variablesByName.value.get(token.name)?.value ?? '';
  suggestion.value = null;
  emit('variable-click', {
    name: token.name,
    token,
    variable: token.variable ?? variablesByName.value.get(token.name),
  });
}

function updateVariable() {
  if (!activeToken.value) return;
  emit('variable-update', {
    name: activeToken.value.name,
    value: draftValue.value,
    token: activeToken.value,
    variable: activeVariable.value,
  });
}

function createVariable() {
  if (!activeToken.value) return;
  emit('variable-create', {
    name: activeToken.value.name,
    token: activeToken.value,
    variable: activeVariable.value,
  });
}

function onFocusOut(e: FocusEvent) {
  const next = e.relatedTarget;
  if (next instanceof Node && rootRef.value?.contains(next)) return;
  closePanels();
}
</script>

<template>
  <div ref="rootRef" :class="cls" @focusout="onFocusOut">
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
      :aria-expanded="suggestionsOpen || popoverOpen ? 'true' : 'false'"
      :aria-controls="suggestionsOpen ? menuId : popoverOpen ? popoverId : undefined"
      spellcheck="false"
      autocomplete="off"
      @input="onInput"
      @keydown="onKeyDown"
      @keyup="onKeyUp"
      @click="openVariablePopover"
      @scroll="onScroll"
    />
    <div v-if="suggestionsOpen" :id="menuId" class="cf-vinput__menu" role="listbox">
      <button
        v-for="(opt, i) in suggestionOptions"
        :key="opt.name"
        type="button"
        role="option"
        :aria-selected="i === activeSuggestion"
        :disabled="opt.disabled"
        :class="['cf-vinput__option', i === activeSuggestion && 'is-active', opt.disabled && 'is-disabled']"
        @mousedown.prevent="pickVariable(opt)"
        @mouseenter="activeSuggestion = i"
      >
        <slot name="option" :variable="opt" :active="i === activeSuggestion" :query="suggestion?.query ?? ''">
          <span class="cf-vinput__option-main">
            <span class="cf-vinput__option-name">{{ opt.label }}</span>
            <span v-if="opt.scope" class="cf-vinput__option-scope">{{ opt.scope }}</span>
          </span>
          <span v-if="opt.value" class="cf-vinput__option-value">{{ opt.value }}</span>
          <span v-if="opt.description" class="cf-vinput__option-desc">{{ opt.description }}</span>
        </slot>
      </button>
    </div>
    <div
      v-else-if="popoverOpen && activeToken"
      :id="popoverId"
      class="cf-vinput__popover"
      role="dialog"
      tabindex="-1"
    >
      <slot
        name="variable-popover"
        :variable="activeVariable"
        :token="activeToken"
        :draft-value="draftValue"
        :set-draft-value="setDraftValue"
        :update="updateVariable"
        :create="createVariable"
        :close="closePanels"
      >
        <div class="cf-vinput__popover-head">
          <span class="cf-vinput__popover-title">{{ activeVariable?.label ?? activeToken.name }}</span>
          <span v-if="activeVariable?.scope" class="cf-vinput__badge">{{ activeVariable.scope }}</span>
          <span v-else class="cf-vinput__badge is-danger">未定义</span>
        </div>
        <p v-if="activeVariable?.description" class="cf-vinput__popover-desc">
          {{ activeVariable.description }}
        </p>
        <dl class="cf-vinput__meta">
          <div>
            <dt>变量名</dt>
            <dd>{{ activeToken.name }}</dd>
          </div>
          <div v-if="activeVariable?.value">
            <dt>当前值</dt>
            <dd>{{ activeVariable.value }}</dd>
          </div>
        </dl>
        <label v-if="activeVariable?.editable" class="cf-vinput__edit">
          <span>修改值</span>
          <input
            class="cf-vinput__edit-input"
            :value="draftValue"
            @input="onDraftInput"
            @keydown.enter.prevent="updateVariable"
          />
        </label>
        <div class="cf-vinput__actions">
          <button v-if="activeVariable?.editable" type="button" class="cf-vinput__action is-primary" @click="updateVariable">
            更新变量
          </button>
          <button v-if="!activeVariable" type="button" class="cf-vinput__action is-primary" @click="createVariable">
            创建变量
          </button>
          <button type="button" class="cf-vinput__action" @click="closePanels">关闭</button>
        </div>
      </slot>
    </div>
  </div>
</template>
