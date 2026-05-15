<script setup lang="ts">
import { CfNetworkInspector, type NetworkRequest } from '@chufix-design/vue';

const requests: NetworkRequest[] = [
  {
    id: '1',
    method: 'GET',
    url: 'https://api.example.com/users/me',
    status: 200,
    type: 'fetch',
    size: 1248,
    duration: 42,
    requestHeaders: { Accept: 'application/json', Authorization: 'Bearer ***' },
    responseHeaders: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    responseBody: '{"id":"u1","name":"alice","role":"admin"}',
  },
  {
    id: '2',
    method: 'POST',
    url: 'https://api.example.com/login',
    status: 201,
    type: 'fetch',
    size: 320,
    duration: 188,
    requestBody: '{"user":"alice","password":"***"}',
    responseHeaders: { 'Set-Cookie': 'sid=abc; HttpOnly; Path=/' },
  },
  {
    id: '3',
    method: 'GET',
    url: 'https://cdn.example.com/assets/app.js',
    status: 304,
    type: 'script',
    size: 0,
    duration: 12,
  },
  {
    id: '4',
    method: 'GET',
    url: 'https://api.example.com/orders?status=open',
    status: 429,
    type: 'fetch',
    size: 96,
    duration: 78,
    responseBody: '{"error":"rate_limit","retryAfter":30}',
  },
  {
    id: '5',
    method: 'DELETE',
    url: 'https://api.example.com/sessions/abc',
    status: 500,
    type: 'fetch',
    size: 64,
    duration: 240,
    error: 'internal server error',
  },
];
</script>

<template>
  <CfNetworkInspector :requests="requests" :height="320" initial-selected-id="1" />
</template>
