<script setup lang="ts">
import { computed, ref } from 'vue';
import { CfBanner, CfButton, CfCard, CfCheckbox, CfDivider, CfInlineCode, CfTag } from '@chufix-design/vue';

const issued = ref(false);
const scopes = ref([
  { id: 'profile', label: '读取基本资料', desc: '姓名、头像、工作区 ID', checked: true, required: true },
  { id: 'projects', label: '读取项目与部署', desc: '项目列表、环境和最近部署记录', checked: true, required: false },
  { id: 'deploy', label: '触发部署', desc: '允许从 Acme Deploy CLI 发起一次部署', checked: false, required: false },
]);

const selectedCount = computed(() => scopes.value.filter((scope) => scope.checked).length);

function allow() {
  issued.value = true;
}
</script>

<template>
  <div class="oauth">
    <section class="oauth__shell">
      <aside class="oauth__summary" aria-label="应用授权摘要">
        <div class="oauth__logo">A</div>
        <h2>Acme Deploy CLI</h2>
        <p>正在请求访问你的 ChuFix 工作区。</p>
        <div class="oauth__flow">
          <span class="is-done">Client</span>
          <span class="is-active">Consent</span>
          <span>Code</span>
          <span>Token</span>
        </div>
        <dl>
          <div>
            <dt>client_id</dt>
            <dd>acme-deploy-cli</dd>
          </div>
          <div>
            <dt>response_type</dt>
            <dd>code</dd>
          </div>
          <div>
            <dt>redirect_uri</dt>
            <dd>http://127.0.0.1:8145/callback</dd>
          </div>
        </dl>
      </aside>

      <CfCard class="oauth__card">
        <div class="oauth__eyebrow">
          <CfTag tone="primary" variant="soft">OAuth 2.0</CfTag>
          <span>{{ selectedCount }} 个权限范围</span>
        </div>
        <h2>允许 Acme Deploy CLI 访问 ChuFix？</h2>
        <p class="oauth__desc">
          授权后将跳转到本地回调地址，并签发一次性授权码。
        </p>

        <CfBanner tone="info" :icon="false">
          回调地址 <CfInlineCode>http://127.0.0.1:8145/callback</CfInlineCode> 已注册在当前应用。
        </CfBanner>

        <div class="oauth__scopes">
          <label v-for="scope in scopes" :key="scope.id" class="oauth__scope">
            <CfCheckbox v-model="scope.checked" :disabled="scope.required" />
            <span>
              <strong>{{ scope.label }}</strong>
              <small>{{ scope.desc }}</small>
            </span>
            <CfTag v-if="scope.required" tone="neutral" variant="outline" size="sm">必选</CfTag>
          </label>
        </div>

        <CfDivider />

        <div v-if="issued" class="oauth__issued">
          <span>授权码已生成</span>
          <CfInlineCode>cf_code_7K29M2Q</CfInlineCode>
        </div>

        <div class="oauth__actions">
          <CfButton variant="primary" @click="allow">{{ issued ? '已允许' : '允许访问' }}</CfButton>
          <CfButton variant="tertiary">拒绝</CfButton>
        </div>
      </CfCard>
    </section>
  </div>
</template>

<style scoped>
.oauth {
  min-height: 680px;
  padding: 32px;
  font-family: var(--font-sans);
  color: var(--fg-1);
}
.oauth__shell {
  display: grid;
  grid-template-columns: minmax(280px, 380px) minmax(360px, 520px);
  align-items: stretch;
  gap: 28px;
  width: min(980px, 100%);
  margin: 0 auto;
}
.oauth__summary {
  position: relative;
  padding: 30px;
  border: 1px solid var(--line-1);
  border-radius: 24px;
  overflow: hidden;
  background:
    radial-gradient(circle at 28% 16%, var(--accent-soft), transparent 30%),
    linear-gradient(145deg, var(--bg-0), var(--bg-2));
}
.oauth__summary::after {
  content: "";
  position: absolute;
  right: -52px;
  bottom: -68px;
  width: 190px;
  height: 190px;
  border: 26px solid color-mix(in srgb, var(--accent-1) 18%, transparent);
  border-radius: 50%;
}
.oauth__logo {
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  border-radius: 18px;
  background: var(--accent-1);
  color: var(--fg-on-accent, white);
  font-size: 28px;
  font-weight: var(--w-semibold);
  box-shadow: 0 16px 36px color-mix(in srgb, var(--accent-1) 28%, transparent);
}
.oauth__summary h2,
.oauth__card h2 {
  margin: 18px 0 8px;
  font-size: var(--t-26);
  font-weight: var(--w-semibold);
}
.oauth__summary p,
.oauth__desc {
  margin: 0 0 20px;
  color: var(--fg-2);
  line-height: 1.6;
}
.oauth__flow {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin: 24px 0;
}
.oauth__flow span {
  display: grid;
  place-items: center;
  min-height: 42px;
  border: 1px solid var(--line-1);
  border-radius: 12px;
  background: var(--bg-0);
  color: var(--fg-3);
  font-size: var(--t-12);
}
.oauth__flow .is-done {
  color: var(--status-success);
  background: var(--status-success-soft, var(--bg-1));
}
.oauth__flow .is-active {
  color: var(--accent-1);
  border-color: var(--accent-1);
}
.oauth__summary dl {
  display: grid;
  gap: 12px;
  margin: 0;
}
.oauth__summary dl div {
  position: relative;
  z-index: 1;
  padding: 12px;
  border: 1px solid var(--line-1);
  border-radius: 14px;
  background: color-mix(in srgb, var(--bg-0) 88%, transparent);
}
.oauth__summary dt {
  margin-bottom: 4px;
  color: var(--fg-3);
  font-size: var(--t-11);
}
.oauth__summary dd {
  margin: 0;
  overflow-wrap: anywhere;
  font-family: var(--font-mono);
  font-size: var(--t-12);
  color: var(--fg-1);
}
.oauth__card {
  padding: 30px;
}
.oauth__eyebrow,
.oauth__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.oauth__eyebrow {
  justify-content: space-between;
}
.oauth__eyebrow span,
.oauth__issued span {
  color: var(--fg-3);
  font-size: var(--t-12);
}
.oauth__scopes {
  display: grid;
  gap: 12px;
  margin: 18px 0 6px;
}
.oauth__scope {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--line-1);
  border-radius: 16px;
  background: var(--bg-1);
}
.oauth__scope strong,
.oauth__scope small {
  display: block;
}
.oauth__scope strong {
  margin-bottom: 4px;
  font-size: var(--t-14);
}
.oauth__scope small {
  color: var(--fg-3);
  line-height: 1.5;
}
.oauth__issued {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
  padding: 12px 14px;
  border: 1px solid var(--status-success);
  border-radius: 14px;
  background: var(--status-success-soft, var(--bg-1));
}
@media (max-width: 860px) {
  .oauth {
    padding: 20px;
  }
  .oauth__shell {
    grid-template-columns: 1fr;
  }
}
</style>
