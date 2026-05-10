<script setup lang="ts">
import { ref } from 'vue';
import {
  CfCard,
  CfInput,
  CfButton,
  CfCheckbox,
  CfLink,
  CfDivider,
} from '@chufix-design/vue';

const email = ref('');
const password = ref('');
const remember = ref(true);
</script>

<template>
  <div class="login">
    <CfCard class="login__card">
      <header class="login__head">
        <h2>登录 ChuFix</h2>
        <p>使用邮箱继续</p>
      </header>
      <form class="login__form" @submit.prevent="alert(`Sign in: ${email}`)">
        <label class="login__field">
          <span>邮箱</span>
          <CfInput v-model="email" type="email" placeholder="you@example.com" required />
        </label>
        <label class="login__field">
          <span class="login__field-row">
            密码
            <CfLink href="#">忘记密码？</CfLink>
          </span>
          <CfInput v-model="password" type="password" placeholder="••••••••" required />
        </label>
        <label class="login__remember">
          <CfCheckbox v-model="remember" />
          7 天内自动登录
        </label>
        <CfButton variant="primary" block type="submit">登录</CfButton>
      </form>
      <CfDivider />
      <CfButton variant="secondary" block>使用 GitHub 登录</CfButton>
      <p class="login__foot">
        没有账号？<CfLink href="#">立即注册</CfLink>
      </p>
    </CfCard>
  </div>
</template>

<style scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  min-height: 480px;
  font-family: var(--font-sans);
}
.login__card {
  width: 100%;
  max-width: 400px;
  padding: 28px;
}
.login__head h2 {
  margin: 0;
  font-size: var(--t-22);
  font-weight: var(--w-medium);
  color: var(--fg-1);
}
.login__head p {
  margin: 4px 0 18px;
  color: var(--fg-3);
  font-size: var(--t-13);
}
.login__form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.login__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: var(--t-12);
  color: var(--fg-2);
}
.login__field-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.login__remember {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--t-12);
  color: var(--fg-2);
}
.login__foot {
  margin: 16px 0 0;
  text-align: center;
  font-size: var(--t-12);
  color: var(--fg-3);
}
</style>
