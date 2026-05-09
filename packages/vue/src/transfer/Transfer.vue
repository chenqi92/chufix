<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { transferClass, type TransferItem, type TransferProps } from './variants';

const props = withDefaults(defineProps<TransferProps>(), {
  searchable: false,
});

const emit = defineEmits<{
  'update:modelValue': [keys: string[]];
  change: [keys: string[]];
}>();

const isControlled = computed(() => props.modelValue !== undefined);
const internal = ref<string[]>(props.defaultValue ?? []);
const targetKeys = computed<string[]>(() =>
  isControlled.value ? (props.modelValue as string[]) : internal.value,
);

const leftChecked = ref<Set<string>>(new Set());
const rightChecked = ref<Set<string>>(new Set());
const leftSearch = ref('');
const rightSearch = ref('');

const leftItems = computed(() =>
  props.dataSource.filter((i) => !targetKeys.value.includes(i.key)),
);
const rightItems = computed(() =>
  props.dataSource.filter((i) => targetKeys.value.includes(i.key)),
);

const filteredLeft = computed(() => filterByText(leftItems.value, leftSearch.value));
const filteredRight = computed(() => filterByText(rightItems.value, rightSearch.value));

function filterByText(items: TransferItem[], q: string) {
  if (!q.trim()) return items;
  const t = q.trim().toLowerCase();
  return items.filter((i) => i.label.toLowerCase().includes(t));
}

function toggleCheck(side: 'left' | 'right', key: string) {
  const set = side === 'left' ? leftChecked.value : rightChecked.value;
  if (set.has(key)) set.delete(key);
  else set.add(key);
  if (side === 'left') leftChecked.value = new Set(set);
  else rightChecked.value = new Set(set);
}

function toggleAll(side: 'left' | 'right') {
  const items = side === 'left' ? filteredLeft.value : filteredRight.value;
  const enabled = items.filter((i) => !i.disabled);
  const set = side === 'left' ? leftChecked.value : rightChecked.value;
  const allOn = enabled.length > 0 && enabled.every((i) => set.has(i.key));
  const next = new Set(set);
  for (const i of enabled) {
    if (allOn) next.delete(i.key);
    else next.add(i.key);
  }
  if (side === 'left') leftChecked.value = next;
  else rightChecked.value = next;
}

function emitChange(keys: string[]) {
  if (!isControlled.value) internal.value = keys;
  emit('update:modelValue', keys);
  emit('change', keys);
}

function moveToRight() {
  const moving = Array.from(leftChecked.value).filter((k) =>
    leftItems.value.some((i) => i.key === k && !i.disabled),
  );
  if (moving.length === 0) return;
  emitChange([...targetKeys.value, ...moving]);
  leftChecked.value = new Set();
}

function moveToLeft() {
  const moving = Array.from(rightChecked.value).filter((k) =>
    rightItems.value.some((i) => i.key === k && !i.disabled),
  );
  if (moving.length === 0) return;
  emitChange(targetKeys.value.filter((k) => !moving.includes(k)));
  rightChecked.value = new Set();
}

watch(
  () => props.modelValue,
  (v) => {
    if (isControlled.value && v !== undefined) internal.value = v;
  },
);

const cls = computed(() => transferClass({ className: props.className }));

const leftAllOn = computed(() => {
  const enabled = filteredLeft.value.filter((i) => !i.disabled);
  return enabled.length > 0 && enabled.every((i) => leftChecked.value.has(i.key));
});
const rightAllOn = computed(() => {
  const enabled = filteredRight.value.filter((i) => !i.disabled);
  return enabled.length > 0 && enabled.every((i) => rightChecked.value.has(i.key));
});

const titles = computed<[string, string]>(() => props.titles ?? ['可选', '已选']);
</script>

<template>
  <div :class="cls">
    <div class="cf-transfer__pane">
      <div class="cf-transfer__head">
        <label class="cf-transfer__select-all">
          <input
            type="checkbox"
            :checked="leftAllOn"
            @change="toggleAll('left')"
          />
          <span class="cf-transfer__title">{{ titles[0] }}</span>
        </label>
        <span class="cf-transfer__count">
          {{ leftChecked.size }} / {{ filteredLeft.length }}
        </span>
      </div>
      <input
        v-if="searchable"
        v-model="leftSearch"
        type="search"
        class="cf-transfer__search"
        placeholder="搜索"
      />
      <ul class="cf-transfer__list">
        <li
          v-for="it in filteredLeft"
          :key="it.key"
          :class="['cf-transfer__item', it.disabled && 'is-disabled']"
        >
          <label>
            <input
              type="checkbox"
              :checked="leftChecked.has(it.key)"
              :disabled="it.disabled"
              @change="toggleCheck('left', it.key)"
            />
            <span>{{ it.label }}</span>
          </label>
        </li>
      </ul>
    </div>

    <div class="cf-transfer__ops">
      <button
        type="button"
        class="cf-transfer__btn"
        :disabled="leftChecked.size === 0"
        aria-label="移到右侧"
        @click="moveToRight"
      >›</button>
      <button
        type="button"
        class="cf-transfer__btn"
        :disabled="rightChecked.size === 0"
        aria-label="移到左侧"
        @click="moveToLeft"
      >‹</button>
    </div>

    <div class="cf-transfer__pane">
      <div class="cf-transfer__head">
        <label class="cf-transfer__select-all">
          <input
            type="checkbox"
            :checked="rightAllOn"
            @change="toggleAll('right')"
          />
          <span class="cf-transfer__title">{{ titles[1] }}</span>
        </label>
        <span class="cf-transfer__count">
          {{ rightChecked.size }} / {{ filteredRight.length }}
        </span>
      </div>
      <input
        v-if="searchable"
        v-model="rightSearch"
        type="search"
        class="cf-transfer__search"
        placeholder="搜索"
      />
      <ul class="cf-transfer__list">
        <li
          v-for="it in filteredRight"
          :key="it.key"
          :class="['cf-transfer__item', it.disabled && 'is-disabled']"
        >
          <label>
            <input
              type="checkbox"
              :checked="rightChecked.has(it.key)"
              :disabled="it.disabled"
              @change="toggleCheck('right', it.key)"
            />
            <span>{{ it.label }}</span>
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>
