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
            <linearGradient id="forbid-panel" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stop-color="var(--bg-1)" />
              <stop offset="100%" stop-color="var(--accent-soft)" />
            </linearGradient>
            <linearGradient id="forbid-lock" x1="0" x2="1">
              <stop stop-color="var(--status-warning)" />
              <stop offset="1" stop-color="var(--accent-1)" />
            </linearGradient>
          </defs>
          <rect x="22" y="22" width="376" height="176" rx="22" fill="url(#forbid-panel)" stroke="var(--line-1)" />
          <rect x="58" y="58" width="160" height="104" rx="14" fill="var(--bg-1)" stroke="var(--line-2)" />
          <path d="M82 88 h86 M82 112 h112 M82 136 h70" stroke="var(--line-3)" stroke-width="8" stroke-linecap="round" />
          <g transform="translate(250 52)">
            <path d="M60 12 l54 20 v40 c0 42-28 67-54 79-26-12-54-37-54-79V32z" fill="var(--bg-0)" stroke="var(--line-2)" />
            <path d="M60 24 l40 15 v33 c0 28-18 47-40 58-22-11-40-30-40-58V39z" fill="var(--bg-2)" />
            <rect x="36" y="72" width="48" height="42" rx="10" fill="url(#forbid-lock)" />
            <path d="M46 72 v-14 c0-20 28-20 28 0v14" fill="none" stroke="var(--fg-on-accent, white)" stroke-width="6" stroke-linecap="round" />
            <circle cx="60" cy="94" r="4" fill="var(--fg-on-accent, white)" />
          </g>
          <g transform="translate(196 88)">
            <circle cx="0" cy="0" r="25" fill="var(--bg-1)" stroke="var(--status-warning)" stroke-width="5" />
            <path d="M-14 14 L14 -14" stroke="var(--status-warning)" stroke-width="5" stroke-linecap="round" />
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
