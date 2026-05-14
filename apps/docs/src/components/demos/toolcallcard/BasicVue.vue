<script setup lang="ts">
import { CfToolCallCard } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-stack">
    <CfToolCallCard
      name="web_search"
      :input="{ query: 'oklch vs hsl perceptual uniformity', limit: 5 }"
      :output="{ results: ['evilmartians.com', 'developer.chrome.com', 'w3.org/TR/css-color-4'] }"
      status="success"
      :duration="820"
      default-open
    />
    <CfToolCallCard
      name="bash"
      :input="{ command: 'pnpm --filter docs build' }"
      status="running"
      :duration="4200"
    />
    <CfToolCallCard
      name="read_file"
      :input="{ path: '/etc/missing' }"
      status="error"
      error-message="ENOENT: no such file or directory"
      default-open
    />
  </div>
</template>
