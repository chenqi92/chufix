<script setup lang="ts">
import { computed, watch } from 'vue';
import { kvEditorClass, type KVEditorProps, type KVRow } from './variants';

const props = withDefaults(defineProps<KVEditorProps>(), {
  modelValue: () => [] as KVRow[],
  size: 'md',
  keyPlaceholder: '键',
  valuePlaceholder: '值',
  showToggle: false,
  showDescription: false,
  autoAppend: true,
  disabled: false,
  readonly: false,
  bordered: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: KVRow[]): void;
}>();

const cls = computed(() =>
  kvEditorClass({
    size: props.size,
    bordered: props.bordered,
    disabled: props.disabled,
    readonly: props.readonly,
  }),
);

function commit(rows: KVRow[]) {
  emit('update:modelValue', rows);
}

function ensureTrailing(rows: KVRow[]) {
  if (!props.autoAppend || props.disabled || props.readonly) return rows;
  const last = rows[rows.length - 1];
  if (!last || last.key.trim() || last.value.trim()) {
    return [...rows, { key: '', value: '', enabled: true }];
  }
  return rows;
}

watch(
  () => props.modelValue,
  (rows) => {
    const ensured = ensureTrailing(rows);
    if (ensured !== rows) commit(ensured);
  },
  { immediate: true },
);

function update(i: number, patch: Partial<KVRow>) {
  const next = props.modelValue.map((row, idx) =>
    idx === i ? { ...row, ...patch } : row,
  );
  commit(ensureTrailing(next));
}

function removeAt(i: number) {
  const next = props.modelValue.filter((_, idx) => idx !== i);
  commit(ensureTrailing(next));
}
</script>

<template>
  <div :class="cls">
    <div class="cf-kv__header" :class="{ 'has-toggle': showToggle, 'has-desc': showDescription }">
      <span v-if="showToggle" class="cf-kv__col cf-kv__col--toggle" aria-hidden="true" />
      <span class="cf-kv__col cf-kv__col--key">{{ keyPlaceholder }}</span>
      <span class="cf-kv__col cf-kv__col--value">{{ valuePlaceholder }}</span>
      <span v-if="showDescription" class="cf-kv__col cf-kv__col--desc">说明</span>
      <span class="cf-kv__col cf-kv__col--remove" aria-hidden="true" />
    </div>
    <div
      v-for="(row, i) in modelValue"
      :key="i"
      class="cf-kv__row"
      :class="{ 'has-toggle': showToggle, 'has-desc': showDescription }"
    >
      <input
        v-if="showToggle"
        type="checkbox"
        class="cf-kv__col cf-kv__col--toggle cf-kv__check"
        :checked="row.enabled !== false"
        :disabled="disabled || readonly"
        @change="update(i, { enabled: ($event.target as HTMLInputElement).checked })"
      />
      <input
        type="text"
        class="cf-kv__col cf-kv__col--key cf-kv__input"
        :value="row.key"
        :placeholder="keyPlaceholder"
        :disabled="disabled"
        :readonly="readonly"
        @input="update(i, { key: ($event.target as HTMLInputElement).value })"
      />
      <input
        type="text"
        class="cf-kv__col cf-kv__col--value cf-kv__input"
        :value="row.value"
        :placeholder="valuePlaceholder"
        :disabled="disabled"
        :readonly="readonly"
        @input="update(i, { value: ($event.target as HTMLInputElement).value })"
      />
      <input
        v-if="showDescription"
        type="text"
        class="cf-kv__col cf-kv__col--desc cf-kv__input"
        :value="row.description ?? ''"
        placeholder="说明（可选）"
        :disabled="disabled"
        :readonly="readonly"
        @input="update(i, { description: ($event.target as HTMLInputElement).value })"
      />
      <button
        v-if="!disabled && !readonly"
        type="button"
        class="cf-kv__col cf-kv__col--remove cf-kv__remove"
        :aria-label="`删除第 ${i + 1} 行`"
        @click="removeAt(i)"
      >×</button>
    </div>
  </div>
</template>
