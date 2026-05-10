<script setup lang="ts">
import { CfResult, CfButton, CfBanner } from '@chufix-design/vue';
</script>

<template>
  <div class="err">
    <CfResult
      status="403"
      size="lg"
      title="无访问权限"
      description="当前账号 · jane.l · 没有访问此资源的权限。"
    >
      <template #icon>
        <svg class="err-artwork" viewBox="0 0 420 220" role="img" aria-label="403 权限插画">
          <defs>
            <linearGradient id="forbid-surface" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stop-color="var(--bg-1)" />
              <stop offset="100%" stop-color="var(--accent-soft)" />
            </linearGradient>
            <linearGradient id="forbid-shield" x1="0" x2="1" y1="0" y2="1">
              <stop stop-color="var(--status-warning)" />
              <stop offset="1" stop-color="var(--accent-1)" />
            </linearGradient>
            <filter id="forbid-shadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="var(--fg-1)" flood-opacity=".10" />
            </filter>
          </defs>
          <rect x="34" y="24" width="352" height="172" rx="28" fill="url(#forbid-surface)" stroke="var(--line-1)" />
          <g filter="url(#forbid-shadow)">
            <rect x="64" y="54" width="188" height="120" rx="18" fill="var(--bg-0)" stroke="var(--line-2)" />
            <rect x="88" y="78" width="58" height="58" rx="18" fill="var(--bg-2)" stroke="var(--line-1)" />
            <circle cx="117" cy="99" r="12" fill="var(--accent-soft)" stroke="var(--accent-1)" />
            <path d="M99 147 c8-18 29-18 37 0" fill="none" stroke="var(--accent-1)" stroke-width="5" stroke-linecap="round" />
            <rect x="164" y="80" width="58" height="8" rx="4" fill="var(--line-3)" />
            <rect x="164" y="104" width="72" height="8" rx="4" fill="var(--bg-3)" />
            <rect x="164" y="128" width="50" height="8" rx="4" fill="var(--bg-3)" />
          </g>
          <g filter="url(#forbid-shadow)">
            <path d="M306 48 l62 24 v44 c0 40-27 64-62 78-35-14-62-38-62-78V72z" fill="var(--bg-0)" stroke="var(--line-2)" />
            <path d="M306 62 l45 17 v34 c0 28-18 44-45 56-27-12-45-28-45-56V79z" fill="var(--bg-2)" />
            <rect x="282" y="110" width="48" height="42" rx="12" fill="url(#forbid-shield)" />
            <path d="M292 110 v-12 c0-18 28-18 28 0v12" fill="none" stroke="var(--fg-on-accent, white)" stroke-width="6" stroke-linecap="round" />
            <circle cx="306" cy="132" r="4" fill="var(--fg-on-accent, white)" />
          </g>
          <g filter="url(#forbid-shadow)">
            <circle cx="252" cy="88" r="23" fill="var(--bg-0)" stroke="var(--status-warning)" stroke-width="4" />
            <path d="M240 100 l24-24" stroke="var(--status-warning)" stroke-width="4" stroke-linecap="round" />
          </g>
        </svg>
      </template>
      <template #extra>
        <div class="err__banner">
          <CfBanner
            tone="warning"
            title="需要 admin 角色"
            description="联系工作区所有者授予 'team-orders' 的 read 权限即可访问。"
          />
        </div>
        <div class="err__actions">
          <CfButton variant="primary">申请权限</CfButton>
          <CfButton variant="tertiary">切换账号</CfButton>
        </div>
      </template>
    </CfResult>
  </div>
</template>

<style scoped>
.err {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 36px 24px;
  min-height: 580px;
  font-family: var(--font-sans);
}
.err :deep(.cf-result) {
  width: min(740px, 100%);
  padding: 0;
}
.err :deep(.cf-result__icon) {
  width: min(520px, 100%);
}
.err :deep(.cf-result__icon .err-artwork) {
  display: block;
  width: min(420px, 100%);
  height: auto;
}
.err__banner {
  max-width: 480px;
  margin: 0 auto 16px;
}
.err__actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
