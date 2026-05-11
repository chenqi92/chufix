import { useState } from 'react';
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
} from '@chufix-design/react';

const langs = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English (US)', value: 'en-US' },
  { label: '日本語', value: 'ja-JP' },
];

export function SettingsPage() {
  const [name, setName] = useState('Jane Liu');
  const [email, setEmail] = useState('jane.l@example.com');
  const [bio, setBio] = useState('Backend engineer · payments team · UTC+8');
  const [lang, setLang] = useState('zh-CN');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [notifWeekly, setNotifWeekly] = useState(true);
  const [tfa, setTfa] = useState(true);

  return (
    <div className="set">
      <header className="set__head">
        <h2>设置</h2>
        <p>个人资料、通知偏好与安全设置</p>
      </header>
      <CfTabs
        defaultValue="profile"
        items={[
          { value: 'profile', label: '个人资料' },
          { value: 'notify', label: '通知' },
          { value: 'security', label: '安全' },
        ]}
      >
        {({ active }) => (
          <>
            <CfTabPanel value="profile" active={active}>
              <div className="set__pane">
                <div className="set__avatar">
                  <CfAvatar size="lg">JL</CfAvatar>
                  <CfButton variant="tertiary" size="sm">更换头像</CfButton>
                </div>
                <label className="set__field">
                  <span>姓名</span>
                  <CfInput value={name} onChange={setName} />
                </label>
                <label className="set__field">
                  <span>邮箱</span>
                  <CfInput value={email} onChange={setEmail} type="email" />
                </label>
                <label className="set__field">
                  <span>个人简介</span>
                  <CfTextarea value={bio} onChange={setBio} rows={3} />
                </label>
                <label className="set__field">
                  <span>语言</span>
                  <CfSelect value={lang} onChange={setLang} options={langs} />
                </label>
                <CfDivider />
                <div className="set__actions">
                  <CfButton variant="primary">保存</CfButton>
                  <CfButton variant="tertiary">取消</CfButton>
                </div>
              </div>
            </CfTabPanel>

            <CfTabPanel value="notify" active={active}>
              <div className="set__pane">
                <label className="set__row">
                  <div>
                    <div className="set__row-title">邮件通知</div>
                    <div className="set__row-sub">接收账号活动、安全提醒邮件</div>
                  </div>
                  <CfSwitch checked={notifEmail} onChange={setNotifEmail} />
                </label>
                <label className="set__row">
                  <div>
                    <div className="set__row-title">推送通知</div>
                    <div className="set__row-sub">桌面 Web Push 实时推送</div>
                  </div>
                  <CfSwitch checked={notifPush} onChange={setNotifPush} />
                </label>
                <label className="set__row">
                  <div>
                    <div className="set__row-title">每周摘要</div>
                    <div className="set__row-sub">每周一发送过去 7 天的活跃报告</div>
                  </div>
                  <CfSwitch checked={notifWeekly} onChange={setNotifWeekly} />
                </label>
              </div>
            </CfTabPanel>

            <CfTabPanel value="security" active={active}>
              <div className="set__pane">
                <label className="set__row">
                  <div>
                    <div className="set__row-title">两步验证</div>
                    <div className="set__row-sub">登录时除密码外要求 OTP 验证码</div>
                  </div>
                  <CfSwitch checked={tfa} onChange={setTfa} />
                </label>
                <CfDivider />
                <div className="set__field">
                  <span>修改密码</span>
                  <CfButton variant="secondary">前往修改密码</CfButton>
                </div>
                <div className="set__field">
                  <span>登出所有设备</span>
                  <CfButton variant="danger">立即登出所有会话</CfButton>
                </div>
              </div>
            </CfTabPanel>
          </>
        )}
      </CfTabs>
    </div>
  );
}
