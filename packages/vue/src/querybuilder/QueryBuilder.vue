<script setup lang="ts">
import { computed } from 'vue';
import {
  type QueryCondition,
  type QueryField,
  type QueryGroup,
  type QueryOperator,
  operatorsFor,
  defaultOperatorFor,
  newConditionId,
  needsValue,
} from './variants';

const props = defineProps<{
  fields: QueryField[];
  modelValue: QueryGroup;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: QueryGroup): void;
}>();

const fieldByKey = computed(() => {
  const m = new Map<string, QueryField>();
  for (const f of props.fields) m.set(f.key, f);
  return m;
});

function update(next: QueryGroup) {
  emit('update:modelValue', next);
}

function setCombinator(c: 'AND' | 'OR') {
  update({ ...props.modelValue, combinator: c });
}

function addCondition() {
  const first = props.fields[0];
  if (!first) return;
  const cond: QueryCondition = {
    id: newConditionId(),
    field: first.key,
    operator: defaultOperatorFor(first.type),
    value: first.type === 'boolean' ? true : '',
  };
  update({ ...props.modelValue, conditions: [...props.modelValue.conditions, cond] });
}

function removeCondition(id: string) {
  update({
    ...props.modelValue,
    conditions: props.modelValue.conditions.filter((c) => c.id !== id),
  });
}

function patchCondition(id: string, patch: Partial<QueryCondition>) {
  update({
    ...props.modelValue,
    conditions: props.modelValue.conditions.map((c) =>
      c.id === id ? { ...c, ...patch } : c,
    ),
  });
}

function onFieldChange(id: string, key: string) {
  const f = fieldByKey.value.get(key);
  if (!f) return;
  patchCondition(id, {
    field: key,
    operator: defaultOperatorFor(f.type),
    value: f.type === 'boolean' ? true : '',
  });
}

function onOperatorChange(id: string, op: QueryOperator) {
  patchCondition(id, { operator: op, value: needsValue(op) ? '' : undefined });
}

function fieldOf(c: QueryCondition): QueryField | undefined {
  return fieldByKey.value.get(c.field);
}
</script>

<template>
  <div class="cf-qb">
    <div class="cf-qb__combinator">
      <button
        type="button"
        class="cf-qb__chip"
        :class="{ 'is-active': modelValue.combinator === 'AND' }"
        @click="setCombinator('AND')"
      >AND</button>
      <button
        type="button"
        class="cf-qb__chip"
        :class="{ 'is-active': modelValue.combinator === 'OR' }"
        @click="setCombinator('OR')"
      >OR</button>
      <span class="cf-qb__count">{{ modelValue.conditions.length }} 个条件</span>
    </div>
    <ul class="cf-qb__list">
      <li v-for="c in modelValue.conditions" :key="c.id" class="cf-qb__row">
        <select
          class="cf-qb__select"
          :value="c.field"
          @change="(e) => onFieldChange(c.id, (e.target as HTMLSelectElement).value)"
        >
          <option v-for="f in fields" :key="f.key" :value="f.key">{{ f.label }}</option>
        </select>
        <select
          class="cf-qb__select cf-qb__select--op"
          :value="c.operator"
          @change="(e) => onOperatorChange(c.id, (e.target as HTMLSelectElement).value as QueryOperator)"
        >
          <option
            v-for="op in operatorsFor(fieldOf(c)?.type ?? 'string')"
            :key="op.value"
            :value="op.value"
          >{{ op.label }}</option>
        </select>
        <template v-if="needsValue(c.operator)">
          <select
            v-if="fieldOf(c)?.type === 'enum'"
            class="cf-qb__select"
            :value="String(c.value ?? '')"
            @change="(e) => patchCondition(c.id, { value: (e.target as HTMLSelectElement).value })"
          >
            <option
              v-for="opt in fieldOf(c)?.options ?? []"
              :key="String(opt.value)"
              :value="opt.value"
            >{{ opt.label }}</option>
          </select>
          <select
            v-else-if="fieldOf(c)?.type === 'boolean'"
            class="cf-qb__select"
            :value="String(c.value)"
            @change="(e) => patchCondition(c.id, { value: (e.target as HTMLSelectElement).value === 'true' })"
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
          <input
            v-else
            class="cf-qb__input"
            :type="fieldOf(c)?.type === 'number' ? 'number' : fieldOf(c)?.type === 'date' ? 'date' : 'text'"
            :value="c.value ?? ''"
            @input="(e) => patchCondition(c.id, { value: (e.target as HTMLInputElement).value })"
          />
        </template>
        <button
          type="button"
          class="cf-qb__remove"
          aria-label="remove condition"
          @click="removeCondition(c.id)"
        >×</button>
      </li>
    </ul>
    <button type="button" class="cf-qb__add" @click="addCondition">+ 添加条件</button>
  </div>
</template>
