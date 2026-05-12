import { useContext, useState } from 'react';
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
} from '@chufix-design/react';
import { DemoContext, STRINGS } from '../state';

type PasswordPolicy = 'basic' | 'strict' | 'paranoid';

const initialForm = () => ({
  twoFactor: true,
  logRetention: 90,
  sessionTimeout: 30,
  passwordPolicy: 'strict' as PasswordPolicy,
  nextBackup: '2026-05-13',
  files: [] as File[],
});

export default function SystemSettings() {
  const ctx = useContext(DemoContext)!;
  const t = STRINGS[ctx.locale];

  const [form, setForm] = useState(initialForm());
  const [tab, setTab] = useState<'general' | 'security' | 'backup'>('general');

  return (
    <div className="adm-page">
      <CfTabs modelValue={tab} onUpdateModelValue={(v) => setTab(v as typeof tab)} variant="line">
        <CfTabPanel value="general" label={t.sys_general}>
          <div className="adm-settings">
            <CfForm model={form} layout="vertical">
              <CfFormField label={t.sys_log_retention} name="logRetention">
                <div className="adm-settings__row">
                  <CfSlider
                    modelValue={form.logRetention}
                    onUpdateModelValue={(v) => setForm({ ...form, logRetention: v })}
                    min={7} max={365} step={1} showValue style={{ flex: 1 }}
                  />
                  <CfTag size="sm" tone="info">{form.logRetention} {ctx.locale === 'zh' ? '天' : 'days'}</CfTag>
                </div>
                <p className="adm-settings__hint">{t.sys_log_retention_hint}</p>
              </CfFormField>

              <CfFormField label={t.sys_session_timeout} name="sessionTimeout">
                <CfNumberInput
                  modelValue={form.sessionTimeout}
                  onUpdateModelValue={(v) => setForm({ ...form, sessionTimeout: v })}
                  min={5} max={240} step={5} style={{ width: 160 }}
                />
              </CfFormField>
            </CfForm>
          </div>
        </CfTabPanel>

        <CfTabPanel value="security" label={t.sys_security}>
          <div className="adm-settings">
            <CfForm model={form} layout="vertical">
              <CfFormField label={t.sys_two_factor} name="twoFactor">
                <div className="adm-settings__row">
                  <CfSwitch
                    modelValue={form.twoFactor}
                    onUpdateModelValue={(v) => setForm({ ...form, twoFactor: v })}
                  />
                  <span className="adm-settings__hint adm-settings__hint--inline">{t.sys_two_factor_hint}</span>
                </div>
              </CfFormField>

              <CfFormField label={t.sys_password_policy} name="passwordPolicy">
                <CfRadioGroup
                  modelValue={form.passwordPolicy}
                  onUpdateModelValue={(v) => setForm({ ...form, passwordPolicy: v as PasswordPolicy })}
                >
                  <CfRadio value="basic">{t.sys_password_policy_basic}</CfRadio>
                  <CfRadio value="strict">{t.sys_password_policy_strict}</CfRadio>
                  <CfRadio value="paranoid">{t.sys_password_policy_paranoid}</CfRadio>
                </CfRadioGroup>
              </CfFormField>
            </CfForm>
          </div>
        </CfTabPanel>

        <CfTabPanel value="backup" label={t.sys_backup}>
          <div className="adm-settings">
            <CfForm model={form} layout="vertical">
              <CfFormField label={t.sys_next_backup} name="nextBackup">
                <CfDatePicker
                  modelValue={form.nextBackup}
                  onUpdateModelValue={(v) => setForm({ ...form, nextBackup: String(v) })}
                  placeholder={t.sys_next_backup}
                  style={{ width: 220 }}
                />
              </CfFormField>

              <CfFormField label={t.sys_upload_logs} name="files">
                <CfDropzone
                  modelValue={form.files}
                  onUpdateModelValue={(files) => setForm({ ...form, files })}
                  multiple
                  maxSize={20 * 1024 * 1024}
                  accept=".log,.txt,.gz,application/gzip,text/plain"
                />
              </CfFormField>
            </CfForm>
          </div>
        </CfTabPanel>
      </CfTabs>

      <footer className="adm-page__foot">
        <CfButton variant="tertiary" onClick={() => { setForm(initialForm()); toast.info(t.sys_reverted); }}>
          {t.sys_revert}
        </CfButton>
        <CfButton variant="primary" onClick={() => toast.success(t.sys_saved)}>
          {t.sys_save_changes}
        </CfButton>
      </footer>
    </div>
  );
}
