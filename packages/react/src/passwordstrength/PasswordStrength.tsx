import { useMemo, useState } from 'react';
import {
  computeStrength,
  defaultRequirements,
  type PasswordStrengthProps,
} from './variants';

export function PasswordStrength(props: PasswordStrengthProps) {
  const {
    value,
    onChange,
    size = 'md',
    placeholder = '请输入密码',
    disabled = false,
    showToggle = true,
    requirements,
  } = props;

  const reqs = requirements ?? defaultRequirements;
  const strength = useMemo(() => computeStrength(value, reqs), [value, reqs]);
  const [reveal, setReveal] = useState(false);

  const cls = [
    'cf-pwstrength',
    `cf-pwstrength--${size}`,
    disabled && 'is-disabled',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls}>
      <div className="cf-pwstrength__field">
        <input
          type={reveal ? 'text' : 'password'}
          className="cf-pwstrength__input"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
        {showToggle ? (
          <button
            type="button"
            className="cf-pwstrength__toggle"
            aria-label={reveal ? '隐藏密码' : '显示密码'}
            aria-pressed={reveal}
            onClick={() => setReveal((v) => !v)}
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M2 8s2.4-4.5 6-4.5S14 8 14 8s-2.4 4.5-6 4.5S2 8 2 8z"
                stroke="currentColor"
                strokeWidth={1.4}
              />
              <circle
                cx={8}
                cy={8}
                r={2}
                stroke="currentColor"
                strokeWidth={1.4}
              />
              {reveal ? (
                <path
                  d="M2 2l12 12"
                  stroke="currentColor"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                />
              ) : null}
            </svg>
          </button>
        ) : null}
      </div>

      <div className="cf-pwstrength__bars" data-tone={strength.tone}>
        <i className={strength.score >= 1 ? 'on' : ''} />
        <i className={strength.score >= 2 ? 'on' : ''} />
        <i className={strength.score >= 3 ? 'on' : ''} />
        <i className={strength.score >= 4 ? 'on' : ''} />
      </div>

      {value ? (
        <div className="cf-pwstrength__meta">
          强度：
          <span className="cf-pwstrength__lvl" data-tone={strength.tone}>
            {strength.label}
          </span>
        </div>
      ) : null}

      <ul className="cf-pwstrength__reqs">
        {reqs.map((req, i) => (
          <li key={i} className={req.test(value) ? 'is-passed' : ''}>
            <span className="cf-pwstrength__dot" />
            {req.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
