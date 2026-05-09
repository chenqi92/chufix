import type { TitleBarProps } from './variants';

export function TitleBar(props: TitleBarProps) {
  const {
    platform = 'macos',
    title,
    subtitle,
    modified = false,
    size = 'md',
    hideControls = false,
    leading,
    actions,
    titleSlot,
    onMinimize,
    onMaximize,
    onClose,
    className,
  } = props;

  const cls = [
    'cf-titlebar',
    `cf-titlebar--${platform}`,
    `cf-titlebar--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls}>
      {platform === 'macos' && !hideControls ? (
        <div className="cf-titlebar__traffic" aria-label="window controls">
          <button
            type="button"
            className="cf-titlebar__tl cf-titlebar__tl--close"
            aria-label="关闭"
            onClick={() => onClose?.()}
          />
          <button
            type="button"
            className="cf-titlebar__tl cf-titlebar__tl--min"
            aria-label="最小化"
            onClick={() => onMinimize?.()}
          />
          <button
            type="button"
            className="cf-titlebar__tl cf-titlebar__tl--max"
            aria-label="最大化"
            onClick={() => onMaximize?.()}
          />
        </div>
      ) : null}

      <div className="cf-titlebar__leading">{leading}</div>

      <div className="cf-titlebar__title">
        {titleSlot ?? (
          <>
            {title ? <span className="cf-titlebar__doc">{title}</span> : null}
            {subtitle ? (
              <>
                <span className="cf-titlebar__sep">—</span>
                <span>{subtitle}</span>
              </>
            ) : null}
            {modified ? (
              <span className="cf-titlebar__dot" aria-label="未保存">
                ●
              </span>
            ) : null}
          </>
        )}
      </div>

      <div className="cf-titlebar__actions">{actions}</div>

      {(platform === 'windows' || platform === 'linux') && !hideControls ? (
        <div className="cf-titlebar__winctl">
          <button
            type="button"
            className="cf-titlebar__wc"
            aria-label="最小化"
            onClick={() => onMinimize?.()}
          >
            <svg viewBox="0 0 10 10">
              <path d="M0 5 H10" stroke="currentColor" strokeWidth={1} />
            </svg>
          </button>
          <button
            type="button"
            className="cf-titlebar__wc"
            aria-label="最大化"
            onClick={() => onMaximize?.()}
          >
            <svg viewBox="0 0 10 10" fill="none">
              <rect
                x={0.5}
                y={0.5}
                width={9}
                height={9}
                stroke="currentColor"
                strokeWidth={1}
              />
            </svg>
          </button>
          <button
            type="button"
            className="cf-titlebar__wc cf-titlebar__wc--close"
            aria-label="关闭"
            onClick={() => onClose?.()}
          >
            <svg viewBox="0 0 10 10">
              <path
                d="M0 0 L10 10 M10 0 L0 10"
                stroke="currentColor"
                strokeWidth={1}
              />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
