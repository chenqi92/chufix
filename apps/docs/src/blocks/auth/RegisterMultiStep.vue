<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  CfCard,
  CfStepper,
  CfInput,
  CfButton,
  CfPasswordStrength,
  CfPhoneInput,
  CfCheckbox,
} from '@chufix/vue';

const steps = [
  { id: 'account', title: '账号' },
  { id: 'profile', title: '个人' },
  { id: 'verify', title: '验证' },
];
const current = ref(0);
const email = ref('');
const password = ref('');
const name = ref('');
const phone = ref('');
const country = ref('CN');
const agreed = ref(false);

const canNext = computed(() => {
  if (current.value === 0) return email.value.length > 3 && password.value.length >= 8;
  if (current.value === 1) return name.value.length > 0;
  if (current.value === 2) return agreed.value;
  return false;
});
function next() {
  if (current.value < steps.length - 1) current.value += 1;
  else alert(`Register: ${email.value}`);
}
function prev() {
  if (current.value > 0) current.value -= 1;
}
</script>

<template>
  <div class="reg">
    <CfCard class="reg__card">
      <h2>注册新账号</h2>
      <CfStepper :items="steps" :current="current" />

      <div v-if="current === 0" class="reg__pane">
        <label class="reg__field">
          <span>邮箱</span>
          <CfInput v-model="email" type="email" placeholder="you@example.com" />
        </label>
        <label class="reg__field">
          <span>密码</span>
          <CfPasswordStrength v-model="password" placeholder="至少 8 位，含大小写、数字、符号" />
        </label>
      </div>

      <div v-if="current === 1" class="reg__pane">
        <label class="reg__field">
          <span>姓名</span>
          <CfInput v-model="name" placeholder="张三" />
        </label>
        <label class="reg__field">
          <span>手机号（可选）</span>
          <CfPhoneInput v-model="phone" v-model:country="country" />
        </label>
      </div>

      <div v-if="current === 2" class="reg__pane">
        <p>
          注册即代表你同意 <a href="#">服务条款</a> 与 <a href="#">隐私政策</a>。
        </p>
        <label class="reg__agree">
          <CfCheckbox v-model="agreed" />
          我已阅读并同意上述协议
        </label>
      </div>

      <div class="reg__actions">
        <CfButton v-if="current > 0" variant="tertiary" @click="prev">上一步</CfButton>
        <CfButton variant="primary" :disabled="!canNext" @click="next">
          {{ current === steps.length - 1 ? '完成注册' : '下一步' }}
        </CfButton>
      </div>
    </CfCard>
  </div>
</template>

<style scoped>
.reg {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  min-height: 600px;
  font-family: var(--font-sans);
}
.reg__card {
  width: 100%;
  max-width: 480px;
  padding: 28px;
}
.reg__card h2 {
  margin: 0 0 16px;
  font-size: var(--t-22);
  font-weight: var(--w-medium);
  color: var(--fg-1);
}
.reg__pane {
  margin: 18px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  font-size: var(--t-13);
}
.reg__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.reg__field > span {
  font-size: var(--t-12);
  color: var(--fg-2);
}
.reg__agree {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--t-13);
  color: var(--fg-2);
}
.reg__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}
</style>
