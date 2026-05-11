<script setup lang="ts">
import { computed, ref } from 'vue';
import { CfBanner, CfButton, CfCard, CfProgress, CfTag } from '@chufix-design/vue';

const code = 'K9QF-4M2D';
const copied = ref(false);
const approved = ref(false);
const remainingSeconds = 12 * 60 + 18;
const progress = computed(() => Math.round((remainingSeconds / (15 * 60)) * 100));

function copyCode() {
  copied.value = true;
  window.setTimeout(() => {
    copied.value = false;
  }, 1200);
}

function approve() {
  approved.value = true;
}
</script>

<template>
  <div class="device-auth">
    <section class="device-auth__shell">
      <div class="device-auth__visual" aria-hidden="true">
        <div class="device-auth__halo" />
        <div class="device-auth__device device-auth__device--tv">
          <span class="device-auth__dot" />
          <span class="device-auth__dot" />
          <span class="device-auth__dot" />
          <strong>{{ code }}</strong>
          <small>waiting for browser approval</small>
        </div>
        <div class="device-auth__link">
          <span />
        </div>
        <div class="device-auth__device device-auth__device--phone">
          <span class="device-auth__phone-bar" />
          <span class="device-auth__phone-check">✓</span>
          <small>trusted session</small>
        </div>
      </div>

      <CfCard class="device-auth__card">
        <div class="device-auth__eyebrow">
          <CfTag tone="info" variant="soft">Device login</CfTag>
          <span>12:18 后过期</span>
        </div>
        <h2>授权新设备</h2>
        <p class="device-auth__desc">
          你正在为 ChuFix CLI 授权。确认设备屏幕上的代码一致后继续。
        </p>

        <div class="device-auth__code" aria-label="设备授权码">
          <span v-for="part in code.split('-')" :key="part">{{ part }}</span>
        </div>

        <div class="device-auth__meter">
          <CfProgress :value="progress" size="sm" tone="primary" />
          <span>15 分钟有效期</span>
        </div>

        <CfBanner tone="neutral" :icon="false">
          设备：ChuFix CLI · macOS · 上海附近 · 2026-05-10 11:42
        </CfBanner>

        <ol class="device-auth__steps">
          <li>确认设备屏幕显示同一组代码。</li>
          <li>授权后设备只会获得当前工作区的只读令牌。</li>
          <li>如果你没有发起登录，请拒绝并重置当前账号会话。</li>
        </ol>

        <div class="device-auth__actions">
          <CfButton variant="primary" @click="approve">{{ approved ? '已授权' : '确认授权' }}</CfButton>
          <CfButton variant="secondary" @click="copyCode">{{ copied ? '已复制' : '复制代码' }}</CfButton>
          <CfButton variant="tertiary">拒绝</CfButton>
        </div>
      </CfCard>
    </section>
  </div>
</template>

<style scoped>
.device-auth {
  min-height: 640px;
  padding: 32px;
  font-family: var(--font-sans);
  color: var(--fg-1);
}
.device-auth__shell {
  display: grid;
  grid-template-columns: minmax(320px, 1fr) minmax(360px, 460px);
  align-items: center;
  gap: 32px;
  width: min(980px, 100%);
  min-height: 560px;
  margin: 0 auto;
}
.device-auth__visual {
  position: relative;
  min-height: 460px;
  border: 1px solid var(--line-1);
  border-radius: 24px;
  overflow: hidden;
  background:
    radial-gradient(circle at 22% 18%, var(--accent-soft), transparent 30%),
    linear-gradient(135deg, var(--bg-0), var(--bg-2));
}
.device-auth__halo {
  position: absolute;
  inset: 76px 56px;
  border: 2px dashed color-mix(in srgb, var(--accent-1) 62%, transparent);
  border-radius: 999px;
  transform: rotate(-8deg);
}
.device-auth__device {
  position: absolute;
  display: grid;
  gap: 8px;
  border: 1px solid var(--line-2);
  border-radius: 20px;
  background: var(--bg-0);
  box-shadow: 0 18px 40px color-mix(in srgb, var(--shadow-color) 16%, transparent);
}
.device-auth__device--tv {
  left: 56px;
  top: 92px;
  width: 250px;
  padding: 24px;
}
.device-auth__device--phone {
  right: 58px;
  bottom: 86px;
  width: 150px;
  padding: 22px 18px;
  text-align: center;
}
.device-auth__dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 6px;
  border-radius: 999px;
  background: var(--fg-3);
}
.device-auth__device strong {
  margin-top: 18px;
  font-family: var(--font-mono);
  font-size: 34px;
  letter-spacing: .04em;
  color: var(--accent-1);
}
.device-auth__device small,
.device-auth__eyebrow span,
.device-auth__meter span {
  font-size: var(--t-12);
  color: var(--fg-3);
}
.device-auth__link {
  position: absolute;
  left: 306px;
  top: 194px;
  width: 128px;
  height: 52px;
  border-top: 5px solid color-mix(in srgb, var(--accent-1) 70%, transparent);
  border-radius: 60% 60% 0 0;
}
.device-auth__link span {
  position: absolute;
  right: -5px;
  top: -10px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--status-success);
}
.device-auth__phone-bar {
  width: 64px;
  height: 8px;
  margin: 0 auto 16px;
  border-radius: 999px;
  background: var(--line-3);
}
.device-auth__phone-check {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  margin: 0 auto 12px;
  border-radius: 50%;
  background: var(--status-success-soft, var(--accent-soft));
  color: var(--status-success);
  font-size: 30px;
  font-weight: var(--w-semibold);
}
.device-auth__card {
  padding: 28px;
}
.device-auth__eyebrow,
.device-auth__meter,
.device-auth__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.device-auth__eyebrow {
  justify-content: space-between;
}
.device-auth__card h2 {
  margin: 18px 0 8px;
  font-size: var(--t-28);
  font-weight: var(--w-semibold);
}
.device-auth__desc {
  margin: 0 0 20px;
  color: var(--fg-2);
  line-height: 1.6;
}
.device-auth__code {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}
.device-auth__code span {
  display: grid;
  place-items: center;
  min-height: 76px;
  border: 1px solid var(--line-2);
  border-radius: 16px;
  background: var(--bg-1);
  font-family: var(--font-mono);
  font-size: 34px;
  font-weight: var(--w-semibold);
  color: var(--fg-1);
}
.device-auth__meter {
  margin-bottom: 16px;
}
.device-auth__meter :deep(.cf-progress) {
  flex: 1 1 180px;
}
.device-auth__steps {
  display: grid;
  gap: 10px;
  margin: 18px 0 22px;
  padding-left: 18px;
  color: var(--fg-2);
  font-size: var(--t-13);
  line-height: 1.55;
}
@media (max-width: 820px) {
  .device-auth {
    padding: 20px;
  }
  .device-auth__shell {
    grid-template-columns: 1fr;
  }
  .device-auth__visual {
    min-height: 340px;
  }
  .device-auth__device--tv {
    left: 28px;
    top: 64px;
    width: 220px;
  }
  .device-auth__device--phone {
    right: 28px;
    bottom: 52px;
  }
}
</style>
