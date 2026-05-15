<script setup lang="ts">
import { CfRequestTimeline, type RequestTiming } from '@chufix-design/vue';

const requests: RequestTiming[] = [
  {
    id: 'r1',
    label: 'GET /api/users/me',
    start: 0,
    end: 80,
    phases: [
      { type: 'blocked', duration: 4 },
      { type: 'dns', duration: 6 },
      { type: 'connect', duration: 12 },
      { type: 'wait', duration: 50 },
      { type: 'receive', duration: 8 },
    ],
  },
  {
    id: 'r2',
    label: 'GET /api/orders?status=open',
    start: 70,
    end: 320,
    phases: [
      { type: 'wait', duration: 230 },
      { type: 'receive', duration: 20 },
    ],
    tone: 'warning',
  },
  {
    id: 'r3',
    label: 'GET /assets/app.js',
    start: 50,
    end: 95,
    phases: [
      { type: 'queued', duration: 5 },
      { type: 'wait', duration: 30 },
      { type: 'receive', duration: 10 },
    ],
  },
  {
    id: 'r4',
    label: 'GET /assets/main.css',
    start: 50,
    end: 110,
  },
  {
    id: 'r5',
    label: 'POST /api/track',
    start: 200,
    end: 240,
  },
  {
    id: 'r6',
    label: 'DELETE /api/sessions/abc',
    start: 300,
    end: 540,
    tone: 'error',
  },
];
</script>

<template>
  <CfRequestTimeline :requests="requests" />
</template>
