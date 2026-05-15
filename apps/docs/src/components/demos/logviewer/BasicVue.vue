<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { CfLogViewer, type LogEntry } from '@chufix-design/vue';

const logs = ref<LogEntry[]>([
  { id: 1, timestamp: Date.now() - 8000, level: 'info', message: 'service auth-svc started on :8080' },
  { id: 2, timestamp: Date.now() - 7000, level: 'debug', message: 'db connection pool size=10' },
  { id: 3, timestamp: Date.now() - 5000, level: 'info', message: 'request POST /login user=alice' },
  { id: 4, timestamp: Date.now() - 4000, level: 'warn', message: 'slow query detected SELECT entries took 1.2s' },
  { id: 5, timestamp: Date.now() - 3000, level: 'success', message: 'cache warmed 1280 entries' },
  { id: 6, timestamp: Date.now() - 1500, level: 'error', message: 'failed to reach upstream: ECONNREFUSED 10.0.0.4:9092' },
]);

const search = ref('');
let nextId = 7;
let interval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  interval = setInterval(() => {
    const levels = ['info', 'debug', 'warn', 'error', 'success'] as const;
    const lvl = levels[Math.floor(Math.random() * levels.length)];
    logs.value = [
      ...logs.value,
      {
        id: nextId++,
        timestamp: Date.now(),
        level: lvl,
        message: `tick ${nextId} from auto-feed (${lvl})`,
      },
    ];
    if (logs.value.length > 80) logs.value = logs.value.slice(-80);
  }, 1800);
});
onBeforeUnmount(() => {
  if (interval) clearInterval(interval);
});
</script>

<template>
  <div class="lv-demo">
    <input
      v-model="search"
      class="lv-demo__search"
      placeholder="搜索日志…"
    />
    <CfLogViewer :logs="logs" :search="search" :height="300" />
  </div>
</template>

<style scoped>
.lv-demo {
  display: grid;
  gap: 8px;
}
.lv-demo__search {
  height: 30px;
  padding: 0 10px;
  background: var(--bg-1);
  border: 1px solid var(--line-1);
  border-radius: var(--r-2);
  color: var(--fg-1);
  font-size: var(--t-13);
}
.lv-demo__search:focus {
  outline: none;
  border-color: var(--accent-1);
}
</style>
