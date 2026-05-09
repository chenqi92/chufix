import { useState } from 'react';
import { bannerClass, type BannerProps } from './variants';

export function Banner(props: BannerProps) {
  const {
    tone = 'info',
    variant = 'subtle',
    dismissible = false,
    icon = true,
    sticky = false,
    action,
    className,
    children,
    onDismiss,
  } = props;

  const [closed, setClosed] = useState(false);
  if (closed) return null;

  function dismiss() {
    setClosed(true);
    onDismiss?.();
  }

  const cls = bannerClass({ tone, variant, sticky, className });

  return (
    <div className={cls} role="status">
      {icon === true ? (
        <svg
          className="cf-banner__icon"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 4.5v4M8 11v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ) : icon ? icon : null}
      <div className="cf-banner__content">{children}</div>
      {action ? <div className="cf-banner__action">{action}</div> : null}
      {dismissible ? (
        <button
          type="button"
          className="cf-banner__close"
          aria-label="关闭"
          onClick={dismiss}
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
