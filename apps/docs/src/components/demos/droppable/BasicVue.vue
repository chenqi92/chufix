<script setup lang="ts">
import { ref } from 'vue';
import { CfDraggable, CfDroppable, type DragPayload } from '@chufix-design/vue';

interface Bucket {
  id: string;
  label: string;
  tone: 'info' | 'warning' | 'error';
  items: string[];
}

const buckets = ref<Bucket[]>([
  { id: 'todo', label: 'To do', tone: 'info', items: ['登录鉴权'] },
  { id: 'doing', label: 'Doing', tone: 'warning', items: ['仪表盘 P99'] },
  { id: 'done', label: 'Done', tone: 'error', items: [] },
]);

function moveTask(payload: DragPayload, targetId: string) {
  const data = payload.data as { from: string; task: string };
  if (data.from === targetId) return;
  buckets.value = buckets.value.map((b) => {
    if (b.id === data.from) return { ...b, items: b.items.filter((t) => t !== data.task) };
    if (b.id === targetId) return { ...b, items: [...b.items, data.task] };
    return b;
  });
}
</script>

<template>
  <div class="dz-demo">
    <CfDroppable
      v-for="b in buckets"
      :key="b.id"
      accept="task"
      @drop="(p) => moveTask(p, b.id)"
    >
      <template #default="{ isOver }">
        <div class="dz-bucket" :class="`dz-bucket--${b.tone}`" :data-over="isOver ? '1' : '0'">
          <header>
            <strong>{{ b.label }}</strong>
            <span>{{ b.items.length }}</span>
          </header>
          <CfDraggable
            v-for="task in b.items"
            :key="task"
            type="task"
            :data="{ from: b.id, task }"
            class="dz-task"
          >
            {{ task }}
          </CfDraggable>
          <p v-if="b.items.length === 0" class="dz-empty">拖到这里</p>
        </div>
      </template>
    </CfDroppable>
  </div>
</template>

<style scoped>
.dz-demo {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;
}
.dz-bucket {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  min-height: 200px;
  background: var(--bg-1);
  border: 1px dashed var(--line-2);
  border-radius: var(--r-3);
}
.dz-bucket header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--fg-1);
  font-size: var(--t-12);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.dz-bucket header span {
  color: var(--fg-3);
}
.dz-task {
  padding: 8px 10px;
  background: var(--bg-2);
  border: 1px solid var(--line-1);
  border-radius: var(--r-2);
  color: var(--fg-1);
  font-size: var(--t-13);
}
.dz-empty {
  margin: 0;
  color: var(--fg-3);
  font-size: var(--t-12);
}
</style>
