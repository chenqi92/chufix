<script setup lang="ts">
import { type AgentEvent, formatMs, formatStamp } from './variants';

withDefaults(
  defineProps<{
    events: AgentEvent[];
    showTimestamp?: boolean;
  }>(),
  {
    showTimestamp: true,
  },
);

function typeLabel(type: AgentEvent['type']): string {
  switch (type) {
    case 'thought': return 'thinking';
    case 'tool': return 'tool call';
    case 'action': return 'action';
    case 'observation': return 'observation';
    case 'message': return 'message';
    case 'error': return 'error';
  }
}
</script>

<template>
  <ol class="cf-agentt">
    <li
      v-for="ev in events"
      :key="ev.id"
      class="cf-agentt__item"
      :class="`cf-agentt__item--${ev.type}`"
    >
      <div class="cf-agentt__bullet">
        <svg v-if="ev.type === 'thought'" viewBox="0 0 16 16" width="14" height="14">
          <path d="M5 11h6M4 8q-1-3 2-5t6 1 0 5q-1 1-2 2v1h-4v-1q-1-1-2-3z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" />
        </svg>
        <svg v-else-if="ev.type === 'tool'" viewBox="0 0 16 16" width="14" height="14">
          <path d="M4 13l5-5 1 1-5 5zM10 3l3 3-2 2-3-3z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" />
        </svg>
        <svg v-else-if="ev.type === 'action'" viewBox="0 0 16 16" width="14" height="14">
          <path d="M3 8h10m-3-3l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
        </svg>
        <svg v-else-if="ev.type === 'observation'" viewBox="0 0 16 16" width="14" height="14">
          <circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.3" />
          <path d="M2 8q3-5 6-5t6 5q-3 5-6 5t-6-5z" fill="none" stroke="currentColor" stroke-width="1.3" />
        </svg>
        <svg v-else-if="ev.type === 'message'" viewBox="0 0 16 16" width="14" height="14">
          <path d="M2 4h12v7h-4l-2 2-2-2H2z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" />
        </svg>
        <svg v-else-if="ev.type === 'error'" viewBox="0 0 16 16" width="14" height="14">
          <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.3" />
          <path d="M8 5v4m0 2v.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        </svg>
      </div>
      <div class="cf-agentt__body">
        <div class="cf-agentt__header">
          <span class="cf-agentt__type">{{ typeLabel(ev.type) }}</span>
          <strong v-if="ev.title">{{ ev.title }}</strong>
          <span v-if="ev.duration !== undefined" class="cf-agentt__duration">{{ formatMs(ev.duration) }}</span>
          <span v-if="showTimestamp && ev.timestamp !== undefined" class="cf-agentt__stamp">{{ formatStamp(ev.timestamp) }}</span>
        </div>
        <pre v-if="ev.content" class="cf-agentt__content">{{ ev.content }}</pre>
        <dl v-if="ev.meta" class="cf-agentt__meta">
          <template v-for="(value, key) in ev.meta" :key="key">
            <dt>{{ key }}</dt>
            <dd>{{ value }}</dd>
          </template>
        </dl>
      </div>
    </li>
  </ol>
</template>
