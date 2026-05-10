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
            <linearGradient id="nf-surface" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stop-color="var(--bg-1)" />
              <stop offset="100%" stop-color="var(--accent-soft)" />
            </linearGradient>
            <linearGradient id="nf-line" x1="78" x2="335" y1="128" y2="92" gradientUnits="userSpaceOnUse">
              <stop stop-color="var(--accent-1)" />
              <stop offset="1" stop-color="var(--status-warning)" />
            </linearGradient>
            <filter id="nf-shadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="var(--fg-1)" flood-opacity=".10" />
            </filter>
          </defs>
          <rect x="34" y="24" width="352" height="172" rx="28" fill="url(#nf-surface)" stroke="var(--line-1)" />
          <g filter="url(#nf-shadow)">
            <rect x="72" y="54" width="210" height="118" rx="18" fill="var(--bg-0)" stroke="var(--line-2)" />
            <path d="M72 84 h210" stroke="var(--line-1)" />
            <circle cx="92" cy="70" r="4" fill="var(--line-3)" />
            <circle cx="108" cy="70" r="4" fill="var(--line-3)" />
            <circle cx="124" cy="70" r="4" fill="var(--line-3)" />
            <rect x="94" y="106" width="76" height="10" rx="5" fill="var(--accent-soft)" />
            <rect x="94" y="128" width="130" height="8" rx="4" fill="var(--bg-3)" />
            <rect x="94" y="146" width="92" height="8" rx="4" fill="var(--bg-3)" />
          </g>
          <path d="M118 142 C154 108 181 145 210 112 S264 74 326 93" fill="none" stroke="url(#nf-line)" stroke-width="4" stroke-linecap="round" stroke-dasharray="3 10" />
          <g filter="url(#nf-shadow)">
            <rect x="248" y="74" width="100" height="72" rx="18" fill="var(--bg-0)" stroke="var(--line-2)" />
            <text x="298" y="118" text-anchor="middle" font-family="var(--font-mono)" font-size="32" font-weight="700" fill="var(--accent-1)">404</text>
          </g>
          <g filter="url(#nf-shadow)">
            <circle cx="210" cy="112" r="28" fill="var(--bg-0)" stroke="var(--line-2)" />
            <path d="M200 105 c1-11 20-12 20 1 0 10-11 10-11 21" fill="none" stroke="var(--status-warning)" stroke-width="4.5" stroke-linecap="round" />
            <circle cx="210" cy="135" r="3" fill="var(--status-warning)" />
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
