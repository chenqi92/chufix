import { useState } from 'react';
import {
  CfCard,
  CfStepper,
  CfInput,
  CfButton,
  CfPasswordStrength,
  CfPhoneInput,
  CfCheckbox,
} from '@chufix/react';

const steps = [
  { id: 'account', title: '账号' },
  { id: 'profile', title: '个人' },
  { id: 'verify', title: '验证' },
];

export function RegisterMultiStep() {
  const [current, setCurrent] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('CN');
  const [agreed, setAgreed] = useState(false);

  const canNext =
    (current === 0 && email.length > 3 && password.length >= 8) ||
    (current === 1 && name.length > 0) ||
    (current === 2 && agreed);

  function next() {
    if (current < steps.length - 1) setCurrent(current + 1);
    else alert(`Register: ${email}`);
  }
  function prev() {
    if (current > 0) setCurrent(current - 1);
  }

  return (
    <div className="reg">
      <CfCard className="reg__card">
        <h2>注册新账号</h2>
        <CfStepper items={steps} current={current} />

        {current === 0 && (
          <div className="reg__pane">
            <label className="reg__field">
              <span>邮箱</span>
              <CfInput value={email} onChange={setEmail} type="email" placeholder="you@example.com" />
            </label>
            <label className="reg__field">
              <span>密码</span>
              <CfPasswordStrength value={password} onChange={setPassword} placeholder="至少 8 位，含大小写、数字、符号" />
            </label>
          </div>
        )}

        {current === 1 && (
          <div className="reg__pane">
            <label className="reg__field">
              <span>姓名</span>
              <CfInput value={name} onChange={setName} placeholder="张三" />
            </label>
            <label className="reg__field">
              <span>手机号（可选）</span>
              <CfPhoneInput value={phone} onChange={setPhone} country={country} onCountryChange={setCountry} />
            </label>
          </div>
        )}

        {current === 2 && (
          <div className="reg__pane">
            <p>
              注册即代表你同意 <a href="#">服务条款</a> 与 <a href="#">隐私政策</a>。
            </p>
            <label className="reg__agree">
              <CfCheckbox checked={agreed} onChange={setAgreed} />
              我已阅读并同意上述协议
            </label>
          </div>
        )}

        <div className="reg__actions">
          {current > 0 && <CfButton variant="tertiary" onClick={prev}>上一步</CfButton>}
          <CfButton variant="primary" disabled={!canNext} onClick={next}>
            {current === steps.length - 1 ? '完成注册' : '下一步'}
          </CfButton>
        </div>
      </CfCard>
    </div>
  );
}
