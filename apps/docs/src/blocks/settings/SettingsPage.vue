<script setup lang="ts">
import { ref } from 'vue';
import {
  CfTabs,
  CfTabPanel,
  CfInput,
  CfTextarea,
  CfSwitch,
  CfButton,
  CfAvatar,
  CfDivider,
  CfSelect,
} from '@chufix-design/vue';

const name = ref('Jane Liu');
const email = ref('jane.l@example.com');
const bio = ref('Backend engineer · payments team · UTC+8');
const lang = ref('zh-CN');
const langs = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English (US)', value: 'en-US' },
  { label: '日本語', value: 'ja-JP' },
];
const notifEmail = ref(true);
const notifPush = ref(false);
const notifWeekly = ref(true);
const tfa = ref(true);
</script>

<template>
  <div class="set">
    <header class="set__head">
      <h2>设置</h2>
      <p>个人资料、通知偏好与安全设置</p>
    </header>
    <CfTabs default-value="profile">
      <CfTabPanel value="profile" label="个人资料">
        <div class="set__pane">
          <div class="set__avatar">
            <CfAvatar size="lg">JL</CfAvatar>
            <CfButton variant="tertiary" size="sm">更换头像</CfButton>
          </div>
          <label class="set__field">
            <span>姓名</span>
            <CfInput v-model="name" />
          </label>
          <label class="set__field">
            <span>邮箱</span>
            <CfInput v-model="email" type="email" />
          </label>
          <label class="set__field">
            <span>个人简介</span>
            <CfTextarea v-model="bio" :rows="3" />
          </label>
          <label class="set__field">
            <span>语言</span>
            <CfSelect v-model="lang" :options="langs" />
          </label>
          <CfDivider />
          <div class="set__actions">
            <CfButton variant="primary">保存</CfButton>
            <CfButton variant="tertiary">取消</CfButton>
          </div>
        </div>
      </CfTabPanel>

      <CfTabPanel value="notify" label="通知">
        <div class="set__pane">
          <label class="set__row">
            <div>
              <div class="set__row-title">邮件通知</div>
              <div class="set__row-sub">接收账号活动、安全提醒邮件</div>
            </div>
            <CfSwitch v-model="notifEmail" />
          </label>
          <label class="set__row">
            <div>
              <div class="set__row-title">推送通知</div>
              <div class="set__row-sub">桌面 Web Push 实时推送</div>
            </div>
            <CfSwitch v-model="notifPush" />
          </label>
          <label class="set__row">
            <div>
              <div class="set__row-title">每周摘要</div>
              <div class="set__row-sub">每周一发送过去 7 天的活跃报告</div>
            </div>
            <CfSwitch v-model="notifWeekly" />
          </label>
        </div>
      </CfTabPanel>

      <CfTabPanel value="security" label="安全">
        <div class="set__pane">
          <label class="set__row">
            <div>
              <div class="set__row-title">两步验证</div>
              <div class="set__row-sub">登录时除密码外要求 OTP 验证码</div>
            </div>
            <CfSwitch v-model="tfa" />
          </label>
          <CfDivider />
          <div class="set__field">
            <span>修改密码</span>
            <CfButton variant="secondary">前往修改密码</CfButton>
          </div>
          <div class="set__field">
            <span>登出所有设备</span>
            <CfButton variant="danger">立即登出所有会话</CfButton>
          </div>
        </div>
      </CfTabPanel>
    </CfTabs>
  </div>
</template>

<style scoped>
.set {
  display: flex;
  flex-direction: column;
  gap: 14px;
  font-family: var(--font-sans);
}
.set__head h2 {
  margin: 0;
  font-size: var(--t-22);
  font-weight: var(--w-medium);
  color: var(--fg-1);
}
.set__head p {
  margin: 4px 0 0;
  color: var(--fg-3);
  font-size: var(--t-12);
}
.set__pane {
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 520px;
}
.set__avatar {
  display: flex;
  align-items: center;
  gap: 16px;
}
.set__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: var(--t-12);
  color: var(--fg-2);
}
.set__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line-1);
}
.set__row:last-child {
  border-bottom: 0;
}
.set__row-title {
  color: var(--fg-1);
  font-weight: var(--w-medium);
  font-size: var(--t-13);
}
.set__row-sub {
  color: var(--fg-3);
  font-size: var(--t-11);
  margin-top: 2px;
}
.set__actions {
  display: flex;
  gap: 8px;
}
</style>
