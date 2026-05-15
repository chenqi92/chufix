<script setup lang="ts">
import { ref } from 'vue';
import { CfDraggable, CfDroppable, type DragPayload } from '@chufix-design/vue';

const bin = ref<string[]>([]);
const log = ref('拖动卡片到放置区试试。');

const cards = [
  { id: 'cpu', label: 'CPU 使用率' },
  { id: 'mem', label: '内存占用' },
  { id: 'net', label: '出向流量' },
  { id: 'lat', label: 'P99 延迟' },
];

function onDrop(payload: DragPayload) {
  const data = payload.data as { id: string; label: string };
  if (bin.value.includes(data.id)) return;
  bin.value.push(data.id);
  log.value = `drop: ${data.label} (id=${data.id})`;
}
</script>

<template>
  <div class="dd-demo">
    <div class="dd-demo__pool">
      <CfDraggable
        v-for="c in cards"
        :key="c.id"
        type="metric"
        :data="c"
        class="dd-card"
      >
        {{ c.label }}
      </CfDraggable>
    </div>
    <CfDroppable accept="metric" @drop="onDrop">
      <template #default="{ isOver, canDrop }">
        <div class="dd-zone" :class="{ 'is-over': isOver, 'is-accept': canDrop }">
          <strong>仪表盘</strong>
          <span v-if="bin.length === 0">拖卡片进来</span>
          <ul v-else>
            <li v-for="id in bin" :key="id">{{ id }}</li>
          </ul>
        </div>
      </template>
    </CfDroppable>
    <code class="dd-demo__log">{{ log }}</code>
  </div>
</template>

<style scoped>
.dd-demo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
}
.dd-demo__pool {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dd-card {
  padding: 10px 12px;
  background: var(--bg-2);
  border: 1px solid var(--line-1);
  border-radius: var(--r-3);
  color: var(--fg-1);
  font-size: var(--t-13);
}
.dd-zone {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
  height: 100%;
  min-height: 160px;
  color: var(--fg-2);
  font-size: var(--t-12);
}
.dd-zone strong {
  color: var(--fg-1);
  font-size: var(--t-13);
}
.dd-zone ul {
  margin: 0;
  padding-left: 18px;
}
.dd-demo__log {
  grid-column: 1 / -1;
  padding: 6px 10px;
  background: var(--bg-inset);
  border-radius: var(--r-2);
  font-size: var(--t-12);
}
</style>
