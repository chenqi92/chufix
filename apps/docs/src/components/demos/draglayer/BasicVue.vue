<script setup lang="ts">
import { ref } from 'vue';
import {
  CfDraggable,
  CfDroppable,
  CfDragLayer,
  type DragPayload,
} from '@chufix-design/vue';

interface FileLike {
  id: string;
  name: string;
  size: string;
}

const files: FileLike[] = [
  { id: '1', name: 'design-spec.md', size: '12 KB' },
  { id: '2', name: 'dashboard.png', size: '1.4 MB' },
  { id: '3', name: 'oncall-handoff.pdf', size: '342 KB' },
];

const droppedIds = ref<string[]>([]);

function onDrop(payload: DragPayload) {
  const f = payload.data as FileLike;
  if (!droppedIds.value.includes(f.id)) droppedIds.value.push(f.id);
}
</script>

<template>
  <div class="dl-demo">
    <div class="dl-files">
      <CfDraggable
        v-for="f in files"
        :key="f.id"
        type="file"
        :data="f"
        preview="none"
        class="dl-file"
      >
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path d="M3 1.5h6L13 5.5V14.5H3z" fill="none" stroke="currentColor" stroke-width="1.2" />
          <path d="M9 1.5V5.5H13" fill="none" stroke="currentColor" stroke-width="1.2" />
        </svg>
        <span>{{ f.name }}</span>
        <em>{{ f.size }}</em>
      </CfDraggable>
    </div>
    <CfDroppable accept="file" @drop="onDrop">
      <template #default="{ isOver }">
        <div class="dl-target" :class="{ 'is-over': isOver }">
          <strong>上传到云端</strong>
          <span v-if="droppedIds.length === 0">拖文件到此处</span>
          <ul v-else>
            <li v-for="id in droppedIds" :key="id">已上传 {{ files.find((x) => x.id === id)?.name }}</li>
          </ul>
        </div>
      </template>
    </CfDroppable>
    <CfDragLayer>
      <template #default="{ payload, canDrop }">
        <div class="dl-preview" :class="{ 'is-accepting': canDrop }">
          <strong>{{ (payload.data as FileLike).name }}</strong>
          <span>{{ canDrop ? '放下以上传' : '拖拽中…' }}</span>
        </div>
      </template>
    </CfDragLayer>
  </div>
</template>

<style scoped>
.dl-demo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.dl-files {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dl-file {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg-1);
  border: 1px solid var(--line-1);
  border-radius: var(--r-2);
  color: var(--fg-1);
  font-size: var(--t-13);
}
.dl-file svg {
  color: var(--accent-1);
  flex-shrink: 0;
}
.dl-file span {
  flex: 1;
}
.dl-file em {
  color: var(--fg-3);
  font-style: normal;
  font-size: var(--t-12);
}
.dl-target {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
  min-height: 180px;
  color: var(--fg-2);
  font-size: var(--t-12);
}
.dl-target strong {
  color: var(--fg-1);
  font-size: var(--t-13);
}
.dl-target ul {
  margin: 0;
  padding-left: 18px;
}
.dl-preview {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 12px;
  background: var(--bg-2);
  border: 1px solid var(--line-2);
  border-radius: var(--r-3);
  box-shadow: var(--shadow-3);
  color: var(--fg-1);
  font-size: var(--t-12);
  min-width: 160px;
}
.dl-preview strong {
  font-size: var(--t-13);
}
.dl-preview span {
  color: var(--fg-3);
}
.dl-preview.is-accepting {
  border-color: var(--accent-1);
  background: var(--accent-soft);
}
.dl-preview.is-accepting span {
  color: var(--accent-1);
}
</style>
