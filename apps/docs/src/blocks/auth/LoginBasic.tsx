import { useState, FormEvent } from 'react';
import {
  CfCard,
  CfInput,
  CfButton,
  CfCheckbox,
  CfLink,
  CfDivider,
} from '@chufix/react';

export function LoginBasic() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    alert(`Sign in: ${email}`);
  }

  return (
    <div className="login">
      <CfCard className="login__card">
        <header className="login__head">
          <h2>登录 ChuFix</h2>
          <p>使用邮箱继续</p>
        </header>
        <form className="login__form" onSubmit={onSubmit}>
          <label className="login__field">
            <span>邮箱</span>
            <CfInput value={email} onChange={(v) => setEmail(v)} type="email" placeholder="you@example.com" required />
          </label>
          <label className="login__field">
            <span className="login__field-row">
              密码
              <CfLink href="#">忘记密码？</CfLink>
            </span>
            <CfInput value={password} onChange={(v) => setPassword(v)} type="password" placeholder="••••••••" required />
          </label>
          <label className="login__remember">
            <CfCheckbox checked={remember} onChange={setRemember} />
            7 天内自动登录
          </label>
          <CfButton variant="primary" block type="submit">登录</CfButton>
        </form>
        <CfDivider />
        <CfButton variant="secondary" block>使用 GitHub 登录</CfButton>
        <p className="login__foot">
          没有账号？<CfLink href="#">立即注册</CfLink>
        </p>
      </CfCard>
    </div>
  );
}
