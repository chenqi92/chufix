<script setup lang="ts">
import { CfResult, CfButton, CfLink } from '@chufix-design/vue';
</script>

<template>
  <div class="err">
    <CfResult
      status="404"
      size="lg"
      title="页面走丢了"
      description="这个地址可能已经移动、被删除，或者你打错了字符。"
    >
      <template #icon>
        <svg class="err-artwork" viewBox="0 0 420 220" role="img" aria-label="404 页面插画">
          <defs>
            <linearGradient id="nf-panel" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stop-color="var(--bg-1)" />
              <stop offset="100%" stop-color="var(--accent-soft)" />
            </linearGradient>
            <linearGradient id="nf-route" x1="72" x2="342" y1="142" y2="70" gradientUnits="userSpaceOnUse">
              <stop stop-color="var(--accent-1)" />
              <stop offset="1" stop-color="var(--status-info)" />
            </linearGradient>
          </defs>
          <rect x="22" y="22" width="376" height="176" rx="22" fill="url(#nf-panel)" stroke="var(--line-1)" />
          <path d="M72 144 C126 92 160 170 206 118 S286 70 344 82" fill="none" stroke="url(#nf-route)" stroke-width="5" stroke-linecap="round" stroke-dasharray="10 12" />
          <g fill="var(--bg-1)" stroke="var(--line-2)">
            <rect x="54" y="54" width="118" height="82" rx="12" />
            <rect x="248" y="78" width="116" height="86" rx="12" />
          </g>
          <g fill="var(--fg-3)">
            <circle cx="74" cy="74" r="4" />
            <circle cx="88" cy="74" r="4" />
            <circle cx="102" cy="74" r="4" />
          </g>
          <path d="M76 102 h68 M76 120 h40" stroke="var(--line-3)" stroke-width="6" stroke-linecap="round" />
          <text x="286" y="128" text-anchor="middle" font-family="var(--font-mono)" font-size="42" font-weight="700" fill="var(--accent-1)">404</text>
          <g transform="translate(190 76)">
            <rect width="62" height="62" rx="16" fill="var(--bg-0)" stroke="var(--line-2)" />
            <path d="M22 22 c2-12 22-12 22 2 0 12-14 12-14 23" fill="none" stroke="var(--accent-1)" stroke-width="5" stroke-linecap="round" />
            <circle cx="31" cy="52" r="3.5" fill="var(--accent-1)" />
          </g>
        </svg>
      </template>
      <template #extra>
        <div class="err__actions">
          <CfButton variant="primary">返回首页</CfButton>
          <CfButton variant="tertiary">联系支持</CfButton>
        </div>
        <p class="err__links">
          常见入口：<CfLink href="#">所有组件</CfLink> · <CfLink href="#">Blocks</CfLink> · <CfLink href="#">主题与 token</CfLink>
        </p>
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
  min-height: 560px;
  font-family: var(--font-sans);
}
.err :deep(.cf-result) {
  width: min(720px, 100%);
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
.err__actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}
.err__links {
  margin: 16px 0 0;
  text-align: center;
  font-size: var(--t-12);
  color: var(--fg-3);
}
</style>
