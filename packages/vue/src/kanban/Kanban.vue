<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  kanbanClass,
  moveCard,
  type KanbanColumn,
  type KanbanProps,
} from './variants';

const props = withDefaults(defineProps<KanbanProps>(), {
  size: 'md',
  bordered: true,
  draggable: true,
  defaultValue: () => [],
});

const emit = defineEmits<{
  'update:modelValue': [value: KanbanColumn[]];
  cardMove: [payload: { cardId: string; from: string; to: string; toIndex: number }];
}>();

const isControlled = computed(() => props.modelValue !== undefined);
const internal = ref<KanbanColumn[]>(props.defaultValue ?? []);
const cols = computed(() =>
  isControlled.value ? (props.modelValue as KanbanColumn[]) : internal.value,
);

const dragId = ref<string | null>(null);
const dragFrom = ref<string | null>(null);

const cls = computed(() =>
  kanbanClass({ size: props.size, bordered: props.bordered, className: props.className }),
);

function commit(next: KanbanColumn[]) {
  if (!isControlled.value) internal.value = next;
  emit('update:modelValue', next);
}

function onDragStart(e: DragEvent, cardId: string, fromColId: string) {
  if (!props.draggable) return;
  dragId.value = cardId;
  dragFrom.value = fromColId;
  e.dataTransfer?.setData('text/plain', cardId);
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
}

function onDragOver(e: DragEvent) {
  if (!props.draggable) return;
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
}

function dropOnCard(e: DragEvent, toColId: string, toIndex: number) {
  if (!props.draggable || !dragId.value) return;
  e.preventDefault();
  finishDrop(toColId, toIndex);
}

function dropOnColumn(e: DragEvent, toColId: string) {
  if (!props.draggable || !dragId.value) return;
  e.preventDefault();
  const col = cols.value.find((c) => c.id === toColId);
  finishDrop(toColId, col?.cards.length ?? 0);
}

function finishDrop(toColId: string, toIndex: number) {
  const cardId = dragId.value!;
  const from = dragFrom.value!;
  const next = moveCard(cols.value, cardId, toColId, toIndex);
  commit(next);
  emit('cardMove', { cardId, from, to: toColId, toIndex });
  dragId.value = null;
  dragFrom.value = null;
}
</script>

<template>
  <div :class="cls">
    <div
      v-for="col in cols"
      :key="col.id"
      class="cf-kanban__col"
      @dragover="onDragOver"
      @drop="(e) => dropOnColumn(e, col.id)"
    >
      <div class="cf-kanban__col-head">
        <span class="cf-kanban__col-title" :style="col.accent ? { color: col.accent } : {}">
          {{ col.title }}
        </span>
        <span class="cf-kanban__col-count">
          {{ col.cards.length }}{{ col.limit ? ` / ${col.limit}` : '' }}
        </span>
      </div>
      <div class="cf-kanban__col-body">
        <div
          v-for="(card, idx) in col.cards"
          :key="card.id"
          class="cf-kanban__card"
          :draggable="draggable"
          @dragstart="(e) => onDragStart(e, card.id, col.id)"
          @dragover="onDragOver"
          @drop="(e) => dropOnCard(e, col.id, idx)"
        >
          <div class="cf-kanban__card-title">{{ card.title }}</div>
          <div v-if="card.description" class="cf-kanban__card-desc">
            {{ card.description }}
          </div>
          <div v-if="card.tag || card.meta" class="cf-kanban__card-foot">
            <span v-if="card.tag" class="cf-kanban__card-tag">{{ card.tag }}</span>
            <span v-if="card.meta" class="cf-kanban__card-meta">{{ card.meta }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
