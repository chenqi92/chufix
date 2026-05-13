<script setup lang="ts">
import { computed, ref } from 'vue';
import { iconNames, type IconName } from '@chufix-design/icons';
import CfIcon from '../icon/Icon.vue';
import { iconPickerClass, type IconPickerProps } from './variants';

const props = withDefaults(defineProps<IconPickerProps>(), {
  placeholder: '选择图标',
  searchable: true,
  clearable: true,
  disabled: false,
  size: 'md',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: IconName | undefined): void;
  (e: 'change', value: IconName | undefined): void;
}>();

const open = ref(false);
const query = ref('');
const cls = computed(() => iconPickerClass({ size: props.size, open: open.value, disabled: props.disabled }));
const filtered = computed(() => {
  const keyword = query.value.trim().toLowerCase();
  if (!keyword) return iconNames;
  return iconNames.filter((name) => name.includes(keyword));
});

function selectIcon(name: IconName) {
  emit('update:modelValue', name);
  emit('change', name);
  open.value = false;
}

function clear(event: MouseEvent) {
  event.stopPropagation();
  emit('update:modelValue', undefined);
  emit('change', undefined);
}
</script>

<template>
  <div :class="cls">
    <button type="button" class="cf-iconpicker__trigger" :disabled="disabled" :aria-expanded="open" @click="open = !open">
      <CfIcon v-if="modelValue" :name="modelValue" />
      <span class="cf-iconpicker__value" :class="{ 'is-placeholder': !modelValue }">{{ modelValue || placeholder }}</span>
      <span v-if="clearable && modelValue" class="cf-iconpicker__clear" aria-hidden="true" @click="clear">
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
          <path d="M3 3 L9 9 M9 3 L3 9" />
        </svg>
      </span>
      <span class="cf-iconpicker__chevron" aria-hidden="true">
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 4.5 L6 7.5 L9 4.5" />
        </svg>
      </span>
    </button>

    <div v-if="open" class="cf-iconpicker__popup" role="listbox">
      <input v-if="searchable" v-model="query" class="cf-iconpicker__search" type="search" placeholder="搜索图标..." />
      <div class="cf-iconpicker__grid">
        <button
          v-for="name in filtered"
          :key="name"
          type="button"
          class="cf-iconpicker__item"
          :class="{ 'is-selected': modelValue === name }"
          role="option"
          :aria-selected="modelValue === name"
          :title="name"
          @click="selectIcon(name)"
        >
          <CfIcon :name="name" />
        </button>
      </div>
      <div v-if="!filtered.length" class="cf-iconpicker__empty">没有匹配图标</div>
    </div>
  </div>
</template>
