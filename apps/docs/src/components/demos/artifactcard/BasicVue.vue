<script setup lang="ts">
import { CfArtifactCard } from '@chufix-design/vue';

const sql = `SELECT u.id, u.name, COUNT(o.id) AS orders
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.created_at >= '2026-01-01'
GROUP BY u.id, u.name
ORDER BY orders DESC
LIMIT 100;`;
</script>

<template>
  <div class="demo-stack" style="gap: 16px;">
    <CfArtifactCard
      kind="code"
      title="top-customers.sql"
      language="sql"
      :content="sql"
      meta="14 行"
    >
      <pre style="margin: 0; padding: 12px; font-family: var(--font-mono); font-size: var(--t-12); overflow-x: auto;">{{ sql }}</pre>
    </CfArtifactCard>

    <CfArtifactCard
      kind="svg"
      title="logo-mark.svg"
      language="svg"
      meta="2 paths"
      :content="'<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 32 32&quot;><circle cx=&quot;16&quot; cy=&quot;16&quot; r=&quot;14&quot; fill=&quot;oklch(64% 0.16 263)&quot;/></svg>'"
    >
      <svg viewBox="0 0 32 32" width="80" height="80" aria-hidden="true">
        <circle cx="16" cy="16" r="14" fill="oklch(64% 0.16 263)" />
        <path d="M11 16l3 3 7-7" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </CfArtifactCard>
  </div>
</template>
