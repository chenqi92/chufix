<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  type NetworkRequest,
  formatBytes,
  formatDuration,
  normalizeHeaders,
  statusTone,
} from './variants';

const props = withDefaults(
  defineProps<{
    requests: NetworkRequest[];
    height?: number | string;
    initialSelectedId?: string;
  }>(),
  {
    height: 400,
  },
);

const emit = defineEmits<{
  (e: 'select', request: NetworkRequest | null): void;
}>();

const selectedId = ref<string | null>(props.initialSelectedId ?? null);

const selected = computed(() =>
  props.requests.find((r) => r.id === selectedId.value) ?? null,
);
const reqHeaders = computed(() => normalizeHeaders(selected.value?.requestHeaders));
const resHeaders = computed(() => normalizeHeaders(selected.value?.responseHeaders));

function toggle(id: string) {
  selectedId.value = selectedId.value === id ? null : id;
  emit('select', selected.value);
}

function shortUrl(url: string): string {
  try {
    const u = new URL(url, 'http://x.local');
    return u.pathname + (u.search ?? '');
  } catch {
    return url;
  }
}

const style = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}));
</script>

<template>
  <div class="cf-net" :style="style">
    <div class="cf-net__list">
      <div class="cf-net__head">
        <div class="cf-net__cell cf-net__cell--method">方法</div>
        <div class="cf-net__cell cf-net__cell--url">URL</div>
        <div class="cf-net__cell cf-net__cell--status">状态</div>
        <div class="cf-net__cell cf-net__cell--type">类型</div>
        <div class="cf-net__cell cf-net__cell--size">大小</div>
        <div class="cf-net__cell cf-net__cell--time">耗时</div>
      </div>
      <div class="cf-net__body">
        <div
          v-for="r in requests"
          :key="r.id"
          class="cf-net__row"
          :class="{ 'is-selected': selectedId === r.id }"
          @click="toggle(r.id)"
        >
          <div class="cf-net__cell cf-net__cell--method">
            <span class="cf-net__method" :data-method="r.method">{{ r.method }}</span>
          </div>
          <div class="cf-net__cell cf-net__cell--url" :title="r.url">{{ shortUrl(r.url) }}</div>
          <div class="cf-net__cell cf-net__cell--status">
            <span class="cf-net__status" :data-tone="statusTone(r.status)">
              {{ r.error ? 'ERR' : r.status ?? '—' }}
            </span>
          </div>
          <div class="cf-net__cell cf-net__cell--type">{{ r.type ?? '—' }}</div>
          <div class="cf-net__cell cf-net__cell--size">{{ formatBytes(r.size) }}</div>
          <div class="cf-net__cell cf-net__cell--time">{{ formatDuration(r.duration) }}</div>
        </div>
      </div>
    </div>
    <div v-if="selected" class="cf-net__detail">
      <header>
        <strong>{{ selected.method }}</strong>
        <code>{{ selected.url }}</code>
        <button type="button" class="cf-net__close" @click="toggle(selected.id)" aria-label="close">×</button>
      </header>
      <section>
        <h4>Request Headers</h4>
        <table v-if="reqHeaders.length">
          <tbody>
            <tr v-for="h in reqHeaders" :key="h.name">
              <td>{{ h.name }}</td>
              <td>{{ h.value }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else>—</p>
      </section>
      <section v-if="selected.requestBody">
        <h4>Request Body</h4>
        <pre>{{ selected.requestBody }}</pre>
      </section>
      <section>
        <h4>Response Headers</h4>
        <table v-if="resHeaders.length">
          <tbody>
            <tr v-for="h in resHeaders" :key="h.name">
              <td>{{ h.name }}</td>
              <td>{{ h.value }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else>—</p>
      </section>
      <section v-if="selected.responseBody">
        <h4>Response Body</h4>
        <pre>{{ selected.responseBody }}</pre>
      </section>
    </div>
  </div>
</template>
