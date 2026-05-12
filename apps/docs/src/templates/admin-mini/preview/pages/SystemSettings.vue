<script setup lang="ts">
/**
 * 系统设置页 —— 展示更多表单组件：
 *   CfSwitch · CfRadioGroup · CfSlider · CfNumberInput · CfDatePicker · CfDropzone
 */
import { computed, inject, ref } from 'vue';
import {
  CfTabs,
  CfTabPanel,
  CfForm,
  CfFormField,
  CfSwitch,
  CfRadioGroup,
  CfRadio,
  CfSlider,
  CfNumberInput,
  CfDatePicker,
  CfDropzone,
  CfButton,
  CfTag,
  toast,
} from '@chufix-design/vue';
import { DemoStateKey, STRINGS } from '../state';

const state = inject(DemoStateKey)!;
const t = computed(() => STRINGS[state.locale.value]);

const initialForm = () => ({
  twoFactor: true,
  logRetention: 90,
  sessionTimeout: 30,
  passwordPolicy: 'strict' as 'basic' | 'strict' | 'paranoid',
  nextBackup: '2026-05-13',
  files: [] as File[],
});

const form = ref(initialForm());

function save() {
  toast.success(t.value.sys_saved);
}
function revert() {
  form.value = initialForm();
  toast.info(t.value.sys_reverted);
}

const activeTab = ref<'general' | 'security' | 'backup'>('general');
</script>

<template>
  <div class="adm-page">
    <CfTabs v-model="activeTab" variant="line">
      <CfTabPanel value="general" :label="t.sys_general">
        <div class="adm-settings">
          <CfForm :model="form" layout="vertical">
            <CfFormField :label="t.sys_log_retention" name="logRetention">
              <div class="adm-settings__row">
                <CfSlider
                  v-model="form.logRetention"
                  :min="7"
                  :max="365"
                  :step="1"
                  show-value
                  style="flex: 1;"
                />
                <CfTag size="sm" tone="info">{{ form.logRetention }} {{ state.locale.value === 'zh' ? '天' : 'days' }}</CfTag>
              </div>
              <p class="adm-settings__hint">{{ t.sys_log_retention_hint }}</p>
            </CfFormField>

            <CfFormField :label="t.sys_session_timeout" name="sessionTimeout">
              <CfNumberInput v-model="form.sessionTimeout" :min="5" :max="240" :step="5" style="width: 160px;" />
            </CfFormField>
          </CfForm>
        </div>
      </CfTabPanel>

      <CfTabPanel value="security" :label="t.sys_security">
        <div class="adm-settings">
          <CfForm :model="form" layout="vertical">
            <CfFormField :label="t.sys_two_factor" name="twoFactor">
              <div class="adm-settings__row">
                <CfSwitch v-model="form.twoFactor" />
                <span class="adm-settings__hint adm-settings__hint--inline">{{ t.sys_two_factor_hint }}</span>
              </div>
            </CfFormField>

            <CfFormField :label="t.sys_password_policy" name="passwordPolicy">
              <CfRadioGroup v-model="form.passwordPolicy">
                <CfRadio value="basic">{{ t.sys_password_policy_basic }}</CfRadio>
                <CfRadio value="strict">{{ t.sys_password_policy_strict }}</CfRadio>
                <CfRadio value="paranoid">{{ t.sys_password_policy_paranoid }}</CfRadio>
              </CfRadioGroup>
            </CfFormField>
          </CfForm>
        </div>
      </CfTabPanel>

      <CfTabPanel value="backup" :label="t.sys_backup">
        <div class="adm-settings">
          <CfForm :model="form" layout="vertical">
            <CfFormField :label="t.sys_next_backup" name="nextBackup">
              <CfDatePicker v-model="form.nextBackup" :placeholder="t.sys_next_backup" style="width: 220px;" />
            </CfFormField>

            <CfFormField :label="t.sys_upload_logs" name="files">
              <CfDropzone
                v-model="form.files"
                multiple
                :max-size="20 * 1024 * 1024"
                accept=".log,.txt,.gz,application/gzip,text/plain"
              />
            </CfFormField>
          </CfForm>
        </div>
      </CfTabPanel>
    </CfTabs>

    <footer class="adm-page__foot">
      <CfButton variant="tertiary" @click="revert">{{ t.sys_revert }}</CfButton>
      <CfButton variant="primary" @click="save">{{ t.sys_save_changes }}</CfButton>
    </footer>
  </div>
</template>

<style scoped>
.adm-page { display: flex; flex-direction: column; gap: 12px; }
.adm-settings { padding: 16px 4px 4px; max-width: 720px; }
.adm-settings__row {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}
.adm-settings__hint {
  margin: 6px 0 0;
  color: var(--fg-3);
  font-size: var(--t-11);
  line-height: 1.6;
}
.adm-settings__hint--inline {
  margin: 0;
}
.adm-page__foot {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid var(--line-1);
}
</style>
