<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import { CfCard, CfButton, CfOtpInput, CfLink, CfPhoneInput } from '@chufix-design/vue';

const phone = ref('138 0013 8000');
const country = ref('CN');
const code = ref('');
const sent = ref(false);
const remaining = ref(0);
let timer: number | null = null;

function send() {
  sent.value = true;
  remaining.value = 60;
  if (timer) window.clearInterval(timer);
  timer = window.setInterval(() => {
    remaining.value -= 1;
    if (remaining.value <= 0 && timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }, 1000);
}

watch(code, (v) => {
  if (v.length === 6) alert(`OTP submitted: ${v}`);
});

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer);
});
</script>

<template>
  <div class="otp">
    <CfCard class="otp__card">
      <h2>短信验证</h2>
      <p>我们会向 <strong>+{{ country === 'CN' ? '86' : '1' }} {{ phone }}</strong> 发送一次性验证码。</p>

      <div class="otp__phone">
        <CfPhoneInput v-model="phone" v-model:country="country" :disabled="sent" />
      </div>

      <div v-if="sent" class="otp__digits">
        <CfOtpInput v-model="code" :length="6" />
        <p class="otp__hint">
          <template v-if="remaining > 0">
            没收到？{{ remaining }}s 后可重发
          </template>
          <template v-else>
            <CfLink href="#" @click.prevent="send">重新发送验证码</CfLink>
          </template>
        </p>
      </div>

      <CfButton v-if="!sent" variant="primary" block @click="send">发送验证码</CfButton>
      <CfButton v-else variant="primary" block :disabled="code.length !== 6">确认</CfButton>
    </CfCard>
  </div>
</template>

<style scoped>
.otp {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  min-height: 480px;
  font-family: var(--font-sans);
}
.otp__card {
  width: 100%;
  max-width: 420px;
  padding: 28px;
}
.otp__card h2 {
  margin: 0;
  font-size: var(--t-22);
  font-weight: var(--w-medium);
  color: var(--fg-1);
}
.otp__card p {
  color: var(--fg-2);
  font-size: var(--t-13);
  margin: 4px 0 18px;
}
.otp__phone { margin-bottom: 16px; }
.otp__digits { margin-bottom: 16px; }
.otp__hint {
  margin: 8px 0 0;
  font-size: var(--t-12);
  color: var(--fg-3);
}
</style>
