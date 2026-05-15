<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { CfRemoteCursor, type RemoteCursorItem } from '@chufix-design/vue';

const cursors = ref<RemoteCursorItem[]>([
  { id: 'alice', name: 'Alice', x: 80, y: 60 },
  { id: 'bo', name: 'Bo', x: 220, y: 120 },
  { id: 'chen', name: 'Chen', x: 380, y: 90 },
]);

let raf: number | null = null;
const start = performance.now();

onMounted(() => {
  function tick(t: number) {
    const dt = (t - start) / 1000;
    cursors.value = cursors.value.map((c, i) => ({
      ...c,
      x: c.x + Math.sin(dt + i) * 0.6,
      y: c.y + Math.cos(dt * 1.2 + i) * 0.4,
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
  min-height: 200px;
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
