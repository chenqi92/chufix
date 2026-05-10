import { useEffect, useRef, useState } from 'react';
import { CfCard, CfButton, CfOtpInput, CfLink, CfPhoneInput } from '@chufix/react';

export function LoginOtp() {
  const [phone, setPhone] = useState('138 0013 8000');
  const [country, setCountry] = useState('CN');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const timerRef = useRef<number | null>(null);

  function send() {
    setSent(true);
    setRemaining(60);
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1 && timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    if (code.length === 6) alert(`OTP submitted: ${code}`);
  }, [code]);

  useEffect(() => () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
  }, []);

  return (
    <div className="otp">
      <CfCard className="otp__card">
        <h2>短信验证</h2>
        <p>
          我们会向 <strong>+{country === 'CN' ? '86' : '1'} {phone}</strong> 发送一次性验证码。
        </p>

        <div className="otp__phone">
          <CfPhoneInput value={phone} onChange={setPhone} country={country} onCountryChange={setCountry} disabled={sent} />
        </div>

        {sent && (
          <div className="otp__digits">
            <CfOtpInput value={code} onChange={setCode} length={6} />
            <p className="otp__hint">
              {remaining > 0 ? (
                <>没收到？{remaining}s 后可重发</>
              ) : (
                <CfLink href="#" onClick={(e) => { e.preventDefault(); send(); }}>重新发送验证码</CfLink>
              )}
            </p>
          </div>
        )}

        {!sent ? (
          <CfButton variant="primary" block onClick={send}>发送验证码</CfButton>
        ) : (
          <CfButton variant="primary" block disabled={code.length !== 6}>确认</CfButton>
        )}
      </CfCard>
    </div>
  );
}
