<script setup lang="ts">
/**
 * admin-mini 登录页 —— 演示态，无真正后端。
 * 通过 admin / admin 通过校验后 emit login-success 给 AdminMiniDemo。
 * 用 ChuFix 组件：CfInput / CfButton / CfCheckbox / CfAlert / CfTag。
 */
import { computed, inject, onMounted, ref } from 'vue';
import { CfInput, CfButton, CfCheckbox, CfAlert, CfTag } from '@chufix-design/vue';
import { DemoStateKey, STRINGS } from './state';

const state = inject(DemoStateKey)!;
const t = computed(() => STRINGS[state.locale.value]);

const emit = defineEmits<{
  (e: 'login-success', payload: { username: string; remember: boolean }): void;
}>();

const username = ref('admin');
const password = ref('admin');
const remember = ref(true);
const loading = ref(false);
const error = ref('');

const usernameRef = ref<InstanceType<typeof CfInput> | null>(null);

onMounted(() => {
  // 焦点交给账号输入框，更符合习惯
  setTimeout(() => {
    (usernameRef.value as unknown as { focus?: () => void } | null)?.focus?.();
  }, 100);
});

function submit() {
  error.value = '';
  if (!username.value.trim() || !password.value) {
    error.value = t.value.login_invalid;
    return;
  }
  loading.value = true;
  // 演示态：800ms 假等待，让 loading 状态肉眼可见
  setTimeout(() => {
    loading.value = false;
    if (username.value.trim() === 'admin' && password.value === 'admin') {
      emit('login-success', { username: username.value.trim(), remember: remember.value });
    } else {
      error.value = t.value.login_invalid;
    }
  }, 600);
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Enter') submit();
}
</script>

<template>
  <div class="adm-login" :data-theme="state.theme.value" :data-density="state.density.value">
    <aside class="adm-login__brand">
      <div class="adm-login__brand-card">
        <span class="adm-login__logo" />
        <h1 class="adm-login__title">{{ t.brand }}</h1>
        <p class="adm-login__lede">{{ t.login_lede }}</p>
        <ul class="adm-login__features">
          <li>
            <CfTag size="sm" tone="primary" variant="soft">Vue / React</CfTag>
            <span>{{ state.locale.value === 'zh' ? '双框架同源' : 'Same source for both frameworks' }}</span>
          </li>
          <li>
            <CfTag size="sm" tone="success" variant="soft">CRUD</CfTag>
            <span>{{ state.locale.value === 'zh' ? '用户 / 角色 / 字典 / 菜单 全流程' : 'Users / roles / dictionary / menus end-to-end' }}</span>
          </li>
          <li>
            <CfTag size="sm" tone="info" variant="soft">Theme</CfTag>
            <span>{{ state.locale.value === 'zh' ? '三主题、两密度、五主色' : 'Three themes, two densities, five accents' }}</span>
          </li>
        </ul>
      </div>
    </aside>

    <main class="adm-login__panel">
      <div class="adm-login__form" @keydown="onKey">
        <header class="adm-login__form-head">
          <h2>{{ t.login_title }}</h2>
          <p>{{ t.login_hint }}</p>
        </header>

        <CfAlert
          v-if="error"
          tone="danger"
          variant="soft"
          :title="error"
          closable
          @close="error = ''"
        />

        <div class="adm-login__field">
          <label class="adm-login__label">{{ t.login_username }}</label>
          <CfInput
            ref="usernameRef"
            v-model="username"
            :placeholder="t.login_username"
            size="lg"
          />
        </div>

        <div class="adm-login__field">
          <label class="adm-login__label">{{ t.login_password }}</label>
          <CfInput
            v-model="password"
            type="password"
            :placeholder="t.login_password"
            size="lg"
          />
        </div>

        <div class="adm-login__row">
          <label class="adm-login__check">
            <CfCheckbox v-model="remember" />
            <span>{{ t.login_remember }}</span>
          </label>
          <a class="adm-login__link" href="#" @click.prevent>
            {{ state.locale.value === 'zh' ? '忘记密码' : 'Forgot password?' }}
          </a>
        </div>

        <CfButton
          variant="primary"
          size="lg"
          block
          :loading="loading"
          @click="submit"
        >
          {{ t.login_submit }}
        </CfButton>

        <p class="adm-login__demo">{{ t.login_demo_account }}</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.adm-login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100%;
  height: 100%;
  background: var(--bg-0);
  color: var(--fg-1);
  font-family: var(--font-sans);
  isolation: isolate;
}
.adm-login__brand {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background:
    radial-gradient(circle at 80% 20%, color-mix(in oklch, var(--accent-1), transparent 70%), transparent 55%),
    radial-gradient(circle at 10% 80%, color-mix(in oklch, var(--accent-1), transparent 80%), transparent 60%),
    linear-gradient(135deg, color-mix(in oklch, var(--accent-1), var(--bg-0) 60%), var(--bg-0));
}
.adm-login__brand-card {
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.adm-login__logo {
  width: 40px;
  height: 40px;
  border-radius: var(--r-4);
  background: linear-gradient(135deg, var(--accent-1), color-mix(in oklch, var(--accent-1), var(--bg-0) 40%));
  box-shadow: 0 0 0 1px color-mix(in oklch, var(--accent-1), transparent 50%) inset;
}
.adm-login__title {
  margin: 0;
  font-size: var(--t-22);
  font-weight: var(--w-medium);
  color: var(--fg-1);
}
.adm-login__lede {
  margin: 0;
  color: var(--fg-2);
  font-size: var(--t-14);
  line-height: 1.6;
}
.adm-login__features {
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.adm-login__features li {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--fg-2);
  font-size: var(--t-12);
}

.adm-login__panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;
}
.adm-login__form {
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.adm-login__form-head h2 {
  margin: 0 0 4px;
  font-size: var(--t-18);
  font-weight: var(--w-medium);
  color: var(--fg-1);
}
.adm-login__form-head p {
  margin: 0;
  color: var(--fg-3);
  font-size: var(--t-12);
}
.adm-login__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.adm-login__label {
  font-size: var(--t-12);
  color: var(--fg-2);
}
.adm-login__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
}
.adm-login__check {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--t-12);
  color: var(--fg-2);
  cursor: pointer;
}
.adm-login__link {
  color: var(--accent-1);
  font-size: var(--t-12);
  text-decoration: none;
}
.adm-login__link:hover { text-decoration: none; opacity: 0.85; }
.adm-login__demo {
  margin: 0;
  text-align: center;
  color: var(--fg-3);
  font-size: var(--t-11);
  padding-top: 10px;
  border-top: 1px dashed var(--line-1);
}

@media (max-width: 820px) {
  .adm-login {
    grid-template-columns: 1fr;
  }
  .adm-login__brand {
    display: none;
  }
}
</style>
