<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { CfRemoteCursor, type RemoteCursorItem } from '@chufix-design/vue';

interface CursorBase {
  id: string;
  name: string;
  baseX: number;
  baseY: number;
  phase: number;
}

const base: CursorBase[] = [
  { id: 'alice', name: 'Alice', baseX: 80, baseY: 60, phase: 0 },
  { id: 'bo', name: 'Bo', baseX: 220, baseY: 120, phase: 1.7 },
  { id: 'chen', name: 'Chen', baseX: 380, baseY: 90, phase: 3.1 },
];

const cursors = ref<RemoteCursorItem[]>(
  base.map(({ id, name, baseX, baseY }) => ({ id, name, x: baseX, y: baseY })),
);

let raf: number | null = null;
const start = performance.now();

onMounted(() => {
  function tick(t: number) {
    const dt = (t - start) / 1000;
    cursors.value = base.map(({ id, name, baseX, baseY, phase }) => ({
      id,
      name,
      x: baseX + Math.sin(dt * 0.9 + phase) * 36,
      y: baseY + Math.cos(dt * 0.7 + phase) * 24,
    }));
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);
});
onBeforeUnmount(() => {
  if (raf != null) cancelAnimationFrame(raf);
});
</script>

<template>
  <div class="rc-demo">
    <div class="rc-demo__surface">
      <p>这是协作编辑器 / 白板 / 看板的工作区，其他用户的光标会浮在表面。</p>
      <p>把 cursors 数据接到 WebSocket / WebRTC 就能联动。</p>
      <CfRemoteCursor :cursors="cursors" positioning="absolute" />
    </div>
  </div>
</template>

<style scoped>
.rc-demo {
  width: 100%;
}
.rc-demo__surface {
  position: relative;
  min-height: 240px;
  padding: 16px;
  background: var(--bg-1);
  border: 1px solid var(--line-1);
  border-radius: var(--r-3);
  color: var(--fg-2);
  font-size: var(--t-13);
  overflow: hidden;
}
.rc-demo__surface p {
  margin: 0 0 8px;
}
</style>
